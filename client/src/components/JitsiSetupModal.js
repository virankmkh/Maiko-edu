import React, { useState, useEffect } from 'react';

const JitsiSetupModal = ({ course, lesson, isOpen, onClose }) => {
  const [conferenceData, setConferenceData] = useState({
    title: '',
    description: '',
    startTime: '',
    duration: 60,
    maxParticipants: 50,
    isRecurring: false,
    recurringDays: [],
    password: '',
    enableRecording: false,
    enableChat: true,
    enableScreenShare: true,
    enableWhiteboard: true
  });

  const [scheduledConferences, setScheduledConferences] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadScheduledConferences();
      if (lesson) {
        setConferenceData(prev => ({
          ...prev,
          title: `${course.title} - ${lesson.title}`,
          description: `Live session for ${lesson.title}`
        }));
      } else {
        setConferenceData(prev => ({
          ...prev,
          title: `${course.title} - Live Session`,
          description: `Live session for ${course.title}`
        }));
      }
    }
  }, [isOpen, course, lesson]);

  const loadScheduledConferences = async () => {
    if (!course) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/jitsi/conferences/course/${course.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setScheduledConferences(data.conferences || []);
      }
    } catch (error) {
      console.error('Error loading conferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setConferenceData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRecurringDayChange = (day) => {
    setConferenceData(prev => ({
      ...prev,
      recurringDays: prev.recurringDays.includes(day)
        ? prev.recurringDays.filter(d => d !== day)
        : [...prev.recurringDays, day]
    }));
  };

  const handleCreateConference = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/jitsi/conferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...conferenceData,
          courseId: course.id,
          lessonId: lesson?.id,
          startTime: new Date(conferenceData.startTime).toISOString()
        })
      });

      if (response.ok) {
        await loadScheduledConferences();
        setConferenceData({
          title: '',
          description: '',
          startTime: '',
          duration: 60,
          maxParticipants: 50,
          isRecurring: false,
          recurringDays: [],
          password: '',
          enableRecording: false,
          enableChat: true,
          enableScreenShare: true,
          enableWhiteboard: true
        });
      }
    } catch (error) {
      console.error('Error creating conference:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinConference = (conferenceId) => {
    // Open Jitsi conference in new window
    const jitsiUrl = `${process.env.REACT_APP_JITSI_DOMAIN || 'meet.jit.si'}/${conferenceId}`;
    window.open(jitsiUrl, '_blank', 'width=1200,height=800');
  };

  const handleDeleteConference = async (conferenceId) => {
    if (!window.confirm('Are you sure you want to delete this conference?')) return;

    try {
      const response = await fetch(`/api/jitsi/conferences/${conferenceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        await loadScheduledConferences();
      }
    } catch (error) {
      console.error('Error deleting conference:', error);
    }
  };

  const generatePassword = () => {
    const password = Math.random().toString(36).substring(2, 8).toUpperCase();
    setConferenceData(prev => ({ ...prev, password }));
  };

  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-orange-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Live Session Setup</h2>
              <p className="text-orange-100">
                {course.title} {lesson && `- ${lesson.title}`}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Create Conference Form */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Schedule New Session</h3>
              
              <form onSubmit={handleCreateConference} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Session Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={conferenceData.title}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={conferenceData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time *</label>
                    <input
                      type="datetime-local"
                      name="startTime"
                      value={conferenceData.startTime}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                    <input
                      type="number"
                      name="duration"
                      value={conferenceData.duration}
                      onChange={handleInputChange}
                      min="15"
                      max="480"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Participants</label>
                  <input
                    type="number"
                    name="maxParticipants"
                    value={conferenceData.maxParticipants}
                    onChange={handleInputChange}
                    min="2"
                    max="100"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password (optional)</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      name="password"
                      value={conferenceData.password}
                      onChange={handleInputChange}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Leave empty for no password"
                    />
                    <button
                      type="button"
                      onClick={generatePassword}
                      className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Generate
                    </button>
                  </div>
                </div>

                {/* Recurring Options */}
                <div>
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      name="isRecurring"
                      checked={conferenceData.isRecurring}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <label className="text-sm font-medium text-gray-700">Recurring Session</label>
                  </div>

                  {conferenceData.isRecurring && (
                    <div className="ml-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Repeat on:</label>
                      <div className="flex flex-wrap gap-2">
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                          <button
                            key={day}
                            type="button"
                            onClick={() => handleRecurringDayChange(day)}
                            className={`px-3 py-1 text-sm rounded-full border ${
                              conferenceData.recurringDays.includes(day)
                                ? 'bg-orange-600 text-white border-orange-600'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {day.slice(0, 3)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Features */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Session Features</label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="enableChat"
                        checked={conferenceData.enableChat}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <label className="text-sm text-gray-700">Enable Chat</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="enableScreenShare"
                        checked={conferenceData.enableScreenShare}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <label className="text-sm text-gray-700">Enable Screen Sharing</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="enableWhiteboard"
                        checked={conferenceData.enableWhiteboard}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <label className="text-sm text-gray-700">Enable Whiteboard</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="enableRecording"
                        checked={conferenceData.enableRecording}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <label className="text-sm text-gray-700">Enable Recording</label>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Creating...' : 'Schedule Session'}
                </button>
              </form>
            </div>

            {/* Scheduled Conferences */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Scheduled Sessions</h3>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading sessions...</p>
                </div>
              ) : scheduledConferences.length > 0 ? (
                <div className="space-y-3">
                  {scheduledConferences.map((conference) => (
                    <div key={conference.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{conference.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{conference.description}</p>
                          <div className="flex items-center mt-2 text-sm text-gray-500 space-x-4">
                            <span>{new Date(conference.startTime).toLocaleString()}</span>
                            <span>{conference.duration} min</span>
                            <span>{conference.maxParticipants} max</span>
                            {conference.password && <span>🔒 Password protected</span>}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleJoinConference(conference.id)}
                            className="text-orange-600 hover:text-orange-800 text-sm font-medium"
                          >
                            Join
                          </button>
                          <button
                            onClick={() => handleDeleteConference(conference.id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No scheduled sessions found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JitsiSetupModal;
