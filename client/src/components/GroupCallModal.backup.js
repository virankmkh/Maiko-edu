import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Users, 
  Video, 
  Mic, 
  Settings,
  AlertCircle
} from 'lucide-react';

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

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5); // Minimum 5 minutes from now
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Video className="w-6 h-6 mr-2 text-green-600" />
            Schedule Group Call
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

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
                  className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                    formData.callType === type.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="callType"
                    value={type.value}
                    checked={formData.callType === type.value}
                    onChange={(e) => {
                      const newType = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        callType: newType,
                        isLiveLesson: newType === 'live_lesson',
                        isProctoredExam: newType === 'proctored_exam',
                        accessFee: newType === 'live_lesson' ? 1.00 : 0,
                        maxParticipants: newType === 'live_lesson' ? 50 : prev.maxParticipants
                      }));
                    }}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 ${type.color}`}>
                    <span className="text-lg">{type.icon}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {type.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Call Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Call Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 bg-white"
                placeholder="e.g., Q&A Session, Project Discussion"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 bg-white resize-vertical"
                placeholder="What will this call be about?"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Scheduled Time *
                </label>
                <input
                  type="datetime-local"
                  value={formData.scheduledAt}
                  onChange={(e) => handleInputChange('scheduledAt', e.target.value)}
                  min={getMinDateTime()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="w-4 h-4 inline mr-1" />
                  Max Participants
                </label>
                <select
                  value={formData.maxParticipants}
                  onChange={(e) => handleInputChange('maxParticipants', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                >
                  <option value={5}>5 participants</option>
                  <option value={10}>10 participants</option>
                  <option value={15}>15 participants</option>
                  <option value={20}>20 participants</option>
                  <option value={50}>50 participants</option>
                </select>
              </div>
            </div>
          </div>

          {/* Live Lesson Settings */}
          {formData.isLiveLesson && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Video className="w-5 h-5 mr-2 text-green-600" />
                Live Lesson Settings
              </h3>
              
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-green-600 font-medium">💰 Access Fee: $1.00</span>
                    <span className="text-sm text-green-600">(Students must pay to join)</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Students will need to pay $1 to access this live lesson. You can share screen, control student permissions, and moderate the session.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Participants
                    </label>
                    <select
                      value={formData.maxParticipants}
                      onChange={(e) => handleInputChange('maxParticipants', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    >
                      <option value={10}>10 participants</option>
                      <option value={20}>20 participants</option>
                      <option value={30}>30 participants</option>
                      <option value={40}>40 participants</option>
                      <option value={50}>50 participants</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Proctored Exam Settings */}
          {formData.isProctoredExam && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-red-600" />
                Proctored Exam Settings
              </h3>
              
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-red-600 font-medium">🔒 Strict Monitoring</span>
                  </div>
                  <p className="text-sm text-red-700">
                    This exam will be proctored with strict monitoring. Students cannot switch tabs, copy/paste, or leave full-screen mode.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time Limit (minutes)
                    </label>
                    <input
                      type="number"
                      value={formData.examSettings.timeLimit || ''}
                      onChange={(e) => handleInputChange('examSettings.timeLimit', parseInt(e.target.value) || null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      placeholder="No limit"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question Count
                    </label>
                    <input
                      type="number"
                      value={formData.examSettings.questionCount || ''}
                      onChange={(e) => handleInputChange('examSettings.questionCount', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Call Settings */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              {formData.isLiveLesson ? 'Instructor Controls' : 'Call Settings'}
            </h3>
            
            <div className="space-y-4">
              {formData.isLiveLesson ? (
                // Instructor Controls for Live Lessons
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Allow Student Video
                      </label>
                      <p className="text-xs text-gray-500">
                        Students can turn on their video cameras
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.instructorControls.allowStudentVideo}
                        onChange={(e) => handleInputChange('instructorControls.allowStudentVideo', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Allow Student Audio
                      </label>
                      <p className="text-xs text-gray-500">
                        Students can speak (requires hand raise)
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.instructorControls.allowStudentAudio}
                        onChange={(e) => handleInputChange('instructorControls.allowStudentAudio', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Require Hand Raise
                      </label>
                      <p className="text-xs text-gray-500">
                        Students must raise hand before speaking
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.instructorControls.requireHandRaise}
                        onChange={(e) => handleInputChange('instructorControls.requireHandRaise', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Allow Chat
                      </label>
                      <p className="text-xs text-gray-500">
                        Students can send messages in chat
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.instructorControls.allowChat}
                        onChange={(e) => handleInputChange('instructorControls.allowChat', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Allow Questions
                      </label>
                      <p className="text-xs text-gray-500">
                        Students can ask questions during the lesson
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.instructorControls.allowQuestions}
                        onChange={(e) => handleInputChange('instructorControls.allowQuestions', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </>
              ) : (
                // Regular Call Settings
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Allow Screen Sharing
                      </label>
                      <p className="text-xs text-gray-500">
                        Participants can share their screen during the call
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.settings.allowScreenShare}
                        onChange={(e) => handleInputChange('settings.allowScreenShare', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Allow Recording
                  </label>
                  <p className="text-xs text-gray-500">
                    Participants can record the call (with permission)
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.settings.allowRecording}
                    onChange={(e) => handleInputChange('settings.allowRecording', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Mute on Join
                  </label>
                  <p className="text-xs text-gray-500">
                    Participants join the call muted by default
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.settings.muteOnJoin}
                    onChange={(e) => handleInputChange('settings.muteOnJoin', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Require Approval
                  </label>
                  <p className="text-xs text-gray-500">
                    Host must approve participants before they can join
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.settings.requireApproval}
                    onChange={(e) => handleInputChange('settings.requireApproval', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
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
              disabled={creating || !formData.title.trim() || !formData.scheduledAt}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {creating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Video className="w-4 h-4" />
                  <span>Schedule Call</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GroupCallModal;
