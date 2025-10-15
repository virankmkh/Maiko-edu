import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import H5PPlayer from '../components/h5p/H5PPlayer';
import QuizComponent from '../components/QuizComponent';
import AssignmentComponent from '../components/AssignmentComponent';
import IDEPracticeComponent from '../components/IDEPracticeComponent';
import ForumComponent from '../components/ForumComponent';
import JitsiComponent from '../components/JitsiComponent';
import { Play, BookOpen, CheckCircle, Clock, Users } from 'lucide-react';

const CoursePlayer = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCourseData();
  }, [id]);

  const loadCourseData = async () => {
    try {
      setLoading(true);
      
      // Load course details
      const courseResponse = await fetch(`http://localhost:5001/api/courses/${id}`);
      if (!courseResponse.ok) {
        throw new Error(`Course API error: ${courseResponse.status}`);
      }
      const courseData = await courseResponse.json();
      console.log('Course data:', courseData);
      setCourse(courseData);

      // Load lessons
      const lessonsResponse = await fetch(`http://localhost:5001/api/lessons/course/${id}`);
      if (!lessonsResponse.ok) {
        throw new Error(`Lessons API error: ${lessonsResponse.status}`);
      }
      const lessonsData = await lessonsResponse.json();
      console.log('Lessons data:', lessonsData);
      setLessons(lessonsData.lessons || lessonsData || []);

      // Set first lesson as current if available
      const lessons = lessonsData.lessons || lessonsData || [];
      if (lessons.length > 0) {
        setCurrentLesson(lessons[0]);
      }

    } catch (error) {
      console.error('Error loading course data:', error);
      setError(`Failed to load course data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLessonSelect = (lesson) => {
    setCurrentLesson(lesson);
  };

  const renderLessonContent = () => {
    if (!currentLesson) {
      return (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Lesson Selected</h3>
          <p className="text-gray-600">Select a lesson from the sidebar to begin learning.</p>
        </div>
      );
    }

    // Check content types array
    const contentTypes = currentLesson.contentTypes || [];
    
    // Debug video data
    console.log('Video debug:', {
      contentTypes,
      hasVideo: contentTypes.includes('video'),
      videoUrl: currentLesson.videoUrl,
      fullVideoUrl: currentLesson.videoUrl?.startsWith('http') ? currentLesson.videoUrl : `http://localhost:5001${currentLesson.videoUrl}`
    });
    
    // Test video URL accessibility
    if (currentLesson.videoUrl) {
      const testUrl = currentLesson.videoUrl.startsWith('http') ? currentLesson.videoUrl : `http://localhost:5001${currentLesson.videoUrl}`;
      fetch(testUrl, { method: 'HEAD' })
        .then(response => {
          console.log('Video URL test:', {
            url: testUrl,
            status: response.status,
            statusText: response.statusText,
            contentType: response.headers.get('content-type')
          });
        })
        .catch(error => {
          console.error('Video URL test failed:', error);
        });
    }
    
    return (
      <div className="space-y-6">
        {/* Video Content */}
        {contentTypes.includes('video') && currentLesson.videoUrl && (
          <div className="bg-black rounded-lg overflow-hidden mb-6">
            <video 
              controls 
              className="w-full h-96"
              src={currentLesson.videoUrl.startsWith('http') ? currentLesson.videoUrl : `http://localhost:5001${currentLesson.videoUrl}`}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        )}
        
        {/* H5P Content */}
        {contentTypes.includes('h5p') && currentLesson.h5pContentId && (
          <div className="mb-6">
            <H5PPlayer
              contentId={currentLesson.h5pContentId}
              onContentComplete={(data) => {
                console.log('H5P content completed:', data);
                // Handle completion logic here
              }}
              onProgress={(progress) => {
                console.log('H5P progress:', progress);
                // Handle progress tracking here
              }}
            />
          </div>
        )}
        
        {/* Text Content */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{currentLesson.title}</h2>
          <p className="text-gray-800 mb-4">{currentLesson.description}</p>
          
          {currentLesson.content && (
            <div className="prose max-w-none course-player-content">
              <div dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
            </div>
          )}
          
          {currentLesson.objectives && currentLesson.objectives.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Learning Objectives</h3>
              <ul className="list-disc list-inside space-y-1">
                {currentLesson.objectives.map((objective, index) => (
                  <li key={index} className="text-gray-800">{objective}</li>
                ))}
              </ul>
            </div>
          )}
          
          {currentLesson.resources && currentLesson.resources.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Resources</h3>
              <ul className="space-y-2">
                {currentLesson.resources.map((resource, index) => (
                  <li key={index}>
                    <a 
                      href={resource.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      {resource.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {/* Quiz Content */}
        {contentTypes.includes('quiz') && currentLesson.quizData && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📝 Quiz: {currentLesson.title}</h3>
            <QuizComponent quizData={currentLesson.quizData} />
          </div>
        )}
        
        {/* Assignment Content */}
        {contentTypes.includes('assignment') && currentLesson.assignmentData && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Assignment: {currentLesson.assignmentData.title}</h3>
            <AssignmentComponent assignmentData={currentLesson.assignmentData} />
          </div>
        )}
        
        {/* IDE Practice Content */}
        {contentTypes.includes('ide') && currentLesson.codeData && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">💻 Code Practice: {currentLesson.title}</h3>
            <IDEPracticeComponent codeData={currentLesson.codeData} />
          </div>
        )}
        
        {/* Forum Content */}
        {contentTypes.includes('forum') && currentLesson.forumData && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">💬 Forum Discussion: {currentLesson.title}</h3>
            <ForumComponent forumData={currentLesson.forumData} />
          </div>
        )}
        
        {/* Jitsi Live Session Content */}
        {contentTypes.includes('jitsi') && currentLesson.jitsiData && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🎥 Live Session: {currentLesson.title}</h3>
            <JitsiComponent jitsiData={currentLesson.jitsiData} />
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Lessons List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Lessons</h2>
              <div className="space-y-2">
                {lessons.map((lesson, index) => (
                  <button
                    key={lesson.id}
                    onClick={() => handleLessonSelect(lesson)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      currentLesson?.id === lesson.id
                        ? 'bg-blue-50 border border-blue-200 text-blue-900'
                        : 'hover:bg-gray-50 text-gray-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium text-gray-800">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-medium text-sm text-gray-900">{lesson.title}</h3>
                          <p className="text-xs text-gray-600 capitalize">{lesson.lessonType}</p>
                        </div>
                      </div>
                      {lesson.isFree && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Free
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm">
              {/* Lesson Header */}
              {currentLesson && (
                <div className="border-b border-gray-200 p-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {currentLesson.title}
                  </h1>
                  {currentLesson.description && (
                    <p className="text-gray-800">{currentLesson.description}</p>
                  )}
                  <div className="flex items-center space-x-4 mt-4 text-sm text-gray-700">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>Lesson {lessons.findIndex(l => l.id === currentLesson.id) + 1} of {lessons.length}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BookOpen className="w-4 h-4" />
                      <span className="capitalize">{currentLesson.lessonType}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Lesson Content */}
              <div className="p-6">
                {renderLessonContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;
