import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { 
  MessageSquare, 
  Plus, 
  Pin, 
  Lock, 
  Users, 
  Clock, 
  ThumbsUp, 
  Reply, 
  Eye,
  Video,
  Mic,
  FileText,
  Image,
  Phone,
  Calendar,
  MoreVertical
} from 'lucide-react';
import ForumPost from './ForumPost';
import CreatePostModal from './CreatePostModal';
import GroupCallModal from './GroupCallModal';

const Forum = ({ courseId, lessonId, courseTitle, lessonTitle }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [forums, setForums] = useState([]);
  const [selectedForum, setSelectedForum] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showGroupCall, setShowGroupCall] = useState(false);
  const [activeCalls, setActiveCalls] = useState([]);

  useEffect(() => {
    fetchForums();
    fetchActiveCalls();
  }, [courseId, lessonId]);

  const fetchForums = async () => {
    try {
      const response = await fetch(`/api/forums/course/${courseId}?lessonId=${lessonId || ''}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setForums(data);
      if (data.length > 0) {
        setSelectedForum(data[0]);
        fetchPosts(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching forums:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async (forumId) => {
    try {
      const response = await fetch(`/api/forums/${forumId}/posts`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const fetchActiveCalls = async () => {
    try {
      const response = await fetch(`/api/forums/${selectedForum?.id}/calls?status=active`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setActiveCalls(data);
    } catch (error) {
      console.error('Error fetching active calls:', error);
    }
  };

  const handleForumSelect = (forum) => {
    setSelectedForum(forum);
    fetchPosts(forum.id);
  };

  const handlePostCreated = () => {
    fetchPosts(selectedForum.id);
    setShowCreatePost(false);
  };

  const handleCallCreated = () => {
    fetchActiveCalls();
    setShowGroupCall(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <MessageSquare className="w-6 h-6 mr-2 text-blue-600" />
              {lessonId ? `${lessonTitle} Discussion` : `${courseTitle} Forum`}
            </h2>
            <p className="text-gray-600 mt-1">
              {lessonId ? 'Discuss this lesson with your classmates' : 'Course-wide discussions and Q&A'}
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowGroupCall(true)}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Phone className="w-4 h-4 mr-2" />
              Group Call
            </button>
            <button
              onClick={() => setShowCreatePost(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar - Forum List */}
        <div className="w-1/3 border-r border-gray-200">
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Discussion Topics</h3>
            <div className="space-y-2">
              {forums.map((forum) => (
                <div
                  key={forum.id}
                  onClick={() => handleForumSelect(forum)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedForum?.id === forum.id
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 flex items-center">
                        {forum.title}
                        {forum.isPinned && <Pin className="w-4 h-4 ml-2 text-yellow-600" />}
                        {forum.isLocked && <Lock className="w-4 h-4 ml-2 text-red-600" />}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {forum.description}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center">
                          <MessageSquare className="w-3 h-3 mr-1" />
                          {forum.postCount} posts
                        </span>
                        <span className="flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          {forum.participantCount || 0} participants
                        </span>
                        {forum.lastActivityAt && (
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(forum.lastActivityAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content - Posts */}
        <div className="flex-1">
          {selectedForum ? (
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {selectedForum.title}
                </h3>
                <p className="text-gray-600">{selectedForum.description}</p>
              </div>

              {/* Active Calls */}
              {activeCalls.length > 0 && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2 flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    Active Group Calls
                  </h4>
                  <div className="space-y-2">
                    {activeCalls.map((call) => (
                      <div key={call.id} className="flex items-center justify-between p-2 bg-white rounded border">
                        <div>
                          <span className="font-medium text-gray-900">{call.title}</span>
                          <span className="text-sm text-gray-600 ml-2">
                            {call.currentParticipants}/{call.maxParticipants} participants
                          </span>
                        </div>
                        <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                          Join
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Posts List */}
              <div className="space-y-4">
                {posts.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                    <p className="text-gray-600 mb-4">Be the first to start a discussion!</p>
                    <button
                      onClick={() => setShowCreatePost(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Create First Post
                    </button>
                  </div>
                ) : (
                  posts.map((post) => (
                    <ForumPost
                      key={post.id}
                      post={post}
                      onReply={() => setShowCreatePost(true)}
                      onReaction={(postId, reactionType) => {
                        // Handle reaction
                        console.log('Reaction:', postId, reactionType);
                      }}
                    />
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="p-6 text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No forums available</h3>
              <p className="text-gray-600">Create a discussion topic to get started.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showCreatePost && (
        <CreatePostModal
          forumId={selectedForum?.id}
          onClose={() => setShowCreatePost(false)}
          onPostCreated={handlePostCreated}
        />
      )}

      {showGroupCall && (
        <GroupCallModal
          forumId={selectedForum?.id}
          onClose={() => setShowGroupCall(false)}
          onCallCreated={handleCallCreated}
        />
      )}
    </div>
  );
};

export default Forum;

