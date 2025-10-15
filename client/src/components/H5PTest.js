import React, { useState } from 'react';
import { Plus, Play, Settings, FileText, Video, BarChart3 } from 'lucide-react';
import H5PEditor from './h5p/H5PEditor';
import H5PPlayer from './h5p/H5PPlayer';

const H5PTest = () => {
  const [activeTab, setActiveTab] = useState('editor');
  const [selectedContentId, setSelectedContentId] = useState(null);
  const [testContentId, setTestContentId] = useState('');

  const handleContentCreated = (content) => {
    console.log('Content created:', content);
    setSelectedContentId(content.id);
    setActiveTab('player');
  };

  const handleTestContent = () => {
    if (testContentId.trim()) {
      setSelectedContentId(parseInt(testContentId));
      setActiveTab('player');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <FileText className="w-8 h-8 mr-3 text-green-600" />
            H5P Interactive Content Test
          </h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                activeTab === 'editor'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Editor</span>
            </button>
            <button
              onClick={() => setActiveTab('player')}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                activeTab === 'player'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Play className="w-4 h-4" />
              <span>Player</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'editor' && (
          <H5PEditor onContentCreated={handleContentCreated} />
        )}

        {activeTab === 'player' && (
          <div className="space-y-6">
            {/* Test Content ID Input */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">Test Existing Content</h3>
              <div className="flex space-x-3">
                <input
                  type="number"
                  value={testContentId}
                  onChange={(e) => setTestContentId(e.target.value)}
                  placeholder="Enter content ID to test"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleTestContent}
                  disabled={!testContentId.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Play className="w-4 h-4" />
                  <span>Load Content</span>
                </button>
              </div>
            </div>

            {/* H5P Player */}
            {selectedContentId ? (
              <H5PPlayer 
                contentId={selectedContentId}
                onContentComplete={(data) => {
                  console.log('Content completed:', data);
                  alert('Content completed successfully!');
                }}
                onProgress={(progress) => {
                  console.log('Progress:', progress);
                }}
              />
            ) : (
              <div className="w-full h-96 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                <div className="text-center">
                  <Play className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">No content selected</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Create new content or enter a content ID to test
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Feature Overview */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-medium text-green-800 mb-3">H5P Interactive Content Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-start space-x-3">
              <Video className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h4 className="font-medium text-green-800">Interactive Videos</h4>
                <p className="text-sm text-green-700">Embed questions and interactions in videos</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Settings className="w-6 h-6 text-green-600 mt-1" />
              <div>
                <h4 className="font-medium text-green-800">Drag & Drop</h4>
                <p className="text-sm text-green-700">Create hands-on learning exercises</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <BarChart3 className="w-6 h-6 text-purple-600 mt-1" />
              <div>
                <h4 className="font-medium text-green-800">Quizzes</h4>
                <p className="text-sm text-green-700">Multiple choice and other question types</p>
              </div>
            </div>
          </div>
        </div>

        {/* Testing Instructions */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-medium text-yellow-800 mb-2">Testing Instructions</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li><strong>Editor Tab:</strong> Create new H5P interactive content</li>
            <li><strong>Player Tab:</strong> Test and view existing H5P content</li>
            <li><strong>Content Types:</strong> Interactive videos, drag & drop, quizzes, presentations</li>
            <li><strong>Features:</strong> Progress tracking, completion detection, mobile support</li>
            <li><strong>Integration:</strong> Content can be embedded in courses and lessons</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default H5PTest;
