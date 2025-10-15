import React, { useState } from 'react';
import { 
  ThumbsUp, 
  Reply, 
  Eye, 
  MoreVertical, 
  Heart, 
  Smile, 
  Frown, 
  Angry, 
  Laugh, 
  Star,
  Video,
  Mic,
  FileText,
  Image,
  Clock,
  User,
  Pin,
  Lock
} from 'lucide-react';

const ForumPost = ({ post, onReply, onReaction }) => {
  const [showReactions, setShowReactions] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const reactionTypes = [
    { type: 'like', icon: ThumbsUp, color: 'text-blue-600' },
    { type: 'love', icon: Heart, color: 'text-red-600' },
    { type: 'laugh', icon: Laugh, color: 'text-yellow-600' },
    { type: 'wow', icon: Star, color: 'text-purple-600' },
    { type: 'sad', icon: Frown, color: 'text-gray-600' },
    { type: 'angry', icon: Angry, color: 'text-red-700' }
  ];

  const formatTimeAgo = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInSeconds = Math.floor((now - postDate) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const getPostTypeIcon = (postType) => {
    switch (postType) {
      case 'video': return Video;
      case 'audio': return Mic;
      case 'announcement': return Pin;
      case 'question': return '?';
      default: return FileText;
    }
  };

  const PostTypeIcon = getPostTypeIcon(post.postType);

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 ${post.isPinned ? 'ring-2 ring-yellow-200 bg-yellow-50' : ''}`}>
      {/* Post Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            {post.author?.avatar ? (
              <img 
                src={post.author.avatar} 
                alt={post.author.firstName}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <User className="w-5 h-5 text-blue-600" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h4 className="font-semibold text-gray-900">
                {post.author?.firstName} {post.author?.lastName}
              </h4>
              {post.author?.role === 'instructor' && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                  Instructor
                </span>
              )}
              {post.isPinned && (
                <Pin className="w-4 h-4 text-yellow-600" />
              )}
              {post.isLocked && (
                <Lock className="w-4 h-4 text-red-600" />
              )}
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>{formatTimeAgo(post.createdAt)}</span>
              <span>•</span>
              <div className="flex items-center space-x-1">
                {typeof PostTypeIcon === 'string' ? (
                  <span className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold">
                    {PostTypeIcon}
                  </span>
                ) : (
                  <PostTypeIcon className="w-4 h-4" />
                )}
                <span className="capitalize">{post.postType}</span>
              </div>
              {post.tags && post.tags.length > 0 && (
                <>
                  <span>•</span>
                  <div className="flex space-x-1">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <button className="p-1 hover:bg-gray-100 rounded">
          <MoreVertical className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Post Title */}
      {post.title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-3">{post.title}</h3>
      )}

      {/* Post Content */}
      <div className="mb-4">
        <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* Media Content */}
      {post.mediaUrl && (
        <div className="mb-4">
          {post.mediaType === 'image' && (
            <img 
              src={post.mediaUrl} 
              alt="Post media"
              className="max-w-full h-auto rounded-lg border border-gray-200"
            />
          )}
          {post.mediaType === 'video' && (
            <video 
              src={post.mediaUrl} 
              controls
              className="max-w-full h-auto rounded-lg border border-gray-200"
            >
              Your browser does not support the video tag.
            </video>
          )}
          {post.mediaType === 'audio' && (
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <Mic className="w-6 h-6 text-gray-600" />
              <audio src={post.mediaUrl} controls className="flex-1">
                Your browser does not support the audio tag.
              </audio>
              {post.mediaDuration && (
                <span className="text-sm text-gray-500">
                  {Math.floor(post.mediaDuration / 60)}:{(post.mediaDuration % 60).toString().padStart(2, '0')}
                </span>
              )}
            </div>
          )}
          {post.mediaType === 'document' && (
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <FileText className="w-6 h-6 text-gray-600" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">Document</p>
                <p className="text-sm text-gray-500">Click to download</p>
              </div>
              <a 
                href={post.mediaUrl} 
                download
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                Download
              </a>
            </div>
          )}
        </div>
      )}

      {/* Post Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-6">
          {/* Reactions */}
          <div className="relative">
            <button
              onClick={() => setShowReactions(!showReactions)}
              className="flex items-center space-x-2 px-3 py-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ThumbsUp className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">{post.likeCount || 0}</span>
            </button>
            
            {showReactions && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex space-x-1 z-10">
                {reactionTypes.map((reaction) => (
                  <button
                    key={reaction.type}
                    onClick={() => {
                      onReaction(post.id, reaction.type);
                      setShowReactions(false);
                    }}
                    className={`p-2 hover:bg-gray-100 rounded ${reaction.color}`}
                    title={reaction.type}
                  >
                    <reaction.icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Reply */}
          <button
            onClick={onReply}
            className="flex items-center space-x-2 px-3 py-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Reply className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600">Reply</span>
          </button>

          {/* Views */}
          <div className="flex items-center space-x-2 px-3 py-1">
            <Eye className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600">{post.viewCount || 0}</span>
          </div>
        </div>

        {/* Show Replies Toggle */}
        {post.replyCount > 0 && (
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {showReplies ? 'Hide' : 'Show'} {post.replyCount} {post.replyCount === 1 ? 'reply' : 'replies'}
          </button>
        )}
      </div>

      {/* Replies */}
      {showReplies && post.replies && post.replies.length > 0 && (
        <div className="mt-4 pl-8 space-y-4">
          {post.replies.map((reply) => (
            <div key={reply.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  {reply.author?.avatar ? (
                    <img 
                      src={reply.author.avatar} 
                      alt={reply.author.firstName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-4 h-4 text-gray-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h5 className="font-medium text-gray-900">
                      {reply.author?.firstName} {reply.author?.lastName}
                    </h5>
                    <span className="text-sm text-gray-500">
                      {formatTimeAgo(reply.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-700 mt-1 whitespace-pre-wrap">{reply.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ForumPost;
