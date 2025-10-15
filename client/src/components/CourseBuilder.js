import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import AdvancedLessonEditor from './AdvancedLessonEditor';
import { 
  Plus, 
  Video, 
  FileText, 
  HelpCircle, 
  BookOpen, 
  Upload,
  Save,
  Eye,
  EyeOff,
  Trash2,
  GripVertical,
  Play,
  Clock,
  Edit,
  Code
} from 'lucide-react';

const CourseBuilder = ({ courseId, onSave, onCancel }) => {
  const { t } = useLanguage();
  const [course, setCourse] = useState({
    title: '',
    description: '',
    category: 'technology',
    price: 5,
    language: 'en',
    difficulty: 'beginner',
    status: 'draft'
  });
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [editingLesson, setEditingLesson] = useState(null);
  const [showLessonEditor, setShowLessonEditor] = useState(false);
  const [predefinedCourses, setPredefinedCourses] = useState([]);
  const [selectedPredefinedCourse, setSelectedPredefinedCourse] = useState(null);
  const [showPredefinedCourses, setShowPredefinedCourses] = useState(false);

  // Course categories from home page
  const categories = [
    { value: 'business', label: t('instructor.courseBuilder.categories.business'), icon: '💼' },
    { value: 'technology', label: t('instructor.courseBuilder.categories.technology'), icon: '💻' },
    { value: 'arts', label: 'Arts & Compétences Créatives', icon: '🎨' },
    { value: 'language', label: t('instructor.courseBuilder.categories.language'), icon: '🌍' },
    { value: 'health', label: t('instructor.courseBuilder.categories.health'), icon: '🏥' },
    { value: 'lifeSkills', label: t('instructor.courseBuilder.categories.lifeSkills'), icon: '🌟' }
  ];

  const difficulties = [
    { value: 'beginner', label: t('instructor.courseBuilder.difficulties.beginner') },
    { value: 'intermediate', label: t('instructor.courseBuilder.difficulties.intermediate') },
    { value: 'advanced', label: t('instructor.courseBuilder.difficulties.advanced') }
  ];

  const lessonTypes = [
    { value: 'video', label: t('instructor.courseBuilder.lessonTypes.video'), icon: Video },
    { value: 'text', label: t('instructor.courseBuilder.lessonTypes.text'), icon: FileText },
    { value: 'quiz', label: t('instructor.courseBuilder.lessonTypes.quiz'), icon: HelpCircle },
    { value: 'assignment', label: t('instructor.courseBuilder.lessonTypes.assignment'), icon: BookOpen },
    { value: 'document', label: t('instructor.courseBuilder.lessonTypes.document'), icon: Upload }
  ];

  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  // Fetch predefined courses when arts category is selected
  useEffect(() => {
    if (course.category === 'arts') {
      fetchPredefinedCourses();
    }
  }, [course.category]);

  const fetchCourse = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/courses/${courseId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'x-auth-token': localStorage.getItem('token')
        }
      });
      
      if (response.ok) {
        const courseData = await response.json();
        setCourse(courseData);
      }

      // Fetch lessons
      const lessonsResponse = await fetch(`/api/lessons/instructor/course/${courseId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'x-auth-token': localStorage.getItem('token')
        }
      });
      
      if (lessonsResponse.ok) {
        const lessonsData = await lessonsResponse.json();
        setLessons(lessonsData.lessons || []);
      }
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPredefinedCourses = async () => {
    try {
      const response = await fetch('/api/courses/predefined/arts/formatted', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'x-auth-token': localStorage.getItem('token')
        }
      });
      
      if (response.ok) {
        const courses = await response.json();
        setPredefinedCourses(courses);
        setShowPredefinedCourses(true);
      }
    } catch (error) {
      console.error('Error fetching predefined courses:', error);
    }
  };

  const handlePredefinedCourseSelect = (predefinedCourse) => {
    setSelectedPredefinedCourse(predefinedCourse);
    setCourse(prev => ({
      ...prev,
      title: predefinedCourse.title,
      subtitle: predefinedCourse.subtitle,
      description: predefinedCourse.description,
      shortDescription: predefinedCourse.shortDescription,
      subcategory: predefinedCourse.subcategory,
      tags: predefinedCourse.tags,
      difficulty: predefinedCourse.difficulty,
      level: predefinedCourse.level
    }));
    setShowPredefinedCourses(false);
  };

  const handleCourseChange = (field, value) => {
    setCourse(prev => ({ ...prev, [field]: value }));
    
    // If changing category away from arts, reset predefined course selection
    if (field === 'category' && value !== 'arts') {
      setSelectedPredefinedCourse(null);
      setShowPredefinedCourses(false);
      setPredefinedCourses([]);
    }
  };

  const addLesson = () => {
    const newLesson = {
      id: `temp_${Date.now()}`,
      title: '',
      description: '',
      content: '',
      // All features as toggles
      hasVideo: false,
      hasDocument: false,
      hasQuiz: false,
      hasCode: false,
      hasAssignment: false,
      // Media data
      videoUrl: '',
      videoDuration: 0,
      documentUrl: '',
      images: [],
      // Quiz data
      quizData: {
        questions: [],
        timeLimit: 0,
        passingScore: 70
      },
      // Code data
      codeData: {
        language: 'javascript',
        starterCode: '',
        solution: '',
        tests: [],
        instructions: ''
      },
      // Assignment data
      assignmentData: {
        instructions: '',
        requirements: [],
        dueDate: '',
        points: 100
      },
      order: lessons.length + 1,
      isFree: false,
      isPublished: false,
      prerequisites: [],
      objectives: [],
      resources: []
    };
    setEditingLesson(newLesson);
    setShowLessonEditor(true);
  };

  const updateLesson = (lessonId, field, value) => {
    setLessons(prev => prev.map(lesson => 
      lesson.id === lessonId ? { ...lesson, [field]: value } : lesson
    ));
  };

  const deleteLesson = (lessonId) => {
    setLessons(prev => prev.filter(lesson => lesson.id !== lessonId));
  };

  const editLesson = (lesson) => {
    setEditingLesson(lesson);
    setShowLessonEditor(true);
  };

  const handleLessonSave = (savedLesson) => {
    if (savedLesson.id.startsWith('temp_')) {
      // New lesson
      setLessons(prev => [...prev, savedLesson]);
    } else {
      // Update existing lesson
      setLessons(prev => prev.map(lesson => 
        lesson.id === savedLesson.id ? savedLesson : lesson
      ));
    }
    setShowLessonEditor(false);
    setEditingLesson(null);
  };

  const handleLessonCancel = () => {
    setShowLessonEditor(false);
    setEditingLesson(null);
  };

  const reorderLessons = (fromIndex, toIndex) => {
    const newLessons = [...lessons];
    const [movedLesson] = newLessons.splice(fromIndex, 1);
    newLessons.splice(toIndex, 0, movedLesson);
    
    // Update order numbers
    newLessons.forEach((lesson, index) => {
      lesson.order = index + 1;
    });
    
    setLessons(newLessons);
  };

  const saveCourse = async () => {
    try {
      setIsLoading(true);

      // Use predefined course creation for arts category
      let courseResponse;
      if (course.category === 'arts' && selectedPredefinedCourse && !courseId) {
        courseResponse = await fetch('/api/courses/predefined/create', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'x-auth-token': localStorage.getItem('token'),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            categoryKey: 'arts',
            title: course.title,
            price: course.price,
            language: course.language
          })
        });
      } else {
        // Regular course creation/update
        courseResponse = await fetch(courseId ? `/api/courses/${courseId}` : '/api/courses', {
          method: courseId ? 'PUT' : 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'x-auth-token': localStorage.getItem('token'),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(course)
        });
      }

      if (!courseResponse.ok) {
        throw new Error('Failed to save course');
      }

      const savedCourse = await courseResponse.json();
      const finalCourseId = savedCourse.id || courseId;

      // Save lessons
      for (const lesson of lessons) {
        if (lesson.id.startsWith('temp_')) {
          // Create new lesson
          await fetch('/api/lessons', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'x-auth-token': localStorage.getItem('token'),
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              ...lesson,
              courseId: finalCourseId
            })
          });
        } else {
          // Update existing lesson
          await fetch(`/api/lessons/${lesson.id}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'x-auth-token': localStorage.getItem('token'),
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(lesson)
          });
        }
      }

      onSave && onSave(savedCourse);
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Failed to save course');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (showLessonEditor) {
    return (
      <AdvancedLessonEditor
        lesson={editingLesson}
        onSave={handleLessonSave}
        onCancel={handleLessonCancel}
        courseCategory={course.category}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 bg-white border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900">
          {courseId ? t('instructor.courseBuilder.editCourse') : t('instructor.courseBuilder.createCourse')}
        </h2>
        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium transition-colors"
          >
            {t('instructor.courseBuilder.cancel')}
          </button>
          <button
            onClick={saveCourse}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium transition-colors"
          >
            {isLoading ? t('instructor.courseBuilder.saving') : t('instructor.courseBuilder.saveCourse')}
          </button>
        </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6 bg-white">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'basic', label: t('instructor.courseBuilder.basic') },
            { key: 'lessons', label: t('instructor.courseBuilder.lessons') },
            { key: 'preview', label: t('instructor.courseBuilder.preview') }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

        {/* Basic Information Tab */}
        {activeTab === 'basic' && (
          <div className="space-y-6 bg-white p-6 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('instructor.courseBuilder.courseTitle')} *
              </label>
              {course.category === 'arts' ? (
                <div>
                  <select
                    value={course.title}
                    onChange={(e) => {
                      const selectedCourse = predefinedCourses.find(c => c.title === e.target.value);
                      if (selectedCourse) {
                        handlePredefinedCourseSelect(selectedCourse);
                      }
                    }}
                    className="custom-dropdown w-full px-3 py-2 rounded-md"
                  >
                    <option value="">Select a predefined course...</option>
                    {predefinedCourses.map((predefinedCourse, index) => (
                      <option key={index} value={predefinedCourse.title}>
                        {predefinedCourse.title}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-sm text-gray-500">
                    Only predefined courses are available for Arts & Compétences Créatives category
                  </p>
                </div>
              ) : (
                <input
                  type="text"
                  value={course.title}
                  onChange={(e) => handleCourseChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 bg-white"
                  placeholder={t('instructor.courseBuilder.courseTitlePlaceholder')}
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('instructor.courseBuilder.category')} *
              </label>
              <select
                value={course.category}
                onChange={(e) => handleCourseChange('category', e.target.value)}
                className="custom-dropdown w-full px-3 py-2 rounded-md"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('instructor.courseBuilder.price')}
              </label>
              <input
                type="number"
                value={course.price}
                onChange={(e) => handleCourseChange('price', parseFloat(e.target.value) || 5)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 bg-white"
                placeholder="5.00"
                step="5"
                min="5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('instructor.courseBuilder.difficulty')}
              </label>
              <select
                value={course.difficulty}
                onChange={(e) => handleCourseChange('difficulty', e.target.value)}
                className="custom-dropdown w-full px-3 py-2 rounded-md"
              >
                {difficulties.map((diff) => (
                  <option key={diff.value} value={diff.value}>
                    {diff.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('instructor.courseBuilder.courseDescription')} *
            </label>
            <textarea
              value={course.description}
              onChange={(e) => handleCourseChange('description', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 bg-white resize-vertical"
              placeholder={t('instructor.courseBuilder.courseDescriptionPlaceholder')}
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center text-gray-700">
              <input
                type="checkbox"
                checked={course.status === 'published'}
                onChange={(e) => handleCourseChange('status', e.target.checked ? 'published' : 'draft')}
                className="mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              {t('instructor.courseBuilder.publishCourse')}
            </label>
          </div>
        </div>
      )}

        {/* Lessons Tab */}
        {activeTab === 'lessons' && (
          <div className="space-y-6 bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">{t('instructor.courseBuilder.courseLessons')}</h3>
            <button
              onClick={addLesson}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('instructor.courseBuilder.addLesson')}
            </button>
          </div>

          <div className="space-y-4">
            {lessons.map((lesson, index) => (
              <div key={lesson.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                    <span className="text-sm font-medium text-gray-500">
                      Lesson {lesson.order}
                    </span>
                    <div className="flex items-center space-x-2 flex-wrap">
                      {lesson.hasVideo && <Video className="w-4 h-4 text-red-600" title="Video" />}
                      {lesson.hasDocument && <FileText className="w-4 h-4 text-gray-600" title="Document" />}
                      {lesson.hasQuiz && <HelpCircle className="w-4 h-4 text-purple-600" title="Quiz" />}
                      {lesson.hasCode && <Code className="w-4 h-4 text-green-600" title="Code" />}
                      {lesson.hasAssignment && <BookOpen className="w-4 h-4 text-orange-600" title="Assignment" />}
                      {!lesson.hasVideo && !lesson.hasDocument && !lesson.hasQuiz && !lesson.hasCode && !lesson.hasAssignment && (
                        <span className="text-sm text-gray-500">Text only</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => editLesson(lesson)}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                      title="Edit lesson"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => updateLesson(lesson.id, 'isPublished', !lesson.isPublished)}
                      className={`p-1 rounded ${
                        lesson.isPublished 
                          ? 'text-green-600 bg-green-100' 
                          : 'text-gray-400 bg-gray-100'
                      }`}
                      title={lesson.isPublished ? 'Unpublish' : 'Publish'}
                    >
                      {lesson.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => deleteLesson(lesson.id)}
                      className="p-1 text-red-600 hover:bg-red-100 rounded"
                      title="Delete lesson"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">{lesson.title || 'Untitled Lesson'}</h4>
                  <p className="text-sm text-gray-600 mb-3">{lesson.description || 'No description'}</p>
                  
                  {/* Show lesson-specific content */}
                  <div className="space-y-2">
                    {lesson.hasVideo && lesson.videoUrl && (
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Video className="w-4 h-4" />
                        <span>Video uploaded ({lesson.videoDuration} min)</span>
                      </div>
                    )}
                    
                    {lesson.hasCode && lesson.codeData && (
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Code className="w-4 h-4" />
                        <span>{lesson.codeData.language} • {lesson.codeData.tests?.length || 0} tests</span>
                      </div>
                    )}
                    
                    {lesson.hasQuiz && lesson.quizData && (
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <HelpCircle className="w-4 h-4" />
                        <span>{lesson.quizData.questions?.length || 0} questions • {lesson.quizData.timeLimit} min</span>
                      </div>
                    )}
                    
                    {lesson.hasDocument && lesson.documentUrl && (
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <FileText className="w-4 h-4" />
                        <span>Document uploaded</span>
                      </div>
                    )}

                    {lesson.hasAssignment && lesson.assignmentData && (
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <BookOpen className="w-4 h-4" />
                        <span>Assignment • {lesson.assignmentData.points} points</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Lesson content preview - detailed view removed since we use advanced editor */}
              </div>
            ))}

            {lessons.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>{t('instructor.courseBuilder.noLessons')}</p>
              </div>
            )}
          </div>
          </div>
        )}

        {/* Preview Tab */}
        {activeTab === 'preview' && (
          <div className="space-y-6 bg-white p-6 rounded-lg border border-gray-200">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h3>
            <p className="text-gray-600 mb-4">{course.description}</p>
            
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {lessons.reduce((total, lesson) => total + (lesson.videoDuration || 0), 0)} {t('instructor.courseBuilder.minutes')}
                      </span>
                      <span>{lessons.length} lessons</span>
                      <span className="capitalize">{course.difficulty}</span>
                      <span className="font-semibold text-green-600">${course.price}</span>
                    </div>

            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-3">{t('instructor.courseBuilder.courseContent')}</h4>
              <div className="space-y-2">
                {lessons.map((lesson, index) => (
                  <div key={lesson.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-500">{index + 1}</span>
                      <div className="flex items-center space-x-2">
                        {lessonTypes.find(type => type.value === lesson.lessonType)?.icon && 
                          React.createElement(lessonTypes.find(type => type.value === lesson.lessonType).icon, 
                            { className: "w-4 h-4 text-gray-500" }
                          )
                        }
                        <span className="text-sm">{lesson.title}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {lesson.videoDuration > 0 && (
                        <span className="text-xs text-gray-500">{lesson.videoDuration}m</span>
                      )}
                      {lesson.isFree && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">{t('instructor.courseBuilder.free')}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseBuilder;
