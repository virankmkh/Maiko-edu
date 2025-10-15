import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';
import CourseDetailModal from '../components/CourseDetailModal';
import CoursePaymentModal from '../components/CoursePaymentModal';

const StudentDashboard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  
  // Helper function to safely render values
  const safeRender = (value, fallback = '') => {
    if (value === null || value === undefined) return fallback;
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };
  
  // State for dashboard data
  const [stats, setStats] = useState({
    totalCourses: 0,
    enrolledCourses: 0,
    completedCourses: 0,
    certificatesEarned: 0,
    studyStreak: 0,
    totalStudyTime: 0,
    averageGrade: 0,
    overallProgress: 0
  });
  
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCourseDetail, setShowCourseDetail] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [courseToEnroll, setCourseToEnroll] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch available courses
      const coursesResponse = await fetch('http://localhost:5001/api/courses?limit=12');
      const coursesData = await coursesResponse.json();
      setCourses(coursesData.courses || []);

      // Fetch user's enrolled courses
      if (user) {
        const enrolledResponse = await fetch('http://localhost:5001/api/enrollments/student', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'x-auth-token': localStorage.getItem('token')
          }
        });
        if (enrolledResponse.ok) {
          const enrolledData = await enrolledResponse.json();
          setEnrolledCourses(enrolledData.enrollments || []);
        }

        // Fetch certificates
        const certificatesResponse = await fetch(`http://localhost:5001/api/certificates/student/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'x-auth-token': localStorage.getItem('token')
          }
        });
        if (certificatesResponse.ok) {
          const certificatesData = await certificatesResponse.json();
          setCertificates(certificatesData.certificates || []);
        }

        // Fetch recent activity
        const activityResponse = await fetch(`http://localhost:5001/api/student-activity/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'x-auth-token': localStorage.getItem('token')
          }
        });
        if (activityResponse.ok) {
          const activityData = await activityResponse.json();
          setRecentActivity(activityData.activities || []);
        }

        // Fetch achievements (mock data for now)
        setAchievements([
          { id: 1, name: 'First Course', description: 'Complete your first course', earned: true, date: new Date() },
          { id: 2, name: 'Study Streak', description: 'Study for 7 consecutive days', earned: false, date: null },
          { id: 3, name: 'Perfect Score', description: 'Get a perfect score on a quiz', earned: true, date: new Date() }
        ]);
      }

      // Calculate stats
      const enrolledCoursesData = enrolledCourses.length > 0 ? enrolledCourses : [];
      const completedCourses = enrolledCoursesData.filter(course => course.progress === 100).length;
      const totalProgress = enrolledCoursesData.length > 0 
        ? Math.round(enrolledCoursesData.reduce((acc, course) => acc + (course.progress || 0), 0) / enrolledCoursesData.length)
        : 0;

      setStats({
        totalCourses: coursesData.courses?.length || 0,
        enrolledCourses: enrolledCoursesData.length,
        completedCourses,
        certificatesEarned: certificates.length,
        studyStreak: 5, // Mock data
        totalStudyTime: enrolledCoursesData.reduce((acc, course) => acc + (course.timeSpent || 0), 0),
        averageGrade: 85, // Mock data
        overallProgress: totalProgress
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Course Card Component
  const CourseCard = ({ course, isEnrolled = false, onView, onEnroll, onContinue }) => {
    const getStatusColor = (course) => {
      if (course.progress === 100) return 'bg-green-100 text-green-800';
      if (course.progress > 0) return 'bg-blue-100 text-blue-800';
      return 'bg-gray-100 text-gray-800';
    };

    const getStatusText = (course) => {
      if (course.progress === 100) return t('student.dashboard.courseCard.completed');
      if (course.progress > 0) return t('student.dashboard.courseCard.inProgress');
      return t('student.dashboard.courseCard.notStarted');
    };

    const getActionButton = () => {
      if (isEnrolled) {
        if (course.progress === 100) {
          return (
            <button
              onClick={() => onView(course)}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              {t('student.dashboard.courseCard.viewDetails')}
            </button>
          );
        } else {
          return (
            <button
              onClick={() => onContinue(course)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              {t('student.dashboard.courseCard.continue')}
            </button>
          );
        }
      } else {
        return (
          <button
            onClick={() => onEnroll(course)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {t('student.dashboard.courseCard.start')}
          </button>
        );
      }
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              {course.lessonsCount || 0} {t('student.dashboard.courseCard.lessons')}
            </div>
            <div className="flex items-center text-gray-600">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatDuration(course.duration || 0)}
            </div>
            <div className="flex items-center text-gray-600">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              {course.price === 0 ? t('common.free') : `$${course.price}`}
            </div>
            <div className="flex items-center text-gray-600">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {course.instructor?.firstName || 'Instructor'}
            </div>
          </div>

          {/* Progress Bar for enrolled courses */}
          {isEnrolled && course.progress !== undefined && (
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>{t('student.dashboard.courseCard.progress')}</span>
                <span>{course.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Action Button */}
          {getActionButton()}
        </div>
      </div>
    );
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Event handlers
  const handleEnroll = async (course) => {
    // In development mode, show payment modal but allow enrollment without payment
    if (course.price > 0) {
      setCourseToEnroll(course);
      setShowPaymentModal(true);
    } else {
      // Free course - enroll directly
      await performEnrollment(course);
    }
  };

  const performEnrollment = async (course) => {
    try {
      const response = await fetch(`http://localhost:5001/api/enrollments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'x-auth-token': localStorage.getItem('token'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ courseId: course.id })
      });

      if (response.ok) {
        alert('Successfully enrolled in course!');
        fetchDashboardData(); // Refresh data
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to enroll in course');
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
      alert('Failed to enroll in course');
    }
  };

  const handlePaymentSuccess = async (result) => {
    // In development mode, always succeed
    if (courseToEnroll) {
      await performEnrollment(courseToEnroll);
      setShowPaymentModal(false);
      setCourseToEnroll(null);
    }
  };

  const handleViewCourse = (course) => {
    setSelectedCourse(course);
    setShowCourseDetail(true);
  };

  const handleContinueCourse = (course) => {
    // Navigate to course player or next lesson
    window.location.href = `/course/${course.id}/play`;
  };

  const handleCloseCourseDetail = () => {
    setShowCourseDetail(false);
    setSelectedCourse(null);
  };

  if (loading) {
    return <Loading fullScreen size="xl" text={t('common.loading')} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {String(t('student.dashboard.title') || 'Student Dashboard')}
          </h1>
          <p className="text-gray-600 mt-2">
            {String(t('student.dashboard.welcome') || 'Welcome back')}, {user?.firstName || 'Student'}!
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
                <p className="text-sm font-medium text-gray-600">{t('student.dashboard.stats.totalCourses')}</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalCourses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t('student.dashboard.stats.enrolledCourses')}</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.enrolledCourses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t('student.dashboard.stats.completedCourses')}</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.completedCourses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{String(t('student.dashboard.stats.overallProgress') || 'Overall Progress')}</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.overallProgress}%</p>
              </div>
            </div>
          </div>
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
                📊 {String(t('student.dashboard.overview') || 'Overview')}
              </button>
              <button 
                onClick={() => setActiveTab('myCourses')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'myCourses'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📚 {String(t('student.dashboard.myCourses') || 'My Courses')}
              </button>
              <button 
                onClick={() => setActiveTab('availableCourses')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'availableCourses'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🎯 {String(t('student.dashboard.availableCourses') || 'Available Courses')}
              </button>
              <button 
                onClick={() => setActiveTab('certificates')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'certificates'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🏆 {String(t('student.dashboard.certificates.title') || 'Certificates')}
              </button>
              <button 
                onClick={() => setActiveTab('progress')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'progress'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📈 {String(t('student.dashboard.progress.overallProgress') || 'Progress')}
              </button>
            </nav>
                      </div>
                    </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* My Courses Section */}
            {enrolledCourses.length > 0 && (
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">{String(t('student.dashboard.myCourses') || 'My Courses')}</h3>
                    </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {enrolledCourses.slice(0, 6).map((enrollment) => (
                      <CourseCard 
                        key={enrollment.id} 
                        course={enrollment.course || enrollment} 
                        isEnrolled={true}
                        onView={handleViewCourse}
                        onContinue={handleContinueCourse}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Recent Activity */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">{t('student.dashboard.activity.recentActivity')}</h3>
              </div>
              <div className="p-6">
                {recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivity.slice(0, 5).map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">{String(activity.activityDescription || '')}</p>
                          <p className="text-xs text-gray-500">{activity.timestamp ? new Date(activity.timestamp).toLocaleDateString() : ''}</p>
                  </div>
                </div>
              ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">{t('student.dashboard.activity.noActivity')}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'myCourses' && (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">{String(t('student.dashboard.myCourses') || 'My Courses')}</h3>
              {enrolledCourses.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {enrolledCourses.map((enrollment) => (
                    <CourseCard 
                      key={enrollment.id} 
                      course={enrollment.course || enrollment} 
                      isEnrolled={true}
                      onView={handleViewCourse}
                      onContinue={handleContinueCourse}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No enrolled courses</h3>
                  <p className="mt-1 text-sm text-gray-500">Start by enrolling in a course</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'availableCourses' && (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">{String(t('student.dashboard.availableCourses') || 'Available Courses')}</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <CourseCard 
                    key={course.id} 
                    course={course} 
                    isEnrolled={false}
                    onView={handleViewCourse}
                    onEnroll={handleEnroll}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'certificates' && (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">{t('student.dashboard.certificates.title')}</h3>
              {certificates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {certificates.map((certificate) => (
                    <div key={certificate.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{String(certificate.courseName || 'Unknown Course')}</h4>
                        <span className="text-sm text-gray-500">{String(certificate.issuedDate || '')}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{String(certificate.title || '')}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-green-600">{String(certificate.grade || 'N/A')}</span>
                        <button className="text-blue-600 text-sm hover:text-blue-800">
                          {String(t('student.dashboard.certificates.viewCertificate') || 'View Certificate')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">{String(t('student.dashboard.certificates.noCertificates') || 'No certificates earned yet')}</h3>
                  <p className="mt-1 text-sm text-gray-500">{String(t('student.dashboard.certificates.noCertificatesDesc') || 'Complete courses to earn certificates')}</p>
                </div>
              )}
            </div>
                  </div>
        )}

        {activeTab === 'progress' && (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">{String(t('student.dashboard.progress.overallProgress') || 'Overall Progress')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{stats.overallProgress}%</div>
                  <div className="text-sm text-gray-600">{String(t('student.dashboard.progress.completionRate') || 'Completion Rate')}</div>
                  </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{stats.completedCourses}</div>
                  <div className="text-sm text-gray-600">{String(t('student.dashboard.progress.lessonsCompleted') || 'Lessons Completed')}</div>
                  </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{formatDuration(stats.totalStudyTime)}</div>
                  <div className="text-sm text-gray-600">{String(t('student.dashboard.progress.timeSpent') || 'Time Spent')}</div>
                </div>
          </div>
        </div>
          </div>
        )}

        {/* Course Detail Modal */}
        <CourseDetailModal
          course={selectedCourse}
          isOpen={showCourseDetail}
          onClose={handleCloseCourseDetail}
        />
      </div>

      {/* Payment Modal */}
      <CoursePaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        course={courseToEnroll}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default StudentDashboard;
