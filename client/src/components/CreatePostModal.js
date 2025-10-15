import React, { useState } from 'react';
import { 
  X, 
  Video, 
  Mic, 
  FileText, 
  Image, 
  Send,
  AlertCircle,
  Pin
} from 'lucide-react';

const CreatePostModal = ({ forumId, onClose, onPostCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    postType: 'text',
    tags: []
  });
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const postTypes = [
    { value: 'text', label: 'Text Post', icon: FileText, color: 'text-gray-600' },
    { value: 'question', label: 'Question', icon: '?', color: 'text-blue-600' },
    { value: 'discussion', label: 'Discussion', icon: '💬', color: 'text-green-600' },
    { value: 'announcement', label: 'Announcement', icon: Pin, color: 'text-yellow-600' },
    { value: 'video', label: 'Video Post', icon: Video, color: 'text-red-600' },
    { value: 'audio', label: 'Audio Post', icon: Mic, color: 'text-purple-600' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file);
      
      // Create preview for images and videos
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setMediaPreview({ type: 'image', url: e.target.result });
        reader.readAsDataURL(file);
      } else if (file.type.startsWith('video/')) {
        const reader = new FileReader();
        reader.onload = (e) => setMediaPreview({ type: 'video', url: e.target.result });
        reader.readAsDataURL(file);
      }
    }
  };

  const handleTagAdd = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      const newTag = e.target.value.trim();
      if (!formData.tags.includes(newTag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag]
        }));
        e.target.value = '';
      }
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const uploadMedia = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'forum');

    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUploading(true);

    try {
      let mediaUrl = null;
      let mediaType = null;
      let mediaDuration = null;

      // Upload media if present
      if (mediaFile) {
        mediaUrl = await uploadMedia(mediaFile);
        mediaType = mediaFile.type.split('/')[0]; // 'image', 'video', 'audio'
        
        // For audio/video, we could extract duration here
        if (mediaFile.type.startsWith('audio/') || mediaFile.type.startsWith('video/')) {
          // Duration extraction would go here
          mediaDuration = 0; // Placeholder
        }
      }

      const response = await fetch(`/api/forums/${forumId}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          postType: formData.postType,
          mediaUrl,
          mediaType,
          mediaDuration,
          tags: formData.tags
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create post');
      }

      onPostCreated();
    } catch (error) {
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create New Post</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Post Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Post Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {postTypes.map((type) => (
                <label
                  key={type.value}
                  className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                    formData.postType === type.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="postType"
                    value={type.value}
                    checked={formData.postType === type.value}
                    onChange={(e) => handleInputChange('postType', e.target.value)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 ${type.color}`}>
                    {typeof type.icon === 'string' ? (
                      <span className="text-lg">{type.icon}</span>
                    ) : (
                      <type.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {type.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title (Optional)
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 bg-white"
              placeholder="Enter post title"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 bg-white resize-vertical"
              placeholder="What would you like to discuss?"
              required
            />
          </div>

          {/* Media Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Media (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                className="hidden"
                id="media-upload"
              />
              <label
                htmlFor="media-upload"
                className="cursor-pointer flex flex-col items-center space-y-2"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <Image className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Click to upload media
                  </p>
                  <p className="text-xs text-gray-500">
                    Images, videos, audio, or documents
                  </p>
                </div>
              </label>
            </div>

            {/* Media Preview */}
            {mediaPreview && (
              <div className="mt-4">
                {mediaPreview.type === 'image' && (
                  <img
                    src={mediaPreview.url}
                    alt="Preview"
                    className="max-w-full h-48 object-cover rounded-lg border border-gray-200"
                  />
                )}
                {mediaPreview.type === 'video' && (
                  <video
                    src={mediaPreview.url}
                    controls
                    className="max-w-full h-48 rounded-lg border border-gray-200"
                  />
                )}
                {mediaFile && (
                  <div className="mt-2 flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700">{mediaFile.name}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setMediaFile(null);
                        setMediaPreview(null);
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (Optional)
            </label>
            <div className="space-y-2">
              <input
                type="text"
                onKeyPress={handleTagAdd}
                placeholder="Type a tag and press Enter"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 bg-white"
              />
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleTagRemove(tag)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || !formData.content.trim()}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Posting...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Post</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;

