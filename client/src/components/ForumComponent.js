import React, { useState } from 'react';
import { MessageCircle, Send, Users, Clock, ThumbsUp, Reply } from 'lucide-react';

const ForumComponent = ({ forumData }) => {
  const [activeTopic, setActiveTopic] = useState(0);
  const [newPost, setNewPost] = useState('');
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'Sarah Johnson',
      avatar: 'SJ',
      content: 'Just finished setting up VS Code! The Live Server extension is amazing for testing HTML pages.',
      timestamp: '2 hours ago',
      likes: 5,
      replies: 2,
      topic: 0
    },
    {
      id: 2,
      author: 'Mike Chen',
      avatar: 'MC',
      content: 'Having trouble with the button click event. Can someone help me with the JavaScript?',
      timestamp: '1 hour ago',
      likes: 3,
      replies: 1,
      topic: 2
    },
    {
      id: 3,
      author: 'Emma Wilson',
      avatar: 'EW',
      content: 'My first HTML page is working perfectly! The styling looks great.',
      timestamp: '30 minutes ago',
      likes: 8,
      replies: 0,
      topic: 1
    }
  ]);

  const handlePost = () => {
    if (newPost.trim()) {
      const post = {
        id: posts.length + 1,
        author: 'You',
        avatar: 'Y',
        content: newPost,
        timestamp: 'Just now',
        likes: 0,
        replies: 0,
        topic: activeTopic
      };
      setPosts([post, ...posts]);
      setNewPost('');
    }
  };

  const filteredPosts = posts.filter(post => post.topic === activeTopic);

  return (
    <div className="space-y-6">
      {/* Forum Header */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <MessageCircle className="w-5 h-5 text-blue-600" />
          <h4 className="text-lg font-semibold text-blue-900">{forumData.title}</h4>
        </div>
        <p className="text-blue-800">{forumData.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Topics Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h5 className="font-semibold text-gray-900 mb-3">Discussion Topics</h5>
            <div className="space-y-2">
              {forumData.topics.map((topic, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTopic(index)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    activeTopic === index
                      ? 'bg-blue-50 border border-blue-200 text-blue-900'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{topic}</span>
                    <span className="text-xs text-gray-500">
                      {posts.filter(post => post.topic === index).length} posts
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Posts Area */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-gray-200 rounded-lg">
            {/* New Post Form */}
            <div className="p-4 border-b border-gray-200">
              <h5 className="font-semibold text-gray-900 mb-3">
                Post in: {forumData.topics[activeTopic]}
              </h5>
              <div className="space-y-3">
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="Share your thoughts, ask questions, or help others..."
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handlePost}
                    disabled={!newPost.trim()}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Post
                  </button>
                </div>
              </div>
            </div>

            {/* Posts List */}
            <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
              {filteredPosts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No posts yet. Be the first to start the discussion!</p>
                </div>
              ) : (
                filteredPosts.map((post) => (
                  <div key={post.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {post.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-900">{post.author}</span>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-500">{post.timestamp}</span>
                        </div>
                        <p className="text-gray-800 mb-3">{post.content}</p>
                        <div className="flex items-center space-x-4">
                          <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600">
                            <ThumbsUp className="w-4 h-4" />
                            <span className="text-sm">{post.likes}</span>
                          </button>
                          <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600">
                            <Reply className="w-4 h-4" />
                            <span className="text-sm">{post.replies}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumComponent;

