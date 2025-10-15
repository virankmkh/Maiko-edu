import React, { useState, useEffect } from 'react';
import ForumManagementModal from './ForumManagementModal';

const EnhancedLessonManagementModal = ({ course, isOpen, onClose, onSave }) => {
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [lessonStatuses, setLessonStatuses] = useState({});
  const [loadingStatuses, setLoadingStatuses] = useState(false);
  const [showLessonViewer, setShowLessonViewer] = useState(false);
  const [viewingLesson, setViewingLesson] = useState(null);
  const [showForumManagement, setShowForumManagement] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    contentTypes: [],
    videoFile: null,
    audioFile: null,
    documentFile: null,
    maxPoints: '',
    passingScore: '',
    countsTowardsFinal: false,
    weight: 1.0,
    isFree: false,
    isPublished: false
  });

  const [quizData, setQuizData] = useState({
    questions: [],
    timeLimit: 0,
    attempts: 1,
    showAnswers: 'after_completion',
    shuffleQuestions: false,
    shuffleAnswers: false
  });

  const [assignmentData, setAssignmentData] = useState({
    questions: [],
    dueDate: '',
    instructions: '',
    gradingCriteria: '',
    allowLateSubmission: false,
    latePenalty: 0
  });

  const contentTypes = [
    { id: 'video', label: 'Video Lesson', icon: '🎥', description: 'Upload video (max 20min)' },
    { id: 'text', label: 'Text Content', icon: '📝', description: 'Written lesson content' },
    { id: 'audio', label: 'Audio/Podcast', icon: '🎧', description: 'Audio lecture or podcast' },
    { id: 'document', label: 'Document', icon: '📄', description: 'PDF, PPT, or other documents' },
    { id: 'quiz', label: 'Interactive Quiz', icon: '❓', description: 'Multiple choice questions' },
    { id: 'assignment', label: 'Assignment', icon: '📋', description: 'Written assignment' },
    { id: 'h5p', label: 'H5P Interactive', icon: '🎮', description: 'Interactive H5P content' }
  ];

  useEffect(() => {
    if (isOpen && course) {
      loadLessons();
    }
  }, [isOpen, course]);

  const loadLessons = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/lessons/course/${course.id}`);
      if (response.ok) {
        const data = await response.json();
        setLessons(data.lessons || []);
        // Load lesson statuses after loading lessons
        loadLessonStatuses(data.lessons || []);
      }
    } catch (error) {
      console.error('Error loading lessons:', error);
    }
  };

  const loadLessonStatuses = async (lessonsToCheck) => {
    if (!lessonsToCheck.length) return;
    
    setLoadingStatuses(true);
    try {
      const statusPromises = lessonsToCheck.map(lesson => 
        fetch(`http://localhost:5001/api/lesson-activity/lesson/${lesson.id}/status`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }).then(res => res.json()).then(data => ({ lessonId: lesson.id, ...data }))
      );
      
      const statuses = await Promise.all(statusPromises);
      const statusMap = {};
      statuses.forEach(status => {
        statusMap[status.lessonId] = status;
      });
      
      setLessonStatuses(statusMap);
    } catch (error) {
      console.error('Error loading lesson statuses:', error);
    } finally {
      setLoadingStatuses(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleContentTypeChange = (contentType, checked) => {
    setFormData(prev => ({
      ...prev,
      contentTypes: checked 
        ? [...prev.contentTypes, contentType]
        : prev.contentTypes.filter(type => type !== contentType)
    }));
  };

  const handleFileUpload = (file, type) => {
    // Validate file size and type
    if (type === 'video' && file.size > 500 * 1024 * 1024) { // 500MB max
      setErrors({ general: 'Video file too large. Maximum size is 500MB.' });
      return;
    }
    
    if (type === 'video' && !file.type.startsWith('video/')) {
      setErrors({ general: 'Please select a valid video file.' });
      return;
    }

    setFormData(prev => ({
      ...prev,
      [`${type}File`]: file
    }));
  };

  const addQuizQuestion = () => {
    setQuizData(prev => ({
      ...prev,
      questions: [...prev.questions, {
        id: Date.now(),
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        points: 1,
        explanation: ''
      }]
    }));
  };

  const updateQuizQuestion = (questionId, field, value) => {
    setQuizData(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId ? { ...q, [field]: value } : q
      )
    }));
  };

  const addAssignmentQuestion = () => {
    setAssignmentData(prev => ({
      ...prev,
      questions: [...prev.questions, {
        id: Date.now(),
        question: '',
        type: 'text', // text, file_upload, multiple_choice
        points: 1,
        required: true
      }]
    }));
  };

  const handleViewLesson = (lesson) => {
    setViewingLesson(lesson);
    setShowLessonViewer(true);
  };

  const handleEditLesson = (lesson) => {
    setSelectedLesson(lesson);
    setShowCreateForm(true);
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm('Are you sure you want to delete this lesson?')) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/lessons/${lessonId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await loadLessons(); // Refresh lessons
        setSelectedLesson(null);
      } else {
        const errorData = await response.json();
        if (errorData.error === 'LESSON_LOCKED') {
          alert(`Cannot delete lesson: ${errorData.reason}`);
        } else {
          alert(`Failed to delete lesson: ${errorData.message}`);
        }
      }
    } catch (error) {
      console.error('Error deleting lesson:', error);
      alert('Error deleting lesson');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const formDataToSend = new FormData();
      
      // Add basic lesson data
      Object.keys(formData).forEach(key => {
        if (key !== 'videoFile' && key !== 'audioFile' && key !== 'documentFile') {
          if (key === 'contentTypes') {
            // Send contentTypes as JSON string
            formDataToSend.append(key, JSON.stringify(formData[key]));
          } else {
            formDataToSend.append(key, formData[key]);
          }
        }
      });

      // Add files
      if (formData.videoFile) {
        formDataToSend.append('video', formData.videoFile);
      }
      if (formData.audioFile) {
        formDataToSend.append('audio', formData.audioFile);
      }
      if (formData.documentFile) {
        formDataToSend.append('document', formData.documentFile);
      }

      // Add quiz data if quiz is selected
      if (formData.contentTypes.includes('quiz')) {
        formDataToSend.append('quizData', JSON.stringify(quizData));
      }

      // Add assignment data if assignment is selected
      if (formData.contentTypes.includes('assignment')) {
        formDataToSend.append('assignmentData', JSON.stringify(assignmentData));
      }

      const response = await fetch(`http://localhost:5001/api/lessons/course/${course.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataToSend
      });

      if (response.ok) {
        const newLesson = await response.json();
        setLessons(prev => [...prev, newLesson]);
        setShowCreateForm(false);
        resetForm();
        onSave && onSave(newLesson);
      } else {
        const errorData = await response.json();
        if (errorData.error === 'LESSON_LOCKED') {
          setErrors({ general: `Cannot edit lesson: ${errorData.reason}` });
        } else {
          setErrors({ general: errorData.message || 'Failed to create lesson' });
        }
      }
    } catch (error) {
      console.error('Error creating lesson:', error);
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      content: '',
      contentTypes: [],
      videoFile: null,
      audioFile: null,
      documentFile: null,
      maxPoints: '',
      passingScore: '',
      countsTowardsFinal: false,
      weight: 1.0,
      isFree: false,
      isPublished: false
    });
    setQuizData({
      questions: [],
      timeLimit: 0,
      attempts: 1,
      showAnswers: 'after_completion',
      shuffleQuestions: false,
      shuffleAnswers: false
    });
    setAssignmentData({
      questions: [],
      dueDate: '',
      instructions: '',
      gradingCriteria: '',
      allowLateSubmission: false,
      latePenalty: 0
    });
  };

  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Lesson Management: {course.title}</h2>
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

        <div className="flex h-[calc(90vh-120px)]">
          {/* Sidebar - Lesson List */}
          <div className="w-1/3 border-r border-gray-200 bg-gray-50 p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Lessons ({lessons.length})</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowForumManagement(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  title="Manage course and lesson forums"
                >
                  💬 Forums
                </button>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  + Add Lesson
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {loadingStatuses && (
                <div className="text-center text-sm text-gray-500 py-2">
                  Loading lesson statuses...
                </div>
              )}
              {lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className={`p-3 rounded-lg transition-colors ${
                    selectedLesson?.id === lesson.id 
                      ? 'bg-blue-100 border-blue-300' 
                      : 'bg-white hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm text-gray-900">{lesson.title}</h4>
                        {lessonStatuses[lesson.id] && (
                          <div className="flex items-center space-x-2">
                            {lessonStatuses[lesson.id].isActive ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                🔒 {lessonStatuses[lesson.id].count} student(s) studying
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                ✅ Editable
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        {lesson.contentTypes?.map(type => (
                          <span key={type} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {contentTypes.find(ct => ct.id === type)?.icon} {type}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-gray-700 mt-1 font-medium">
                        {lesson.maxPoints ? `${lesson.maxPoints} points` : 'No points'} • 
                        {lesson.countsTowardsFinal ? ' Counts' : ' Practice'}
                      </p>
                      {lesson.content && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {lesson.content.length > 100 ? `${lesson.content.substring(0, 100)}...` : lesson.content}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-600 font-semibold">#{index + 1}</span>
                      <div className="flex space-x-1">
                        <button 
                          onClick={() => handleViewLesson(lesson)}
                          className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 rounded"
                          title="View full lesson content"
                        >
                          👁️ View
                        </button>
                        <button 
                          onClick={() => handleEditLesson(lesson)} 
                          disabled={lessonStatuses[lesson.id]?.isActive}
                          className={`text-xs px-2 py-1 rounded ${
                            lessonStatuses[lesson.id]?.isActive 
                              ? 'text-gray-400 cursor-not-allowed' 
                              : 'text-green-600 hover:text-green-800'
                          }`}
                          title={lessonStatuses[lesson.id]?.isActive ? 'Cannot edit while students are studying' : 'Edit lesson'}
                        >
                          ✏️ Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteLesson(lesson.id)} 
                          disabled={lessonStatuses[lesson.id]?.isActive}
                          className={`text-xs px-2 py-1 rounded ${
                            lessonStatuses[lesson.id]?.isActive 
                              ? 'text-gray-400 cursor-not-allowed' 
                              : 'text-red-600 hover:text-red-800'
                          }`}
                          title={lessonStatuses[lesson.id]?.isActive ? 'Cannot delete while students are studying' : 'Delete lesson'}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            <style jsx>{`
              input, textarea, select {
                color: #065f46 !important;
              }
              input::placeholder, textarea::placeholder {
                color: #6b7280 !important;
              }
            `}</style>

            {showCreateForm ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {errors.general && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {errors.general}
                  </div>
                )}

                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lesson Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content Types *</label>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      {contentTypes.map(type => (
                        <label key={type.id} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="checkbox"
                            checked={formData.contentTypes.includes(type.id)}
                            onChange={(e) => handleContentTypeChange(type.id, e.target.checked)}
                            className="rounded"
                          />
                          <div>
                            <div className="font-medium text-sm">{type.icon} {type.label}</div>
                            <div className="text-xs text-gray-500">{type.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Content Upload */}
                {formData.contentTypes.includes('video') && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Video Content</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Video File (Max 20min, 500MB)</label>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleFileUpload(e.target.files[0], 'video')}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Supported formats: MP4, AVI, MOV. Video will be encrypted for security.
                      </p>
                    </div>
                  </div>
                )}

                {formData.contentTypes.includes('audio') && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Audio Content</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Audio File</label>
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={(e) => handleFileUpload(e.target.files[0], 'audio')}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                  </div>
                )}

                {formData.contentTypes.includes('document') && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Document Content</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Document File</label>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.ppt,.pptx"
                        onChange={(e) => handleFileUpload(e.target.files[0], 'document')}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                  </div>
                )}

                {/* Quiz Configuration */}
                {formData.contentTypes.includes('quiz') && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Quiz Configuration</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Time Limit (minutes)</label>
                        <input
                          type="number"
                          value={quizData.timeLimit}
                          onChange={(e) => setQuizData(prev => ({ ...prev, timeLimit: parseInt(e.target.value) || 0 }))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Attempts Allowed</label>
                        <input
                          type="number"
                          value={quizData.attempts}
                          onChange={(e) => setQuizData(prev => ({ ...prev, attempts: parseInt(e.target.value) || 1 }))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          min="1"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Quiz Questions</label>
                      <button
                        type="button"
                        onClick={addQuizQuestion}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        + Add Question
                      </button>

                      {quizData.questions.map((question, index) => (
                        <div key={question.id} className="border rounded-lg p-4 space-y-3">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium">Question {index + 1}</h4>
                            <button
                              type="button"
                              onClick={() => setQuizData(prev => ({
                                ...prev,
                                questions: prev.questions.filter(q => q.id !== question.id)
                              }))}
                              className="text-red-600 hover:text-red-800"
                            >
                              Remove
                            </button>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                            <textarea
                              value={question.question}
                              onChange={(e) => updateQuizQuestion(question.id, 'question', e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2"
                              rows={2}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Options</label>
                            {question.options.map((option, optionIndex) => (
                              <div key={optionIndex} className="flex items-center space-x-2 mb-2">
                                <input
                                  type="radio"
                                  name={`correct_${question.id}`}
                                  checked={question.correctAnswer === optionIndex}
                                  onChange={() => updateQuizQuestion(question.id, 'correctAnswer', optionIndex)}
                                />
                                <input
                                  type="text"
                                  value={option}
                                  onChange={(e) => {
                                    const newOptions = [...question.options];
                                    newOptions[optionIndex] = e.target.value;
                                    updateQuizQuestion(question.id, 'options', newOptions);
                                  }}
                                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                                  placeholder={`Option ${optionIndex + 1}`}
                                />
                              </div>
                            ))}
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Points</label>
                              <input
                                type="number"
                                value={question.points}
                                onChange={(e) => updateQuizQuestion(question.id, 'points', parseFloat(e.target.value) || 0)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                min="0"
                                step="0.1"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Explanation</label>
                              <input
                                type="text"
                                value={question.explanation}
                                onChange={(e) => updateQuizQuestion(question.id, 'explanation', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                placeholder="Why this answer is correct"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Assignment Configuration */}
                {formData.contentTypes.includes('assignment') && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Assignment Configuration</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                        <input
                          type="datetime-local"
                          value={assignmentData.dueDate}
                          onChange={(e) => setAssignmentData(prev => ({ ...prev, dueDate: e.target.value }))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Late Penalty (%)</label>
                        <input
                          type="number"
                          value={assignmentData.latePenalty}
                          onChange={(e) => setAssignmentData(prev => ({ ...prev, latePenalty: parseFloat(e.target.value) || 0 }))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          min="0"
                          max="100"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
                      <textarea
                        value={assignmentData.instructions}
                        onChange={(e) => setAssignmentData(prev => ({ ...prev, instructions: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Assignment Questions</label>
                      <button
                        type="button"
                        onClick={addAssignmentQuestion}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        + Add Question
                      </button>

                      {assignmentData.questions.map((question, index) => (
                        <div key={question.id} className="border rounded-lg p-4 space-y-3">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium">Question {index + 1}</h4>
                            <button
                              type="button"
                              onClick={() => setAssignmentData(prev => ({
                                ...prev,
                                questions: prev.questions.filter(q => q.id !== question.id)
                              }))}
                              className="text-red-600 hover:text-red-800"
                            >
                              Remove
                            </button>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                            <textarea
                              value={question.question}
                              onChange={(e) => setAssignmentData(prev => ({
                                ...prev,
                                questions: prev.questions.map(q => 
                                  q.id === question.id ? { ...q, question: e.target.value } : q
                                )
                              }))}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2"
                              rows={2}
                            />
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                              <select
                                value={question.type}
                                onChange={(e) => setAssignmentData(prev => ({
                                  ...prev,
                                  questions: prev.questions.map(q => 
                                    q.id === question.id ? { ...q, type: e.target.value } : q
                                  )
                                }))}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                              >
                                <option value="text">Text Response</option>
                                <option value="file_upload">File Upload</option>
                                <option value="multiple_choice">Multiple Choice</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Points</label>
                              <input
                                type="number"
                                value={question.points}
                                onChange={(e) => setAssignmentData(prev => ({
                                  ...prev,
                                  questions: prev.questions.map(q => 
                                    q.id === question.id ? { ...q, points: parseFloat(e.target.value) || 0 } : q
                                  )
                                }))}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                min="0"
                                step="0.1"
                              />
                            </div>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={question.required}
                                onChange={(e) => setAssignmentData(prev => ({
                                  ...prev,
                                  questions: prev.questions.map(q => 
                                    q.id === question.id ? { ...q, required: e.target.checked } : q
                                  )
                                }))}
                                className="mr-2"
                              />
                              <label className="text-sm text-gray-700">Required</label>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Grading Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Grading Settings</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Points</label>
                      <input
                        type="number"
                        name="maxPoints"
                        value={formData.maxPoints}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        min="0"
                        step="0.1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Passing Score</label>
                      <input
                        type="number"
                        name="passingScore"
                        value={formData.passingScore}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        min="0"
                        step="0.1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Weight in Final Grade</label>
                      <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        min="0"
                        step="0.1"
                      />
                    </div>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="countsTowardsFinal"
                          checked={formData.countsTowardsFinal}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Counts towards final grade</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || formData.contentTypes.length === 0}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Creating...' : 'Create Lesson'}
                  </button>
                </div>
              </form>
            ) : selectedLesson ? (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">{selectedLesson.title}</h3>
                <p className="text-gray-600">{selectedLesson.description}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Content Types</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedLesson.contentTypes?.map(type => (
                        <span key={type} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                          {contentTypes.find(ct => ct.id === type)?.icon} {type}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Grading</h4>
                    <p className="text-sm text-gray-600">
                      Max Points: {selectedLesson.maxPoints || 'Not set'}<br/>
                      Weight: {selectedLesson.weight || 1.0}<br/>
                      {selectedLesson.countsTowardsFinal ? 'Counts towards final grade' : 'Practice only'}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Edit Lesson
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    View Submissions
                  </button>
                  <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
                    Grade Assignments
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Lesson Selected</h3>
                <p className="text-gray-500">Select a lesson from the sidebar or create a new one to get started.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lesson Viewer Modal */}
      {showLessonViewer && viewingLesson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Lesson Content: {viewingLesson.title}</h2>
              <button 
                onClick={() => setShowLessonViewer(false)} 
                className="text-white hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 flex-grow overflow-y-auto">
              {/* Lesson Overview */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Lesson Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="font-medium text-gray-700">Content Types</h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {viewingLesson.contentTypes?.map(type => (
                        <span key={type} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {contentTypes.find(ct => ct.id === type)?.icon} {type}
                        </span>
                      )) || <span className="text-gray-500">No content types</span>}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="font-medium text-gray-700">Grading</h4>
                    <p className="text-sm text-gray-600">
                      {viewingLesson.maxPoints ? `${viewingLesson.maxPoints} points` : 'No points'} • 
                      {viewingLesson.countsTowardsFinal ? ' Counts' : ' Practice'}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="font-medium text-gray-700">Status</h4>
                    <p className="text-sm text-gray-600">
                      {viewingLesson.isPublished ? 'Published' : 'Draft'} • 
                      {viewingLesson.isFree ? 'Free' : 'Paid'}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700">{viewingLesson.description}</p>
              </div>

              {/* Video Content */}
              {viewingLesson.contentTypes?.includes('video') && viewingLesson.videoUrl && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Video Content</h3>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/>
                        </svg>
                        <p className="text-gray-600">Video: {viewingLesson.videoUrl}</p>
                        {viewingLesson.videoDuration && (
                          <p className="text-sm text-gray-500">
                            Duration: {Math.floor(viewingLesson.videoDuration / 60)}:{(viewingLesson.videoDuration % 60).toString().padStart(2, '0')}
                          </p>
                        )}
                        {viewingLesson.videoEncrypted && (
                          <p className="text-sm text-green-600">🔒 Encrypted (Secure)</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Text Content */}
              {viewingLesson.contentTypes?.includes('text') && viewingLesson.content && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Text Content</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="prose max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: viewingLesson.content.replace(/\n/g, '<br>') }} />
                    </div>
                  </div>
                </div>
              )}

              {/* Audio Content */}
              {viewingLesson.contentTypes?.includes('audio') && viewingLesson.audioUrl && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Audio Content</h3>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.794L4.617 14H2a1 1 0 01-1-1V7a1 1 0 011-1h2.617l3.766-2.794a1 1 0 011.617.794zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd"/>
                      </svg>
                      <div>
                        <p className="text-gray-600">Audio: {viewingLesson.audioUrl}</p>
                        {viewingLesson.audioDuration && (
                          <p className="text-sm text-gray-500">
                            Duration: {Math.floor(viewingLesson.audioDuration / 60)}:{(viewingLesson.audioDuration % 60).toString().padStart(2, '0')}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Document Content */}
              {viewingLesson.contentTypes?.includes('document') && viewingLesson.documentUrl && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Document Content</h3>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/>
                      </svg>
                      <div>
                        <p className="text-gray-600">Document: {viewingLesson.documentUrl}</p>
                        {viewingLesson.documentType && (
                          <p className="text-sm text-gray-500">Type: {viewingLesson.documentType}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Quiz Content */}
              {viewingLesson.contentTypes?.includes('quiz') && viewingLesson.quizData && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Quiz Content</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Quiz Settings</h4>
                        <div className="space-y-2 text-sm">
                          <p><span className="font-medium">Time Limit:</span> {viewingLesson.quizSettings?.timeLimit || 'No limit'} minutes</p>
                          <p><span className="font-medium">Attempts:</span> {viewingLesson.quizSettings?.attempts || 'Unlimited'}</p>
                          <p><span className="font-medium">Show Answers:</span> {viewingLesson.quizSettings?.showAnswers || 'After completion'}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Questions</h4>
                        <p className="text-sm text-gray-600">
                          {viewingLesson.quizData?.questions?.length || 0} questions configured
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Assignment Content */}
              {viewingLesson.contentTypes?.includes('assignment') && viewingLesson.assignmentData && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Assignment Content</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-1">Instructions</h4>
                        <p className="text-sm text-gray-600">{viewingLesson.assignmentSettings?.instructions || 'No instructions provided'}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700 mb-1">Due Date</h4>
                        <p className="text-sm text-gray-600">
                          {viewingLesson.assignmentSettings?.dueDate ? 
                            new Date(viewingLesson.assignmentSettings.dueDate).toLocaleDateString() : 
                            'No due date set'
                          }
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700 mb-1">Grading Criteria</h4>
                        <p className="text-sm text-gray-600">{viewingLesson.assignmentSettings?.gradingCriteria || 'No criteria specified'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* H5P Content */}
              {viewingLesson.contentTypes?.includes('h5p') && viewingLesson.h5pContentId && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Interactive Content (H5P)</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Content Details</h4>
                        <div className="space-y-2 text-sm">
                          <p><span className="font-medium">Content ID:</span> {viewingLesson.h5pContentId}</p>
                          <p><span className="font-medium">Type:</span> {viewingLesson.h5pContentType || 'Not specified'}</p>
                          <p><span className="font-medium">Max Score:</span> {viewingLesson.h5pMaxScore || 'Not set'}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Settings</h4>
                        <div className="space-y-2 text-sm">
                          <p><span className="font-medium">Passing Score:</span> {viewingLesson.h5pPassingScore || 'Not set'}</p>
                          <p><span className="font-medium">Status:</span> {viewingLesson.h5pContentData ? 'Configured' : 'Not configured'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Lesson Metadata */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Lesson Details</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><span className="font-medium">Order:</span> {viewingLesson.order}</p>
                      <p><span className="font-medium">Created:</span> {new Date(viewingLesson.createdAt).toLocaleDateString()}</p>
                      <p><span className="font-medium">Updated:</span> {new Date(viewingLesson.updatedAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p><span className="font-medium">Weight:</span> {viewingLesson.weight || 1.0}</p>
                      <p><span className="font-medium">Passing Score:</span> {viewingLesson.passingScore || 'Not set'}</p>
                      <p><span className="font-medium">Final Grade:</span> {viewingLesson.countsTowardsFinal ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowLessonViewer(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowLessonViewer(false);
                    handleEditLesson(viewingLesson);
                  }}
                  disabled={lessonStatuses[viewingLesson.id]?.isActive}
                  className={`px-4 py-2 rounded-md ${
                    lessonStatuses[viewingLesson.id]?.isActive
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                  title={lessonStatuses[viewingLesson.id]?.isActive ? 'Cannot edit while students are studying' : 'Edit this lesson'}
                >
                  Edit Lesson
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Forum Management Modal */}
      <ForumManagementModal
        course={course}
        isOpen={showForumManagement}
        onClose={() => setShowForumManagement(false)}
      />
    </div>
  );
};

export default EnhancedLessonManagementModal;
