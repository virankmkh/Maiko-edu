import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import CourseCreation from '../components/CourseCreation';
import CourseDetailModal from '../components/CourseDetailModal';
import CourseEditModal from '../components/CourseEditModal';
import QuizManagementModal from '../components/QuizManagementModal';
import JitsiSetupModal from '../components/JitsiSetupModal';
import LessonManagementModal from '../components/LessonManagementModal';
import EnhancedLessonManagementModal from '../components/EnhancedLessonManagementModal';
import ForumManagementModal from '../components/ForumManagementModal';
import SimpleStudentList from '../components/SimpleStudentList';

// Course Card Component
const CourseCard = ({ course, onEdit, onView, onManageLessons, onManageQuizzes, onManageForums, onManageStudents, onJitsiSetup }) => {
  const getStatusColor = (course) => {
    if (course.isPublished || course.status === 'published') {
      return 'bg-green-100 text-green-800';
    }
    return 'bg-yellow-100 text-yellow-800';
  };

  const getStatusText = (course) => {
    if (course.isPublished) return 'Published';
    return course.status === 'published' ? 'Published' : 'Draft';
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      {/* Course Thumbnail */}
      <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative">
        {course.thumbnail ? (
          <img 
            src={course.thumbnail} 
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <svg className="w-16 h-16 text-white opacity-50" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
            </svg>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(course)}`}>
            {getStatusText(course)}
          </span>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{course.description || course.shortDescription}</p>
        </div>

        {/* Course Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="flex items-center text-gray-600">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            {course.currentEnrollments || 0} students
          </div>
          <div className="flex items-center text-gray-600">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            {course.lessonsCount || 0} lessons
          </div>
          <div className="flex items-center text-gray-600">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            ${parseFloat(course.price || 0).toFixed(2)}
          </div>
          <div className="flex items-center text-gray-600">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            ${parseFloat(course.earnings || 0).toFixed(2)} earned
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={() => onView(course)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            View Details
          </button>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onEdit(course)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => onManageLessons(course)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Lessons
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onManageQuizzes(course)}
              className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Quizzes
            </button>
            <button
              onClick={() => onManageForums(course)}
              className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Forums
            </button>
            <button
              onClick={() => onManageStudents(course)}
              className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Students
            </button>
          </div>

          <button
            onClick={() => onJitsiSetup(course)}
            className="w-full bg-orange-100 hover:bg-orange-200 text-orange-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            🎥 Setup Live Session
          </button>
        </div>
      </div>
    </div>
  );
};

const InstructorDashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  
  // State for dashboard data
  const [stats, setStats] = useState({
    activeCourses: 0,
    enrolledStudents: 0,
    totalEarnings: 0,
    instructorRating: 0
  });
  
  const [courses, setCourses] = useState([]);
  const [studentActivity, setStudentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showCourseCreation, setShowCourseCreation] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCourseDetail, setShowCourseDetail] = useState(false);
  const [showCourseEdit, setShowCourseEdit] = useState(false);
  const [showQuizManagement, setShowQuizManagement] = useState(false);
  const [showJitsiSetup, setShowJitsiSetup] = useState(false);
  const [showLessonManagement, setShowLessonManagement] = useState(false);
  const [showEnhancedLessonManagement, setShowEnhancedLessonManagement] = useState(false);
  const [showForumManagement, setShowForumManagement] = useState(false);
  const [selectedCourseForForums, setSelectedCourseForForums] = useState(null);
  const [showStudentManagement, setShowStudentManagement] = useState(false);
  const [selectedCourseForStudents, setSelectedCourseForStudents] = useState(null);

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load instructor courses
      const coursesResponse = await fetch('http://localhost:5001/api/courses/instructor', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (coursesResponse.ok) {
        const coursesData = await coursesResponse.json();
        setCourses(coursesData.courses || []);
        
        // Calculate stats
        const activeCourses = coursesData.courses?.filter(course => course.status === 'published' || course.status === 'draft').length || 0;
        const enrolledStudents = coursesData.courses?.reduce((total, course) => total + (course.currentEnrollments || 0), 0) || 0;
        const totalEarnings = coursesData.courses?.reduce((total, course) => total + parseFloat(course.earnings || 0), 0) || 0;

        setStats({
          activeCourses,
          enrolledStudents,
          totalEarnings,
          instructorRating: 4.8 // Placeholder - would come from reviews
        });
      }
      
      // Load student activity from API
      const activityResponse = await fetch('http://localhost:5001/api/student-activity/instructor', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (activityResponse.ok) {
        const activityData = await activityResponse.json();
        setStudentActivity(activityData.activities || []);
      } else {
        console.error('Failed to load student activity');
        setStudentActivity([]);
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseCreated = (newCourse) => {
    setCourses(prev => [newCourse, ...prev]);
    setShowCourseCreation(false);
    // Refresh dashboard data
    loadDashboardData();
  };

  const handleCancelCourseCreation = () => {
    setShowCourseCreation(false);
  };

  // Course management handlers
  const handleEditCourse = (course) => {
    setSelectedCourse(course);
    setShowCourseEdit(true);
  };

  const handleViewCourse = (course) => {
    setSelectedCourse(course);
    setShowCourseDetail(true);
  };

  const handleManageLessons = (course) => {
    setSelectedCourse(course);
    setShowEnhancedLessonManagement(true);
  };

  const handleManageQuizzes = (course) => {
    setSelectedCourse(course);
    setShowQuizManagement(true);
  };


  const handleJitsiSetup = (course) => {
    setSelectedCourse(course);
    setShowJitsiSetup(true);
  };

  const handleCloseCourseDetail = () => {
    setShowCourseDetail(false);
    setSelectedCourse(null);
  };

  const handleCloseCourseEdit = () => {
    setShowCourseEdit(false);
    setSelectedCourse(null);
  };

  const handleCloseQuizManagement = () => {
    setShowQuizManagement(false);
    setSelectedCourse(null);
  };

  const handleCloseJitsiSetup = () => {
    setShowJitsiSetup(false);
    setSelectedCourse(null);
  };

  const handleCloseLessonManagement = () => {
    setShowLessonManagement(false);
    setSelectedCourse(null);
  };

  const handleCloseEnhancedLessonManagement = () => {
    setShowEnhancedLessonManagement(false);
    setSelectedCourse(null);
  };

  const handleManageForums = (course) => {
    setSelectedCourseForForums(course);
    setShowForumManagement(true);
  };

  const handleCloseForumManagement = () => {
    setShowForumManagement(false);
    setSelectedCourseForForums(null);
  };

  const handleManageStudents = (course) => {
    setSelectedCourseForStudents(course);
    setShowStudentManagement(true);
  };

  const handleCloseStudentManagement = () => {
    setShowStudentManagement(false);
    setSelectedCourseForStudents(null);
  };

  const handleViewAllStudents = () => {
    // Create a special "all courses" object to show students from all courses
    const allCoursesCourse = {
      id: 'all',
      title: 'All Courses',
      description: 'Students from all your courses'
    };
    setSelectedCourseForStudents(allCoursesCourse);
    setShowStudentManagement(true);
  };

  const handleCourseSaved = (updatedCourse) => {
    setCourses(prev => prev.map(course => 
      course.id === updatedCourse.id ? updatedCourse : course
    ));
    setShowCourseEdit(false);
    setSelectedCourse(null);
    // Refresh dashboard data to update stats
    loadDashboardData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show course creation form if active
  if (showCourseCreation) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <CourseCreation 
          onCourseCreated={handleCourseCreated}
          onCancel={handleCancelCourseCreation}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {t('instructor.dashboard.title')}
          </h1>
          <p className="text-gray-600 mt-2">
            {t('instructor.dashboard.welcome')}, {user?.name || 'Instructor'}!
          </p>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Courses</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.activeCourses}</p>
              </div>
            </div>
          </div>

          <div 
            className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={handleViewAllStudents}
            title="Click to view all enrolled students"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Enrolled Students</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.enrolledStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-semibold text-gray-900">${(parseFloat(stats.totalEarnings) || 0).toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Instructor Rating</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.instructorRating}/5</p>
              </div>
            </div>
          </div>
        </div>

        {/* Create Course Button */}
        <div className="mb-8 flex justify-end">
          <button 
            onClick={() => setShowCourseCreation(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            {t('instructor.dashboard.createCourse')}
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
                          <button 
                onClick={() => setActiveTab('overview')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📊 Overview
                          </button>
                      <button 
                onClick={() => setActiveTab('courses')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'courses'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📚 My Courses
                      </button>
            </nav>
          </div>
          </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Current Courses Table */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Current Courses</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrolled Students</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lessons Count</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {courses.length > 0 ? (
                      courses.map((course) => (
                        <tr key={course.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{course.category || 'Business'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
                            {course.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{course.currentEnrollments || 0}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{course.lessonsCount || 0}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              course.isPublished || course.status === 'published'
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {course.isPublished ? 'Published' : (course.status || 'Draft')}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                          No courses found. Create your first course to get started!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Student Activity Table */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Student Activity</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recent Activity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {studentActivity.map((activity) => (
                      <tr key={activity.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{activity.courseTitle}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{activity.activity}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {activity.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.timestamp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
                  </div>
                )}

        {activeTab === 'courses' && (
          <div className="space-y-6">
            {/* Course Management Header */}
          <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Course Management</h3>
                <button 
                  onClick={() => setShowCourseCreation(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  + Add New Course
                </button>
              </div>
              
              {/* Course Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{courses.length}</div>
                  <div className="text-sm text-blue-800">Total Courses</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {courses.filter(c => c.isPublished || c.status === 'published').length}
                  </div>
                  <div className="text-sm text-green-800">Published</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {courses.filter(c => !c.isPublished && c.status === 'draft').length}
                  </div>
                  <div className="text-sm text-yellow-800">Draft</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {courses.reduce((total, course) => total + (course.currentEnrollments || 0), 0)}
                  </div>
                  <div className="text-sm text-purple-800">Total Students</div>
                </div>
              </div>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard 
                  key={course.id} 
                  course={course} 
                  onEdit={handleEditCourse}
                  onView={handleViewCourse}
                  onManageLessons={handleManageLessons}
                  onManageQuizzes={handleManageQuizzes}
                  onManageForums={handleManageForums}
                  onManageStudents={handleManageStudents}
                  onJitsiSetup={handleJitsiSetup}
                />
              ))}
            </div>

            {courses.length === 0 && (
              <div className="bg-white shadow rounded-lg p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
                <p className="text-gray-600 mb-4">Get started by creating your first course</p>
                <button 
                  onClick={() => setShowCourseCreation(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Create Your First Course
                </button>
              </div>
            )}
                  </div>
                )}


        </div>

        {/* Course Detail Modal */}
        <CourseDetailModal
          course={selectedCourse}
          isOpen={showCourseDetail}
          onClose={handleCloseCourseDetail}
          onEdit={handleEditCourse}
          onManageLessons={handleManageLessons}
          onManageQuizzes={handleManageQuizzes}
          onManageForums={handleManageForums}
          onManageStudents={handleManageStudents}
          onJitsiSetup={handleJitsiSetup}
        />

        {/* Course Edit Modal */}
        <CourseEditModal
          course={selectedCourse}
          isOpen={showCourseEdit}
          onClose={handleCloseCourseEdit}
          onSave={handleCourseSaved}
        />

        {/* Quiz Management Modal */}
        <QuizManagementModal
          course={selectedCourse}
          isOpen={showQuizManagement}
          onClose={handleCloseQuizManagement}
        />

        {/* Jitsi Setup Modal */}
        <JitsiSetupModal
          course={selectedCourse}
          isOpen={showJitsiSetup}
          onClose={handleCloseJitsiSetup}
        />

        {/* Enhanced Lesson Management Modal */}
        <EnhancedLessonManagementModal
          course={selectedCourse}
          isOpen={showEnhancedLessonManagement}
          onClose={handleCloseEnhancedLessonManagement}
        />

        {/* Forum Management Modal */}
        <ForumManagementModal
          course={selectedCourseForForums}
          isOpen={showForumManagement}
          onClose={handleCloseForumManagement}
        />

        {/* Student Management Modal */}
        <SimpleStudentList
          course={selectedCourseForStudents}
          isOpen={showStudentManagement}
          onClose={handleCloseStudentManagement}
        />
    </div>
  );
};

export default InstructorDashboard;
