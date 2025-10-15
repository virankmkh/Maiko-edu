import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings, Download, Share2 } from 'lucide-react';

const H5PPlayer = ({ contentId, onContentComplete, onProgress }) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [h5pInstance, setH5pInstance] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (contentId) {
      loadContent();
    }
  }, [contentId]);

  const loadContent = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`/api/h5p/content/${contentId}`);
      const data = await response.json();

      if (data.success) {
        setContent(data.content);
        initializeH5PPlayer(data.content);
      } else {
        setError(data.message || 'Failed to load content');
      }
    } catch (error) {
      console.error('Error loading H5P content:', error);
      setError('Failed to load content: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const initializeH5PPlayer = (contentData) => {
    // Wait for container to be ready
    setTimeout(() => {
      const container = document.getElementById('h5p-player-container');
      
      if (!container) {
        setError('H5P player container not found');
        return;
      }

      try {
        // Clear container
        container.innerHTML = '';

        // Create H5P iframe
        const iframe = document.createElement('iframe');
        iframe.src = `${process.env.REACT_APP_H5P_URL || 'http://localhost:3000'}/h5p/content/${contentId}`;
        iframe.width = '100%';
        iframe.height = '500px';
        iframe.frameBorder = '0';
        iframe.allowFullscreen = true;
        iframe.style.border = 'none';
        iframe.style.borderRadius = '8px';

        // Add event listeners
        iframe.onload = () => {
          console.log('H5P content loaded');
          setIsPlaying(true);
        };

        iframe.onerror = () => {
          setError('Failed to load H5P content');
        };

        container.appendChild(iframe);
        setH5pInstance(iframe);

        // Listen for H5P events
        window.addEventListener('message', handleH5PMessage);

      } catch (error) {
        console.error('Error initializing H5P player:', error);
        setError('Failed to initialize H5P player: ' + error.message);
      }
    }, 100);
  };

  const handleH5PMessage = (event) => {
    // Handle messages from H5P content
    if (event.data && event.data.type) {
      switch (event.data.type) {
        case 'h5p-content-completed':
          console.log('H5P content completed');
          if (onContentComplete) {
            onContentComplete(event.data);
          }
          break;
        case 'h5p-progress':
          console.log('H5P progress:', event.data.progress);
          setProgress(event.data.progress);
          if (onProgress) {
            onProgress(event.data.progress);
          }
          break;
        default:
          console.log('H5P message:', event.data);
      }
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
    // Send play command to H5P iframe
    if (h5pInstance && h5pInstance.contentWindow) {
      h5pInstance.contentWindow.postMessage({ type: 'h5p-play' }, '*');
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
    // Send pause command to H5P iframe
    if (h5pInstance && h5pInstance.contentWindow) {
      h5pInstance.contentWindow.postMessage({ type: 'h5p-pause' }, '*');
    }
  };

  const handleRestart = () => {
    setProgress(0);
    // Reload the H5P content
    if (h5pInstance) {
      h5pInstance.src = h5pInstance.src;
    }
  };

  const handleDownload = () => {
    // Download H5P content
    const link = document.createElement('a');
    link.href = `/api/h5p/content/${contentId}/download`;
    link.download = `${content?.title || 'h5p-content'}.h5p`;
    link.click();
  };

  const handleShare = () => {
    // Share H5P content
    if (navigator.share) {
      navigator.share({
        title: content?.title || 'H5P Content',
        text: content?.description || 'Check out this interactive content',
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.removeEventListener('message', handleH5PMessage);
    };
  }, []);

  if (loading) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading H5P content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-96 bg-red-50 rounded-lg border-2 border-red-200 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 text-red-500 mx-auto mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Content</h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={loadContent}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Content Header */}
      {content && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {content.title || 'Untitled Content'}
              </h2>
              {content.description && (
                <p className="text-gray-600 mb-4">{content.description}</p>
              )}
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500">Progress: {Math.round(progress)}%</p>
            </div>

            {/* Control Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={isPlaying ? handlePause : handlePlay}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              
              <button
                onClick={handleRestart}
                className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                title="Restart"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              
              <button
                onClick={handleDownload}
                className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                title="Download"
              >
                <Download className="w-5 h-5" />
              </button>
              
              <button
                onClick={handleShare}
                className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                title="Share"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* H5P Player Container */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div 
          id="h5p-player-container"
          ref={containerRef}
          className="w-full min-h-96 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center"
        >
          <div className="text-center">
            <Play className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">H5P Content Player</p>
            <p className="text-xs text-gray-400 mt-2">Loading interactive content...</p>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-800 mb-2">Interactive Content</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Use the control buttons to play, pause, or restart the content</li>
          <li>• Follow the interactive elements and complete all activities</li>
          <li>• Your progress will be automatically saved</li>
          <li>• Download or share the content using the action buttons</li>
        </ul>
      </div>
    </div>
  );
};

export default H5PPlayer;
