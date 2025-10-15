import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Upload, 
  Video, 
  FileText, 
  Image, 
  File, 
  Code, 
  HelpCircle, 
  BookOpen,
  Play,
  Pause,
  Save,
  Eye,
  EyeOff,
  Trash2,
  Plus,
  X,
  Download,
  ExternalLink
} from 'lucide-react';

const lessonTypes = [
  { value: 'video', label: 'Video', icon: Video, color: 'red' },
  { value: 'text', label: 'Text', icon: FileText, color: 'blue' },
  { value: 'quiz', label: 'Quiz', icon: HelpCircle, color: 'green' },
  { value: 'assignment', label: 'Assignment', icon: BookOpen, color: 'purple' },
  { value: 'document', label: 'Document', icon: File, color: 'orange' },
  { value: 'code', label: 'Code', icon: Code, color: 'indigo' }
];

const AdvancedLessonEditor = ({ lesson, onSave, onCancel, courseCategory }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('content');
  const [lessonData, setLessonData] = useState({
    title: lesson?.title || '',
    description: lesson?.description || '',
    content: lesson?.content || '',
    // All features as toggles
    hasVideo: lesson?.hasVideo || false,
    hasDocument: lesson?.hasDocument || false,
    hasQuiz: lesson?.hasQuiz || false,
    hasCode: lesson?.hasCode || false,
    hasAssignment: lesson?.hasAssignment || false,
    // Media data
    videoFile: null,
    videoUrl: lesson?.videoUrl || '',
    videoDuration: lesson?.videoDuration || 0,
    documentFile: null,
    documentUrl: lesson?.documentUrl || '',
    images: lesson?.images || [],
    // Quiz data
    quizData: lesson?.quizData || {
      questions: [],
      timeLimit: 0,
      passingScore: 70
    },
    // Code data
    codeData: lesson?.codeData || {
      language: 'javascript',
      starterCode: '',
      solution: '',
      tests: [],
      instructions: ''
    },
    // Assignment data
    assignmentData: lesson?.assignmentData || {
      instructions: '',
      requirements: [],
      dueDate: '',
      points: 100
    },
    isFree: lesson?.isFree || false,
    isPublished: lesson?.isPublished || false,
    prerequisites: lesson?.prerequisites || [],
    objectives: lesson?.objectives || [],
    resources: lesson?.resources || []
  });

  const [uploading, setUploading] = useState(false);
  const [codeOutput, setCodeOutput] = useState('');
  const [isRunningCode, setIsRunningCode] = useState(false);

  const lessonFeatures = [
    { key: 'hasVideo', label: 'Video Content', icon: Video, color: 'red' },
    { key: 'hasDocument', label: 'Document/PDF', icon: File, color: 'gray' },
    { key: 'hasQuiz', label: 'Quiz', icon: HelpCircle, color: 'purple' },
    { key: 'hasCode', label: 'Coding Exercise', icon: Code, color: 'green' },
    { key: 'hasAssignment', label: 'Assignment', icon: BookOpen, color: 'orange' }
  ];

  const programmingLanguages = [
    { value: 'javascript', label: 'JavaScript', extension: 'js' },
    { value: 'python', label: 'Python', extension: 'py' },
    { value: 'java', label: 'Java', extension: 'java' },
    { value: 'cpp', label: 'C++', extension: 'cpp' },
    { value: 'html', label: 'HTML', extension: 'html' },
    { value: 'css', label: 'CSS', extension: 'css' },
    { value: 'react', label: 'React', extension: 'jsx' },
    { value: 'vue', label: 'Vue.js', extension: 'vue' },
    { value: 'php', label: 'PHP', extension: 'php' },
    { value: 'sql', label: 'SQL', extension: 'sql' }
  ];

  const handleInputChange = (field, value) => {
    setLessonData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (file, type) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'x-auth-token': localStorage.getItem('token')
        },
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        handleInputChange(type === 'video' ? 'videoUrl' : 'documentUrl', result.url);
        if (type === 'video') {
          // Extract duration from video metadata
          const video = document.createElement('video');
          video.preload = 'metadata';
          video.onloadedmetadata = () => {
            handleInputChange('videoDuration', Math.round(video.duration / 60));
          };
          video.src = URL.createObjectURL(file);
        }
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('File upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const addQuizQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      question: '',
      type: 'multiple-choice',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      points: 1
    };
    handleInputChange('quizData', {
      ...lessonData.quizData,
      questions: [...lessonData.quizData.questions, newQuestion]
    });
  };

  const updateQuizQuestion = (questionId, field, value) => {
    const updatedQuestions = lessonData.quizData.questions.map(q => 
      q.id === questionId ? { ...q, [field]: value } : q
    );
    handleInputChange('quizData', { ...lessonData.quizData, questions: updatedQuestions });
  };

  const removeQuizQuestion = (questionId) => {
    const updatedQuestions = lessonData.quizData.questions.filter(q => q.id !== questionId);
    handleInputChange('quizData', { ...lessonData.quizData, questions: updatedQuestions });
  };

  const addCodeTest = () => {
    const newTest = {
      id: Date.now(),
      name: '',
      input: '',
      expectedOutput: '',
      description: ''
    };
    handleInputChange('codeData', {
      ...lessonData.codeData,
      tests: [...lessonData.codeData.tests, newTest]
    });
  };

  const updateCodeTest = (testId, field, value) => {
    const updatedTests = lessonData.codeData.tests.map(t => 
      t.id === testId ? { ...t, [field]: value } : t
    );
    handleInputChange('codeData', { ...lessonData.codeData, tests: updatedTests });
  };

  const removeCodeTest = (testId) => {
    const updatedTests = lessonData.codeData.tests.filter(t => t.id !== testId);
    handleInputChange('codeData', { ...lessonData.codeData, tests: updatedTests });
  };

  const runCode = async () => {
    setIsRunningCode(true);
    setCodeOutput('Running...');
    
    try {
      const response = await fetch('/api/ide/execute', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'x-auth-token': localStorage.getItem('token'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          language: lessonData.codeData.language,
          code: lessonData.codeData.starterCode,
          tests: lessonData.codeData.tests
        })
      });

      if (response.ok) {
        const result = await response.json();
        setCodeOutput(result.output || result.error || 'No output');
      } else {
        setCodeOutput('Execution failed');
      }
    } catch (error) {
      setCodeOutput('Error: ' + error.message);
    } finally {
      setIsRunningCode(false);
    }
  };

  const saveLesson = () => {
    onSave(lessonData);
  };

  const getLessonTypeIcon = (type) => {
    const lessonType = lessonTypes.find(lt => lt.value === type);
    return lessonType ? lessonType.icon : FileText;
  };

  const getLessonTypeColor = (type) => {
    const lessonType = lessonTypes.find(lt => lt.value === type);
    return lessonType ? lessonType.color : 'blue';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 bg-white border-b border-gray-200 pb-4">
          <div className="flex items-center space-x-3">
            {React.createElement(getLessonTypeIcon(lessonData.lessonType), { 
              className: `w-6 h-6 text-${getLessonTypeColor(lessonData.lessonType)}-600` 
            })}
            <h2 className="text-2xl font-bold text-gray-900">
              {lesson?.id ? 'Edit Lesson' : 'Create New Lesson'}
            </h2>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={saveLesson}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors"
            >
              Save Lesson
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6 bg-white">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'content', label: 'Content', always: true },
              { key: 'media', label: 'Media & Files', condition: () => lessonData.hasVideo || lessonData.hasDocument },
              { key: 'code', label: 'Code Editor', condition: () => courseCategory === 'technology' && lessonData.hasCode },
              { key: 'quiz', label: 'Quiz Builder', condition: () => lessonData.hasQuiz },
              { key: 'assignment', label: 'Assignment', condition: () => lessonData.hasAssignment },
              { key: 'settings', label: 'Settings', always: true }
            ].filter(tab => tab.always || (tab.condition && tab.condition())).map((tab) => (
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

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="space-y-6 bg-white p-6 rounded-lg border border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lesson Title *
              </label>
              <input
                type="text"
                value={lessonData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 bg-white"
                placeholder="Enter lesson title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Lesson Features (Select all that apply)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {lessonFeatures.map((feature) => (
                  <label key={feature.key} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={lessonData[feature.key]}
                      onChange={(e) => handleInputChange(feature.key, e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <div className="flex items-center space-x-2">
                      {React.createElement(feature.icon, { 
                        className: `w-5 h-5 text-${feature.color}-600` 
                      })}
                      <span className="text-sm font-medium text-gray-700">
                        {feature.label}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={lessonData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 bg-white resize-vertical"
                placeholder="Brief description of this lesson"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <textarea
                value={lessonData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 bg-white resize-vertical"
                placeholder="Lesson content, instructions, or notes"
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center text-gray-700">
                <input
                  type="checkbox"
                  checked={lessonData.isFree}
                  onChange={(e) => handleInputChange('isFree', e.target.checked)}
                  className="mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                Free lesson
              </label>
              <label className="flex items-center text-gray-700">
                <input
                  type="checkbox"
                  checked={lessonData.isPublished}
                  onChange={(e) => handleInputChange('isPublished', e.target.checked)}
                  className="mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                Publish lesson
              </label>
            </div>
          </div>
        )}

        {/* Media & Files Tab */}
        {activeTab === 'media' && (
          <div className="space-y-6 bg-white p-6 rounded-lg border border-gray-200">
            {lessonData.hasVideo && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video Upload
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        handleFileUpload(e.target.files[0], 'video');
                      }
                    }}
                    className="hidden"
                    id="video-upload"
                  />
                  <label
                    htmlFor="video-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Video className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      Upload Video File
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      MP4, MOV, AVI up to 500MB
                    </p>
                    <button
                      type="button"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Choose Video
                    </button>
                  </label>
                </div>
                {lessonData.videoUrl && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-green-800">Video uploaded successfully!</p>
                    <p className="text-sm text-green-600">Duration: {lessonData.videoDuration} minutes</p>
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Upload
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      handleFileUpload(e.target.files[0], 'document');
                    }
                  }}
                  className="hidden"
                  id="document-upload"
                />
                <label
                  htmlFor="document-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <File className="w-12 h-12 text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Upload Document
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    PDF, DOC, PPT up to 50MB
                  </p>
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Choose Document
                  </button>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image Upload
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    Array.from(e.target.files).forEach(file => {
                      handleFileUpload(file, 'image');
                    });
                  }}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Image className="w-12 h-12 text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Upload Images
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    JPG, PNG, GIF up to 10MB each
                  </p>
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Choose Images
                  </button>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Code Editor Tab */}
        {activeTab === 'code' && courseCategory === 'technology' && lessonData.hasCode && (
          <div className="space-y-6 bg-white p-6 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Programming Language
                </label>
                <select
                  value={lessonData.codeData.language}
                  onChange={(e) => handleInputChange('codeData', {
                    ...lessonData.codeData,
                    language: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                >
                  {programmingLanguages.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instructions
              </label>
              <textarea
                value={lessonData.codeData.instructions}
                onChange={(e) => handleInputChange('codeData', {
                  ...lessonData.codeData,
                  instructions: e.target.value
                })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 bg-white resize-vertical"
                placeholder="Instructions for the coding exercise"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Starter Code
                </label>
                <textarea
                  value={lessonData.codeData.starterCode}
                  onChange={(e) => handleInputChange('codeData', {
                    ...lessonData.codeData,
                    starterCode: e.target.value
                  })}
                  rows={12}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 bg-white font-mono text-sm resize-vertical"
                  placeholder="// Starter code for students"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Solution Code
                </label>
                <textarea
                  value={lessonData.codeData.solution}
                  onChange={(e) => handleInputChange('codeData', {
                    ...lessonData.codeData,
                    solution: e.target.value
                  })}
                  rows={12}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 bg-white font-mono text-sm resize-vertical"
                  placeholder="// Complete solution"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Test Cases
                </label>
                <button
                  onClick={addCodeTest}
                  className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Test
                </button>
              </div>
              <div className="space-y-4">
                {lessonData.codeData.tests.map((test, index) => (
                  <div key={test.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-gray-900">Test Case {index + 1}</h4>
                      <button
                        onClick={() => removeCodeTest(test.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Test Name
                        </label>
                        <input
                          type="text"
                          value={test.name}
                          onChange={(e) => updateCodeTest(test.id, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 bg-white text-sm"
                          placeholder="Test case name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Input
                        </label>
                        <input
                          type="text"
                          value={test.input}
                          onChange={(e) => updateCodeTest(test.id, 'input', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 bg-white text-sm"
                          placeholder="Test input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expected Output
                        </label>
                        <input
                          type="text"
                          value={test.expectedOutput}
                          onChange={(e) => updateCodeTest(test.id, 'expectedOutput', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 bg-white text-sm"
                          placeholder="Expected output"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <input
                          type="text"
                          value={test.description}
                          onChange={(e) => updateCodeTest(test.id, 'description', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 bg-white text-sm"
                          placeholder="Test description"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Code Output
                </label>
                <button
                  onClick={runCode}
                  disabled={isRunningCode}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {isRunningCode ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Run Code
                    </>
                  )}
                </button>
              </div>
              <textarea
                value={codeOutput}
                readOnly
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 font-mono text-sm resize-vertical"
                placeholder="Code output will appear here..."
              />
            </div>
          </div>
        )}

        {/* Quiz Builder Tab */}
        {activeTab === 'quiz' && lessonData.hasQuiz && (
          <div className="space-y-6 bg-white p-6 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Limit (minutes)
                </label>
                <input
                  type="number"
                  value={lessonData.quizData.timeLimit}
                  onChange={(e) => handleInputChange('quizData', {
                    ...lessonData.quizData,
                    timeLimit: parseInt(e.target.value) || 0
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 bg-white"
                  placeholder="0"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Passing Score (%)
                </label>
                <input
                  type="number"
                  value={lessonData.quizData.passingScore}
                  onChange={(e) => handleInputChange('quizData', {
                    ...lessonData.quizData,
                    passingScore: parseInt(e.target.value) || 70
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 bg-white"
                  placeholder="70"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Quiz Questions
                </label>
                <button
                  onClick={addQuizQuestion}
                  className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Question
                </button>
              </div>
              <div className="space-y-6">
                {lessonData.quizData.questions.map((question, index) => (
                  <div key={question.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium text-gray-900">Question {index + 1}</h4>
                      <button
                        onClick={() => removeQuizQuestion(question.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Question
                        </label>
                        <textarea
                          value={question.question}
                          onChange={(e) => updateQuizQuestion(question.id, 'question', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 bg-white resize-vertical"
                          placeholder="Enter your question"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Question Type
                        </label>
                        <select
                          value={question.type}
                          onChange={(e) => updateQuizQuestion(question.id, 'type', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                        >
                          <option value="multiple-choice">Multiple Choice</option>
                          <option value="true-false">True/False</option>
                          <option value="short-answer">Short Answer</option>
                        </select>
                      </div>

                      {question.type === 'multiple-choice' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Answer Options
                          </label>
                          <div className="space-y-2">
                            {question.options.map((option, optionIndex) => (
                              <div key={optionIndex} className="flex items-center space-x-3">
                                <input
                                  type="radio"
                                  name={`correct-${question.id}`}
                                  checked={question.correctAnswer === optionIndex}
                                  onChange={() => updateQuizQuestion(question.id, 'correctAnswer', optionIndex)}
                                  className="w-4 h-4 text-blue-600"
                                />
                                <input
                                  type="text"
                                  value={option}
                                  onChange={(e) => {
                                    const newOptions = [...question.options];
                                    newOptions[optionIndex] = e.target.value;
                                    updateQuizQuestion(question.id, 'options', newOptions);
                                  }}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 bg-white"
                                  placeholder={`Option ${optionIndex + 1}`}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Points
                          </label>
                          <input
                            type="number"
                            value={question.points}
                            onChange={(e) => updateQuizQuestion(question.id, 'points', parseInt(e.target.value) || 1)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 bg-white"
                            min="1"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Explanation
                        </label>
                        <textarea
                          value={question.explanation}
                          onChange={(e) => updateQuizQuestion(question.id, 'explanation', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 bg-white resize-vertical"
                          placeholder="Explanation for the correct answer"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Assignment Tab */}
        {activeTab === 'assignment' && lessonData.hasAssignment && (
          <div className="space-y-6 bg-white p-6 rounded-lg border border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assignment Instructions
              </label>
              <textarea
                value={lessonData.assignmentData.instructions}
                onChange={(e) => handleInputChange('assignmentData', {
                  ...lessonData.assignmentData,
                  instructions: e.target.value
                })}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 bg-white resize-vertical"
                placeholder="Detailed instructions for the assignment"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date
                </label>
                <input
                  type="datetime-local"
                  value={lessonData.assignmentData.dueDate}
                  onChange={(e) => handleInputChange('assignmentData', {
                    ...lessonData.assignmentData,
                    dueDate: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Points
                </label>
                <input
                  type="number"
                  value={lessonData.assignmentData.points}
                  onChange={(e) => handleInputChange('assignmentData', {
                    ...lessonData.assignmentData,
                    points: parseInt(e.target.value) || 100
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 bg-white"
                  min="1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Requirements
              </label>
              <textarea
                value={lessonData.assignmentData.requirements.join('\n')}
                onChange={(e) => handleInputChange('assignmentData', {
                  ...lessonData.assignmentData,
                  requirements: e.target.value.split('\n').filter(r => r.trim())
                })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 bg-white resize-vertical"
                placeholder="List assignment requirements (one per line)"
              />
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6 bg-white p-6 rounded-lg border border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prerequisites
              </label>
              <textarea
                value={lessonData.prerequisites.join('\n')}
                onChange={(e) => handleInputChange('prerequisites', e.target.value.split('\n').filter(p => p.trim()))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 bg-white resize-vertical"
                placeholder="List prerequisites (one per line)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Learning Objectives
              </label>
              <textarea
                value={lessonData.objectives.join('\n')}
                onChange={(e) => handleInputChange('objectives', e.target.value.split('\n').filter(o => o.trim()))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 bg-white resize-vertical"
                placeholder="List learning objectives (one per line)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Resources
              </label>
              <textarea
                value={lessonData.resources.join('\n')}
                onChange={(e) => handleInputChange('resources', e.target.value.split('\n').filter(r => r.trim()))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 bg-white resize-vertical"
                placeholder="List additional resources (one per line)"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedLessonEditor;
