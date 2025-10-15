import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Users, 
  Video, 
  Mic, 
  Settings,
  AlertCircle,
  Play,
  Square,
  Share2,
  Users2
} from 'lucide-react';
import { jitsiConfig, createRoom, setUserInfo } from '../config/jitsi';

const GroupCallModal = ({ forumId, onClose, onCallCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    scheduledAt: '',
    maxParticipants: 10,
    callType: 'discussion',
    isLiveLesson: false,
    isProctoredExam: false,
    accessFee: 0,
    settings: {
      allowScreenShare: true,
      allowRecording: false,
      muteOnJoin: true,
      requireApproval: false
    },
    instructorControls: {
      allowScreenShare: true,
      allowStudentVideo: false,
      allowStudentAudio: false,
      allowChat: true,
      allowQuestions: true,
      muteAllStudents: false,
      requireHandRaise: true,
      allowRecording: false
    },
    moderators: [],
    examSettings: {
      allowTabSwitch: false,
      allowCopyPaste: false,
      requireFullScreen: true,
      monitorScreen: true,
      timeLimit: null,
      questionCount: 0
    }
  });
  
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [jitsiApi, setJitsiApi] = useState(null);
  const jitsiContainerRef = useRef(null);

  // Jitsi Meet integration
  const startJitsiCall = async (roomName) => {
    try {
      // Load Jitsi Meet API dynamically
      if (!window.JitsiMeetExternalAPI) {
        const script = document.createElement('script');
        script.src = 'https://meet.jit.si/external_api.js';
        script.onload = () => initializeJitsi(roomName);
        document.head.appendChild(script);
      } else {
        initializeJitsi(roomName);
      }
    } catch (error) {
      console.error('Error starting Jitsi call:', error);
      setError('Failed to start video call');
    }
  };

  const initializeJitsi = (roomName) => {
    if (!jitsiContainerRef.current) return;

    const userInfo = setUserInfo(
      localStorage.getItem('userName') || 'Anonymous User',
      localStorage.getItem('userEmail') || ''
    );

    const config = createRoom(roomName);
    config.options.userInfo = userInfo;
    config.options.parentNode = jitsiContainerRef.current;

    // Apply settings from form data
    config.options.configOverwrite.startWithAudioMuted = formData.settings.muteOnJoin;
    config.options.configOverwrite.startWithVideoMuted = !formData.instructorControls.allowStudentVideo;
    config.options.configOverwrite.startScreenSharing = false;

    const api = new window.JitsiMeetExternalAPI(config.domain, config.options);
    setJitsiApi(api);

    // Event listeners
    api.addEventListeners({
      videoConferenceJoined: () => {
        console.log('Joined video conference');
        setIsInCall(true);
      },
      videoConferenceLeft: () => {
        console.log('Left video conference');
        setIsInCall(false);
        setJitsiApi(null);
      },
      readyToClose: () => {
        console.log('Ready to close');
        setIsInCall(false);
        setJitsiApi(null);
      }
    });
  };

  const endJitsiCall = () => {
    if (jitsiApi) {
      jitsiApi.dispose();
      setJitsiApi(null);
      setIsInCall(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.startsWith('settings.')) {
      const settingKey = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        settings: {
          ...prev.settings,
          [settingKey]: value
        }
      }));
    } else if (field.startsWith('instructorControls.')) {
      const controlKey = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        instructorControls: {
          ...prev.instructorControls,
          [controlKey]: value
        }
      }));
    } else if (field.startsWith('examSettings.')) {
      const examKey = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        examSettings: {
          ...prev.examSettings,
          [examKey]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCreating(true);

    try {
      const response = await fetch(`/api/forums/${forumId}/calls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create group call');
      }

      onCallCreated();
    } catch (error) {
      setError(error.message);
    } finally {
      setCreating(false);
    }
  };

  const handleStartCall = () => {
    const roomName = `maiko-${forumId}-${Date.now()}`;
    startJitsiCall(roomName);
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5);
    return now.toISOString().slice(0, 16);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (jitsiApi) {
        jitsiApi.dispose();
      }
    };
  }, [jitsiApi]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Video className="w-6 h-6 mr-2 text-green-600" />
            {isInCall ? 'Live Group Call' : 'Schedule Group Call'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {isInCall ? (
          // Jitsi Meet Video Call Interface
          <div className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">Live</span>
                </div>
                <span className="text-sm text-gray-500">
                  {formData.title || 'Group Call'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={endJitsiCall}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                >
                  <Square className="w-4 h-4" />
                  <span>End Call</span>
                </button>
              </div>
            </div>
            
            {/* Jitsi Meet Container */}
            <div 
              ref={jitsiContainerRef}
              className="w-full h-96 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center"
            >
              <div className="text-center">
                <Video className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Loading Jitsi Meet...</p>
              </div>
            </div>
          </div>
        ) : (
          // Call Configuration Form
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Call Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Call Type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { value: 'discussion', label: 'Discussion', icon: '💬', color: 'text-blue-600' },
                  { value: 'live_lesson', label: 'Live Lesson', icon: '🎓', color: 'text-green-600' },
                  { value: 'proctored_exam', label: 'Proctored Exam', icon: '📝', color: 'text-red-600' }
                ].map((type) => (
                  <label
                    key={type.value}
                    className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.callType === type.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="callType"
                      value={type.value}
                      checked={formData.callType === type.value}
                      onChange={(e) => handleInputChange('callType', e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{type.icon}</span>
                      <div>
                        <div className={`font-medium ${type.color}`}>{type.label}</div>
                        <div className="text-sm text-gray-500">
                          {type.value === 'discussion' && 'Open discussion and collaboration'}
                          {type.value === 'live_lesson' && 'Structured teaching session'}
                          {type.value === 'proctored_exam' && 'Monitored examination'}
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Call Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter call title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Participants
                </label>
                <input
                  type="number"
                  min="2"
                  max="100"
                  value={formData.maxParticipants}
                  onChange={(e) => handleInputChange('maxParticipants', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the purpose of this call"
              />
            </div>

            {/* Quick Start Button */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-blue-900">Quick Start</h3>
                  <p className="text-sm text-blue-700">
                    Start an immediate video call without scheduling
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleStartCall}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Play className="w-4 h-4" />
                  <span>Start Now</span>
                </button>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creating}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {creating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4" />
                    <span>Schedule Call</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default GroupCallModal;