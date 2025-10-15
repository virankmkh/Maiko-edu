import React, { useState, useEffect } from 'react';

const LessonManagementModal = ({ course, isOpen, onClose }) => {
  const [lessons, setLessons] = useState([]);
  const [showCreateLesson, setShowCreateLesson] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [loading, setLoading] = useState(false);

  const [lessonForm, setLessonForm] = useState({
    title: '',
    description: '',
    content: '',
    type: 'video',
    duration: 30,
    order: 1,
    isPublished: false,
    isFree: false,
    videoUrl: '',
    attachments: [],
    objectives: [],
    resources: []
  });

  useEffect(() => {
    if (isOpen && course) {
      loadLessons();
    }
  }, [isOpen, course]);

  const loadLessons = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/lessons/course/${course.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setLessons(data.lessons || []);
      }
    } catch (error) {
      console.error('Error loading lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLesson = () => {
    setLessonForm({
      title: '',
      description: '',
      content: '',
      type: 'video',
      duration: 30,
      order: lessons.length + 1,
      isPublished: false,
      isFree: false,
      videoUrl: '',
      attachments: [],
      objectives: [],
      resources: []
    });
    setEditingLesson(null);
    setShowCreateLesson(true);
  };

  const handleEditLesson = (lesson) => {
    setLessonForm(lesson);
    setEditingLesson(lesson);
    setShowCreateLesson(true);
  };

  const handleSaveLesson = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingLesson 
        ? `/api/lessons/${editingLesson.id}`
        : `/api/lessons`;
      
      const method = editingLesson ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...lessonForm,
          courseId: course.id
        })
      });

      if (response.ok) {
        await loadLessons();
        setShowCreateLesson(false);
        setEditingLesson(null);
      }
    } catch (error) {
      console.error('Error saving lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm('Are you sure you want to delete this lesson?')) return;

    try {
      const response = await fetch(`/api/lessons/${lessonId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        await loadLessons();
      }
    } catch (error) {
      console.error('Error deleting lesson:', error);
    }
  };

  const handleReorderLessons = async (fromIndex, toIndex) => {
    const newLessons = [...lessons];
    const [movedLesson] = newLessons.splice(fromIndex, 1);
    newLessons.splice(toIndex, 0, movedLesson);

    // Update order numbers
    const updatedLessons = newLessons.map((lesson, index) => ({
      ...lesson,
      order: index + 1
    }));

    setLessons(updatedLessons);

    // Update order in backend
    try {
      await fetch('http://localhost:5001/api/lessons/reorder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          courseId: course.id,
          lessons: updatedLessons.map(l => ({ id: l.id, order: l.order }))
        })
      });
    } catch (error) {
      console.error('Error reordering lessons:', error);
    }
  };

  const addObjective = () => {
    setLessonForm(prev => ({
      ...prev,
      objectives: [...prev.objectives, '']
    }));
  };

  const updateObjective = (index, value) => {
    setLessonForm(prev => ({
      ...prev,
      objectives: prev.objectives.map((obj, i) => i === index ? value : obj)
    }));
  };

  const removeObjective = (index) => {
    setLessonForm(prev => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index)
    }));
  };

  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gray-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Lesson Management</h2>
              <p className="text-gray-100">{course.title}</p>
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

        {!showCreateLesson ? (
          /* Lesson List */
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Course Lessons ({lessons.length})</h3>
              <button
                onClick={handleCreateLesson}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                + Add New Lesson
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-gray-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading lessons...</p>
              </div>
            ) : lessons.length > 0 ? (
              <div className="space-y-3">
                {lessons
                  .sort((a, b) => a.order - b.order)
                  .map((lesson, index) => (
                    <div key={lesson.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className="flex flex-col space-y-1">
                          <button
                            onClick={() => index > 0 && handleReorderLessons(index, index - 1)}
                            disabled={index === 0}
                            className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          >
                            ↑
                          </button>
                          <button
                            onClick={() => index < lessons.length - 1 && handleReorderLessons(index, index + 1)}
                            disabled={index === lessons.length - 1}
                            className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          >
                            ↓
                          </button>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm font-medium">
                              {lesson.order}
                            </span>
                            <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              lesson.isPublished 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {lesson.isPublished ? 'Published' : 'Draft'}
                            </span>
                            {lesson.isFree && (
                              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                Free
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{lesson.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {lesson.duration} min
                            </span>
                            <span className="capitalize">{lesson.type}</span>
                            {lesson.objectives?.length > 0 && (
                              <span>{lesson.objectives.length} objectives</span>
                            )}
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditLesson(lesson)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteLesson(lesson.id)}
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
                <p>No lessons found. Add your first lesson to get started.</p>
              </div>
            )}
          </div>
        ) : (
          /* Create/Edit Lesson Form */
          <form onSubmit={handleSaveLesson} className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">
                {editingLesson ? 'Edit Lesson' : 'Create New Lesson'}
              </h3>

              {/* Basic Lesson Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lesson Title *</label>
                  <input
                    type="text"
                    value={lessonForm.title}
                    onChange={(e) => setLessonForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                  <input
                    type="number"
                    value={lessonForm.order}
                    onChange={(e) => setLessonForm(prev => ({ ...prev, order: parseInt(e.target.value) }))}
                    min="1"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={lessonForm.description}
                  onChange={(e) => setLessonForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={lessonForm.type}
                    onChange={(e) => setLessonForm(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    <option value="video">Video</option>
                    <option value="text">Text</option>
                    <option value="quiz">Quiz</option>
                    <option value="assignment">Assignment</option>
                    <option value="live">Live Session</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    value={lessonForm.duration}
                    onChange={(e) => setLessonForm(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                    min="1"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={lessonForm.isPublished}
                      onChange={(e) => setLessonForm(prev => ({ ...prev, isPublished: e.target.checked }))}
                      className="mr-2"
                    />
                    <label className="text-sm text-gray-700">Published</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={lessonForm.isFree}
                      onChange={(e) => setLessonForm(prev => ({ ...prev, isFree: e.target.checked }))}
                      className="mr-2"
                    />
                    <label className="text-sm text-gray-700">Free</label>
                  </div>
                </div>
              </div>

              {lessonForm.type === 'video' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
                  <input
                    type="url"
                    value={lessonForm.videoUrl}
                    onChange={(e) => setLessonForm(prev => ({ ...prev, videoUrl: e.target.value }))}
                    placeholder="https://youtube.com/watch?v=... or direct video URL"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lesson Content</label>
                <textarea
                  value={lessonForm.content}
                  onChange={(e) => setLessonForm(prev => ({ ...prev, content: e.target.value }))}
                  rows={8}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  placeholder="Enter the main content of the lesson..."
                />
              </div>

              {/* Learning Objectives */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Learning Objectives</label>
                  <button
                    type="button"
                    onClick={addObjective}
                    className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                  >
                    + Add Objective
                  </button>
                </div>
                <div className="space-y-2">
                  {lessonForm.objectives.map((objective, index) => (
                    <div key={index} className="flex space-x-2">
                      <input
                        type="text"
                        value={objective}
                        onChange={(e) => updateObjective(index, e.target.value)}
                        placeholder={`Objective ${index + 1}`}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeObjective(index)}
                        className="text-red-600 hover:text-red-800 px-2"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => setShowCreateLesson(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Saving...' : editingLesson ? 'Update Lesson' : 'Create Lesson'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LessonManagementModal;
