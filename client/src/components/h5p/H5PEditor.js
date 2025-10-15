import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Save, 
  Eye, 
  Trash2, 
  Download, 
  Upload,
  Play,
  Settings,
  FileText,
  Video,
  Image,
  BarChart3
} from 'lucide-react';

const H5PEditor = ({ onContentCreated, onContentUpdated }) => {
  const [contentTypes, setContentTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [contentTitle, setContentTitle] = useState('');
  const [contentDescription, setContentDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [existingContent, setExistingContent] = useState([]);
  const [showContentList, setShowContentList] = useState(false);

  // H5P content types available
  const h5pContentTypes = [
    {
      id: 'H5P.InteractiveVideo',
      name: 'Interactive Video',
      description: 'Create videos with embedded questions and interactions',
      icon: Video,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 'H5P.DragQuestion',
      name: 'Drag & Drop',
      description: 'Create drag and drop exercises',
      icon: Settings,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      id: 'H5P.QuestionSet',
      name: 'Question Set',
      description: 'Create multiple choice and other question types',
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      id: 'H5P.Presentation',
      name: 'Presentation',
      description: 'Create interactive presentations',
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      id: 'H5P.ImageHotspots',
      name: 'Image Hotspots',
      description: 'Create interactive images with clickable areas',
      icon: Image,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200'
    }
  ];

  useEffect(() => {
    loadExistingContent();
  }, []);

  const loadExistingContent = async () => {
    try {
      const response = await fetch('/api/h5p/content');
      const data = await response.json();
      
      if (data.success) {
        setExistingContent(data.contents || []);
      }
    } catch (error) {
      console.error('Error loading existing content:', error);
    }
  };

  const handleCreateContent = async () => {
    if (!selectedType || !contentTitle.trim()) {
      setError('Please select a content type and enter a title');
      return;
    }

    setIsCreating(true);
    setError('');
    setSuccess('');

    try {
      const contentData = {
        library: selectedType,
        params: {
          title: contentTitle,
          description: contentDescription
        },
        metadata: {
          title: contentTitle,
          description: contentDescription,
          a11yTitle: contentTitle
        }
      };

      const response = await fetch('/api/h5p/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(contentData)
      });

      const result = await response.json();

      if (result.success) {
        setSuccess('H5P content created successfully!');
        setContentTitle('');
        setContentDescription('');
        setSelectedType('');
        loadExistingContent();
        
        if (onContentCreated) {
          onContentCreated(result.content);
        }
      } else {
        setError(result.message || 'Failed to create content');
      }
    } catch (error) {
      console.error('Error creating content:', error);
      setError('Failed to create content: ' + error.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteContent = async (contentId) => {
    if (!window.confirm('Are you sure you want to delete this content?')) {
      return;
    }

    try {
      const response = await fetch(`/api/h5p/content/${contentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const result = await response.json();

      if (result.success) {
        setSuccess('Content deleted successfully!');
        loadExistingContent();
      } else {
        setError(result.message || 'Failed to delete content');
      }
    } catch (error) {
      console.error('Error deleting content:', error);
      setError('Failed to delete content: ' + error.message);
    }
  };

  const getContentTypeInfo = (libraryId) => {
    return h5pContentTypes.find(type => type.id === libraryId) || {
      name: 'Unknown',
      icon: FileText,
      color: 'text-gray-600'
    };
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Plus className="w-8 h-8 mr-3 text-blue-600" />
            H5P Content Editor
          </h1>
          <button
            onClick={() => setShowContentList(!showContentList)}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
          >
            <Eye className="w-4 h-4" />
            <span>{showContentList ? 'Hide' : 'Show'} Existing Content</span>
          </button>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-green-800">Success</h3>
            <p className="text-sm text-green-700 mt-1">{success}</p>
          </div>
        )}

        {/* Content Creation Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Content Type Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Select Content Type</h3>
            <div className="grid grid-cols-1 gap-3">
              {h5pContentTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <label
                    key={type.id}
                    className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedType === type.id
                        ? 'border-blue-500 bg-blue-50'
                        : `${type.borderColor} ${type.bgColor} hover:border-gray-300`
                    }`}
                  >
                    <input
                      type="radio"
                      name="contentType"
                      value={type.id}
                      checked={selectedType === type.id}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-3">
                      <IconComponent className={`w-6 h-6 ${type.color}`} />
                      <div>
                        <div className={`font-medium ${type.color}`}>{type.name}</div>
                        <div className="text-sm text-gray-500">{type.description}</div>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Content Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Content Details</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Title *
              </label>
              <input
                type="text"
                value={contentTitle}
                onChange={(e) => setContentTitle(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
                placeholder="Enter content title"
                style={{ fontSize: '16px' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={contentDescription}
                onChange={(e) => setContentDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
                placeholder="Enter content description"
                style={{ fontSize: '16px' }}
              />
            </div>

            <button
              onClick={handleCreateContent}
              disabled={!selectedType || !contentTitle.trim() || isCreating}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isCreating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>Create H5P Content</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Existing Content List */}
        {showContentList && (
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Existing Content</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {existingContent.map((content) => {
                const typeInfo = getContentTypeInfo(content.library);
                const IconComponent = typeInfo.icon;
                
                return (
                  <div key={content.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <IconComponent className={`w-6 h-6 ${typeInfo.color}`} />
                        <div>
                          <h4 className="font-medium text-gray-900">{content.title || 'Untitled'}</h4>
                          <p className="text-sm text-gray-500">{typeInfo.name}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteContent(content.id)}
                        className="p-1 text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
                        <Play className="w-3 h-3 inline mr-1" />
                        View
                      </button>
                      <button className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors">
                        <Settings className="w-3 h-3 inline mr-1" />
                        Edit
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-medium text-yellow-800 mb-2">How to Use H5P Editor</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>1. <strong>Select Content Type:</strong> Choose the type of interactive content you want to create</li>
            <li>2. <strong>Enter Details:</strong> Provide a title and description for your content</li>
            <li>3. <strong>Create Content:</strong> Click "Create H5P Content" to generate the content</li>
            <li>4. <strong>Edit Content:</strong> Use the H5P editor to customize your interactive content</li>
            <li>5. <strong>Publish:</strong> Save and publish your content to use in courses</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default H5PEditor;
