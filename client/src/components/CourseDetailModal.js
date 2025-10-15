import React, { useState, useEffect } from 'react';

const CourseDetailModal = ({ course, isOpen, onClose, onEdit, onManageLessons, onManageQuizzes, onManageForums, onManageStudents, onJitsiSetup }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [lessons, setLessons] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [forums, setForums] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && course) {
      loadCourseDetails();
    }
  }, [isOpen, course]);

  const loadCourseDetails = async () => {
    if (!course) return;
    
    setLoading(true);
    try {
      // Load lessons
      const lessonsResponse = await fetch(`/api/lessons/course/${course.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (lessonsResponse.ok) {
        const lessonsData = await lessonsResponse.json();
        setLessons(lessonsData.lessons || []);
      }

      // Load quizzes (placeholder for now)
      setQuizzes([
        { id: 1, title: 'Introduction Quiz', questions: 10, attempts: 45, avgScore: 85 },
        { id: 2, title: 'Chapter 1 Quiz', questions: 15, attempts: 38, avgScore: 78 },
        { id: 3, title: 'Final Assessment', questions: 25, attempts: 22, avgScore: 82 }
      ]);

      // Load forums (placeholder for now)
      setForums([
        { id: 1, title: 'General Discussion', posts: 23, lastActivity: '2 hours ago' },
        { id: 2, title: 'Q&A Section', posts: 15, lastActivity: '5 hours ago' },
        { id: 3, title: 'Project Showcase', posts: 8, lastActivity: '1 day ago' }
      ]);

    } catch (error) {
      console.error('Error loading course details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{course.title}</h2>
              <p className="text-blue-100 mb-4">{course.description || course.shortDescription}</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                  {course.enrolledStudents || 0} students
                </span>
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                  {course.lessonsCount || 0} lessons
                </span>
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                  ${parseFloat(course.price || 0).toFixed(2)}
                </span>
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                  ${parseFloat(course.earnings || 0).toFixed(2)} earned
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 ml-4"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'lessons', label: 'Lessons', icon: '📚' },
              { id: 'quizzes', label: 'Quizzes', icon: '❓' },
              { id: 'forums', label: 'Forums', icon: '💬' },
              { id: 'analytics', label: 'Analytics', icon: '📈' },
              { id: 'settings', label: 'Settings', icon: '⚙️' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Course Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Category</label>
                      <p className="text-gray-900 capitalize">{course.category || 'General'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Language</label>
                      <p className="text-gray-900 capitalize">{course.language || 'English'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Difficulty</label>
                      <p className="text-gray-900 capitalize">{course.difficulty || 'Beginner'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        course.isPublished || course.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {course.isPublished ? 'Published' : (course.status || 'Draft')}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Completion Rate</span>
                      <span className="font-semibold">78%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average Rating</span>
                      <span className="font-semibold">4.5/5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Views</span>
                      <span className="font-semibold">{course.views || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Updated</span>
                      <span className="font-semibold">
                        {new Date(course.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => onEdit(course)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Edit Course
                </button>
                <button
                  onClick={() => onManageLessons(course)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Manage Lessons
                </button>
                <button
                  onClick={() => onManageStudents(course)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Enrolled Students
                </button>
                <button
                  onClick={() => onJitsiSetup(course)}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Setup Live Session
                </button>
              </div>
            </div>
          )}

          {activeTab === 'lessons' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Course Lessons</h3>
                <button
                  onClick={() => onManageLessons(course)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  + Add Lesson
                </button>
              </div>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading lessons...</p>
                </div>
              ) : lessons.length > 0 ? (
                <div className="space-y-3">
                  {lessons.map((lesson, index) => (
                    <div key={lesson.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {index + 1}. {lesson.title || `Lesson ${index + 1}`}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {lesson.description || 'No description available'}
                          </p>
                          <div className="flex items-center mt-2 text-sm text-gray-500">
                            <span className="mr-4">Duration: {lesson.duration || 'N/A'}</span>
                            <span>Type: {lesson.type || 'Video'}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Edit
                          </button>
                          <button className="text-red-600 hover:text-red-800 text-sm font-medium">
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
          )}

          {activeTab === 'quizzes' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Course Quizzes</h3>
                <button
                  onClick={() => onManageQuizzes(course)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  + Add Quiz
                </button>
              </div>
              
              <div className="space-y-3">
                {quizzes.map((quiz) => (
                  <div key={quiz.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{quiz.title}</h4>
                        <div className="flex items-center mt-2 text-sm text-gray-500 space-x-4">
                          <span>{quiz.questions} questions</span>
                          <span>{quiz.attempts} attempts</span>
                          <span>Avg: {quiz.avgScore}%</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          Edit
                        </button>
                        <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                          Grade
                        </button>
                        <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'forums' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Course Forums</h3>
                <button
                  onClick={() => onManageForums(course)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  + Add Forum
                </button>
              </div>
              
              <div className="space-y-3">
                {forums.map((forum) => (
                  <div key={forum.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{forum.title}</h4>
                        <div className="flex items-center mt-2 text-sm text-gray-500 space-x-4">
                          <span>{forum.posts} posts</span>
                          <span>Last activity: {forum.lastActivity}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          View
                        </button>
                        <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                          Moderate
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Course Analytics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{course.enrolledStudents || 0}</div>
                  <div className="text-sm text-blue-800">Total Enrollments</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">78%</div>
                  <div className="text-sm text-green-800">Completion Rate</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">4.5</div>
                  <div className="text-sm text-purple-800">Average Rating</div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Recent Activity</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Student completed Lesson 3</span>
                    <span className="text-gray-500">2 hours ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span>New forum post in Q&A</span>
                    <span className="text-gray-500">4 hours ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quiz attempt submitted</span>
                    <span className="text-gray-500">6 hours ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Course Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Visibility
                  </label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                    <option value="unlisted">Unlisted</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enrollment Type
                  </label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                    <option value="free">Free</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>
                
                <div className="flex items-center">
                  <input type="checkbox" id="certificate" className="mr-2" />
                  <label htmlFor="certificate" className="text-sm font-medium text-gray-700">
                    Issue certificates upon completion
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input type="checkbox" id="discussions" className="mr-2" />
                  <label htmlFor="discussions" className="text-sm font-medium text-gray-700">
                    Enable student discussions
                  </label>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  Save Settings
                </button>
                <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  Reset to Default
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetailModal;
