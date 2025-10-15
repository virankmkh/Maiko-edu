import React, { useState, useEffect } from 'react';

const ForumManagementModal = ({ isOpen, onClose, course }) => {
  const [forums, setForums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedForum, setSelectedForum] = useState(null);
  const [posts, setPosts] = useState([]);
  const [showCreateForum, setShowCreateForum] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newForum, setNewForum] = useState({
    title: '',
    description: '',
    lessonId: null,
    isPinned: false
  });
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    postType: 'text',
    mediaFile: null,
    mediaType: null
  });

  useEffect(() => {
    if (isOpen && course) {
      loadForums();
    }
  }, [isOpen, course]);

  const loadForums = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/forums/course/${course.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setForums(data);
      } else {
        console.error('Failed to load forums');
      }
    } catch (error) {
      console.error('Error loading forums:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPosts = async (forumId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/forums/${forumId}/posts`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  };

  const handleCreateForum = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/forums/course/${course.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newForum)
      });

      if (response.ok) {
        setNewForum({ title: '', description: '', lessonId: null, isPinned: false });
        setShowCreateForum(false);
        loadForums();
      } else {
        console.error('Failed to create forum');
      }
    } catch (error) {
      console.error('Error creating forum:', error);
    }
  };

  const handlePinForum = async (forumId, isPinned) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/forums/${forumId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isPinned: !isPinned })
      });

      if (response.ok) {
        loadForums();
      }
    } catch (error) {
      console.error('Error updating forum:', error);
    }
  };

  const handleLockForum = async (forumId, isLocked) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/forums/${forumId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isLocked: !isLocked })
      });

      if (response.ok) {
        loadForums();
      }
    } catch (error) {
      console.error('Error updating forum:', error);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/forums/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        loadPosts(selectedForum.id);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!selectedForum || !newPost.content.trim()) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      formData.append('title', newPost.title);
      formData.append('content', newPost.content);
      formData.append('postType', newPost.postType);
      
      if (newPost.mediaFile) {
        formData.append('mediaFile', newPost.mediaFile);
        formData.append('mediaType', newPost.mediaType);
      }

      const response = await fetch(`http://localhost:5001/api/forums/${selectedForum.id}/posts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        setNewPost({
          title: '',
          content: '',
          postType: 'text',
          mediaFile: null,
          mediaType: null
        });
        setShowCreatePost(false);
        loadPosts(selectedForum.id);
      } else {
        console.error('Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPost({
        ...newPost,
        mediaFile: file,
        mediaType: file.type
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Forum Management - {course?.title}</h2>
          <button 
            onClick={onClose} 
            className="text-white hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Forums List */}
          <div className="w-1/3 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Forums</h3>
                <button
                  onClick={() => setShowCreateForum(true)}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                >
                  + New Forum
                </button>
              </div>

              {/* Create Forum Form */}
              {showCreateForum && (
                <form onSubmit={handleCreateForum} className="mb-4 p-3 bg-gray-50 rounded">
                  <input
                    type="text"
                    placeholder="Forum Title"
                    value={newForum.title}
                    onChange={(e) => setNewForum({...newForum, title: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded mb-2 text-gray-900"
                    required
                  />
                  <textarea
                    placeholder="Description"
                    value={newForum.description}
                    onChange={(e) => setNewForum({...newForum, description: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded mb-2 text-gray-900"
                    rows="3"
                    required
                  />
                  <div className="flex items-center space-x-2 mb-2">
                    <input
                      type="checkbox"
                      id="isPinned"
                      checked={newForum.isPinned}
                      onChange={(e) => setNewForum({...newForum, isPinned: e.target.checked})}
                      className="rounded"
                    />
                    <label htmlFor="isPinned" className="text-sm text-gray-700">Pin to top</label>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                    >
                      Create
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCreateForum(false)}
                      className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-gray-500">Loading forums...</div>
              ) : (
                <div className="space-y-2 p-2">
                  {forums.map(forum => (
                    <div
                      key={forum.id}
                      className={`p-3 rounded cursor-pointer border ${
                        selectedForum?.id === forum.id
                          ? 'bg-blue-100 border-blue-300'
                          : 'bg-white border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => {
                        setSelectedForum(forum);
                        loadPosts(forum.id);
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm">
                            {forum.isPinned && '📌 '}{forum.title}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {forum.description}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="text-xs text-gray-500">
                              {forum.postCount} posts
                            </span>
                            {forum.lesson && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                Lesson: {forum.lesson.title}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col space-y-1 ml-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePinForum(forum.id, forum.isPinned);
                            }}
                            className={`text-xs px-2 py-1 rounded ${
                              forum.isPinned
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                            title={forum.isPinned ? 'Unpin' : 'Pin'}
                          >
                            {forum.isPinned ? '📌' : '📌'}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLockForum(forum.id, forum.isLocked);
                            }}
                            className={`text-xs px-2 py-1 rounded ${
                              forum.isLocked
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                            title={forum.isLocked ? 'Unlock' : 'Lock'}
                          >
                            {forum.isLocked ? '🔒' : '🔓'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Posts View */}
          <div className="flex-1 flex flex-col">
            {selectedForum ? (
              <>
                <div className="p-4 border-b border-gray-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {selectedForum.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {selectedForum.description}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>{selectedForum.postCount} posts</span>
                        <span>Last activity: {selectedForum.lastActivityAt ? new Date(selectedForum.lastActivityAt).toLocaleDateString() : 'Never'}</span>
                        {selectedForum.isLocked && <span className="text-red-600">🔒 Locked</span>}
                      </div>
                    </div>
                    <button
                      onClick={() => setShowCreatePost(!showCreatePost)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      + New Post
                    </button>
                  </div>
                </div>

                {/* Create Post Form */}
                {showCreatePost && (
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <form onSubmit={handleCreatePost} className="space-y-4">
                      <div>
                        <input
                          type="text"
                          placeholder="Post Title (optional)"
                          value={newPost.title}
                          onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
                        />
                      </div>
                      
                      <div>
                        <textarea
                          placeholder="What's on your mind?"
                          value={newPost.content}
                          onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
                          rows="3"
                          required
                        />
                      </div>

                      <div className="flex items-center space-x-4">
                        <select
                          value={newPost.postType}
                          onChange={(e) => setNewPost({...newPost, postType: e.target.value})}
                          className="p-2 border border-gray-300 rounded-lg text-gray-900"
                        >
                          <option value="text">📝 Text</option>
                          <option value="question">❓ Question</option>
                          <option value="announcement">📢 Announcement</option>
                          <option value="discussion">💬 Discussion</option>
                        </select>

                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="file"
                            accept="image/*,video/*,audio/*"
                            onChange={handleMediaChange}
                            className="hidden"
                          />
                          <span className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-lg text-sm">
                            📎 Attach Media
                          </span>
                        </label>

                        {newPost.mediaFile && (
                          <span className="text-sm text-gray-600">
                            📎 {newPost.mediaFile.name}
                          </span>
                        )}
                      </div>

                      <div className="flex justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => setShowCreatePost(false)}
                          className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                          Post
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-4">
                    {Array.isArray(posts) ? posts.map(post => (
                      <div key={post.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-gray-900">
                              {post.title || 'No title'}
                            </h4>
                            <span className={`text-xs px-2 py-1 rounded ${
                              post.postType === 'announcement' ? 'bg-red-100 text-red-800' :
                              post.postType === 'question' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {post.postType}
                            </span>
                            {post.isPinned && <span className="text-xs text-yellow-600">📌</span>}
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleDeletePost(post.id)}
                              className="text-red-600 hover:text-red-800 text-sm"
                              title="Delete post"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm mb-2">{post.content}</p>
                        
                        {/* Display media if present */}
                        {post.mediaUrl && (
                          <div className="mb-3">
                            {post.mediaType?.startsWith('image/') && (
                              <img 
                                src={`http://localhost:5001${post.mediaUrl}`} 
                                alt="Post media" 
                                className="max-w-full h-auto rounded-lg"
                                style={{ maxHeight: '300px' }}
                              />
                            )}
                            {post.mediaType?.startsWith('video/') && (
                              <video 
                                src={`http://localhost:5001${post.mediaUrl}`} 
                                controls 
                                className="max-w-full h-auto rounded-lg"
                                style={{ maxHeight: '300px' }}
                              >
                                Your browser does not support the video tag.
                              </video>
                            )}
                            {post.mediaType?.startsWith('audio/') && (
                              <audio 
                                src={`http://localhost:5001${post.mediaUrl}`} 
                                controls 
                                className="w-full"
                              >
                                Your browser does not support the audio tag.
                              </audio>
                            )}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center space-x-4">
                            <span>By: {post.author?.firstName} {post.author?.lastName}</span>
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span>👍 {post.likeCount}</span>
                            <span>💬 {post.replyCount}</span>
                            <span>👁️ {post.viewCount}</span>
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center text-gray-500 py-8">
                        <div className="text-4xl mb-4">📝</div>
                        <h3 className="text-lg font-medium mb-2">No Posts Yet</h3>
                        <p>This forum doesn't have any posts yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <div className="text-4xl mb-4">💬</div>
                  <h3 className="text-lg font-medium mb-2">Select a Forum</h3>
                  <p>Choose a forum from the list to view and manage posts.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumManagementModal;
