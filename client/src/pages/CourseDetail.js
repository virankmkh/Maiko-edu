import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import Forum from '../components/Forum';
import { 
  BookOpen, 
  Users, 
  Clock, 
  Star, 
  Play, 
  MessageSquare,
  Video,
  FileText,
  Code,
  HelpCircle,
  BookOpen as Assignment
} from 'lucide-react';

const CourseDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  useEffect(() => {
    // Check for tab parameter in URL
    const urlParams = new URLSearchParams(location.search);
    const tab = urlParams.get('tab');
    if (tab && ['overview', 'forum'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [location.search]);

  const fetchCourseDetails = async () => {
    try {
      const response = await fetch(`/api/courses/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setCourse(data);
      
      // Fetch lessons
      const lessonsResponse = await fetch(`/api/lessons/course/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const lessonsData = await lessonsResponse.json();
      setLessons(lessonsData);
    } catch (error) {
      console.error('Error fetching course details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLessonSelect = (lesson) => {
    setSelectedLesson(lesson);
    setActiveTab('forum');
  };

  const getLessonIcon = (lesson) => {
    if (lesson.hasCode) return Code;
    if (lesson.hasVideo) return Video;
    if (lesson.hasQuiz) return HelpCircle;
    if (lesson.hasAssignment) return Assignment;
    return FileText;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Course Not Found</h1>
            <p className="text-xl text-gray-600">The course you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Course Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
              <p className="text-lg text-gray-600 mb-4">{course.description}</p>
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {course.enrollmentCount || 0} students
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {course.duration || 'Self-paced'}
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-1" />
                  {course.averageRating || course.rating || 'No ratings yet'} rating
                </div>
                <div className="flex items-center">
                  <span className="text-lg font-semibold text-green-600">
                    ${course.price || 0}
                  </span>
                </div>
              </div>
            </div>
            <div className="ml-8">
              <button className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Play className="w-5 h-5 mr-2" />
                Enroll Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex">
          {/* Sidebar - Course Content */}
          <div className="w-1/3 pr-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Course Content</h2>
                <p className="text-sm text-gray-600">{lessons.length} lessons</p>
              </div>
              <div className="p-4">
                <div className="space-y-2">
                  {lessons.map((lesson, index) => {
                    const LessonIcon = getLessonIcon(lesson);
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => handleLessonSelect(lesson)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          selectedLesson?.id === lesson.id
                            ? 'bg-blue-50 border border-blue-200'
                            : 'hover:bg-gray-50 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <LessonIcon className="w-4 h-4 text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 text-sm">
                              {lesson.title || `Lesson ${index + 1}`}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {lesson.description || 'No description'}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              {lesson.hasVideo && <Video className="w-3 h-3 text-red-600" />}
                              {lesson.hasCode && <Code className="w-3 h-3 text-green-600" />}
                              {lesson.hasQuiz && <HelpCircle className="w-3 h-3 text-purple-600" />}
                              {lesson.hasAssignment && <Assignment className="w-3 h-3 text-orange-600" />}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Tabs */}
            <div className="mb-6">
              <nav className="flex space-x-8">
                {[
                  { key: 'overview', label: 'Overview', icon: BookOpen },
                  { key: 'forum', label: 'Discussion', icon: MessageSquare }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.key
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Course Overview</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-4">{course.description}</p>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">What you'll learn</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 mb-6">
                    <li>Master the fundamentals</li>
                    <li>Build real-world projects</li>
                    <li>Get hands-on experience</li>
                    <li>Join a community of learners</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Course Requirements</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Basic computer skills</li>
                    <li>Internet connection</li>
                    <li>No prior experience required</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'forum' && (
              <Forum
                courseId={course.id}
                lessonId={selectedLesson?.id}
                courseTitle={course.title}
                lessonTitle={selectedLesson?.title}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
