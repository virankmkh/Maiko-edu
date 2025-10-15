import React, { useState, useEffect } from 'react';

const CourseEditModal = ({ course, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    shortDescription: '',
    category: 'technology',
    language: 'en',
    difficulty: 'beginner',
    level: 'basic',
    price: '0.00',
    currency: 'USD',
    isFree: false,
    enrollmentLimit: '',
    providesCertificate: true,
    certificateTemplate: 'default',
    firstLessonFree: true,
    enableLiveSessions: false,
    enableInteractiveContent: false,
    enableMarketing: false,
    enableMaikoCampaign: false,
    hasLabContent: false,
    labAccessLevel: 'none',
    targetAudience: '',
    prerequisites: [],
    learningOutcomes: [],
    keywords: [],
    tags: []
  });

  const [publishing, setPublishing] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen && course) {
      setFormData({
        title: course.title || '',
        subtitle: course.subtitle || '',
        description: course.description || '',
        shortDescription: course.shortDescription || '',
        category: course.category || 'technology',
        language: course.language || 'en',
        difficulty: course.difficulty || 'beginner',
        level: course.level || 'basic',
        price: course.price || '0.00',
        currency: course.currency || 'USD',
        isFree: course.isFree || false,
        enrollmentLimit: course.enrollmentLimit || '',
        providesCertificate: course.providesCertificate || true,
        certificateTemplate: course.certificateTemplate || 'default',
        firstLessonFree: course.firstLessonFree || true,
        enableLiveSessions: course.enableLiveSessions || false,
        enableInteractiveContent: course.enableInteractiveContent || false,
        enableMarketing: course.enableMarketing || false,
        enableMaikoCampaign: course.enableMaikoCampaign || false,
        hasLabContent: course.hasLabContent || false,
        labAccessLevel: course.labAccessLevel || 'none',
        targetAudience: course.targetAudience || '',
        prerequisites: course.prerequisites || [],
        learningOutcomes: course.learningOutcomes || [],
        keywords: course.keywords || [],
        tags: course.tags || []
      });
    }
  }, [isOpen, course]);

  // Category-specific interactive features
  const getCategoryFeatures = (category) => {
    const features = {
      'business': [
        { id: 'enableLiveSessions', label: 'Enable live sessions', description: 'Virtual business coaching and Q&A sessions' },
        { id: 'enableInteractiveContent', label: 'Enable interactive content', description: 'Interactive business simulations and case studies' },
        { id: 'hasLabContent', label: 'Include lab content', description: 'Virtual business labs with OpenSimBiz, financial modeling' },
        { id: 'enableMarketResearch', label: 'Market research tools', description: 'LimeSurvey integration for market research' },
        { id: 'enableFinancialModeling', label: 'Financial modeling labs', description: 'LibreOffice Calc templates and Metabase analytics' },
        { id: 'enablePitchDeck', label: 'Pitch deck creation', description: 'Penpot integration for business presentations' }
      ],
      'technology': [
        { id: 'enableLiveSessions', label: 'Enable live sessions', description: 'Live coding sessions and pair programming' },
        { id: 'enableInteractiveContent', label: 'Enable interactive content', description: 'Interactive coding challenges and tutorials' },
        { id: 'hasLabContent', label: 'Include lab content', description: 'Virtual coding labs with Theia IDE and JupyterLab' },
        { id: 'enableNetworkingLabs', label: 'Networking labs', description: 'EVE-NG or GNS3 for network simulations' },
        { id: 'enableDevOps', label: 'DevOps pipelines', description: 'GitLab CE integration for CI/CD practice' },
        { id: 'enableContainerLabs', label: 'Container labs', description: 'Docker-based application deployment practice' }
      ],
      'design': [
        { id: 'enableLiveSessions', label: 'Enable live sessions', description: 'Live design critiques and collaborative sessions' },
        { id: 'enableInteractiveContent', label: 'Enable interactive content', description: 'Interactive design tutorials and challenges' },
        { id: 'hasLabContent', label: 'Include lab content', description: 'Digital art labs with Krita and Inkscape' },
        { id: 'enable3DModeling', label: '3D modeling labs', description: 'Blender integration for 3D design projects' },
        { id: 'enableAudioEditing', label: 'Audio editing labs', description: 'Audacity for podcast and sound design' },
        { id: 'enableUIUX', label: 'UI/UX design labs', description: 'Penpot for interface and layout design' }
      ],
      'marketing': [
        { id: 'enableLiveSessions', label: 'Enable live sessions', description: 'Live marketing strategy sessions' },
        { id: 'enableInteractiveContent', label: 'Enable interactive content', description: 'Interactive marketing simulations' },
        { id: 'hasLabContent', label: 'Include lab content', description: 'Marketing campaign labs and analytics' },
        { id: 'enableAnalytics', label: 'Analytics dashboards', description: 'Metabase integration for marketing KPIs' },
        { id: 'enableSurveyTools', label: 'Survey tools', description: 'LimeSurvey for market research' },
        { id: 'enableDesignTools', label: 'Design tools', description: 'Penpot for marketing materials' }
      ],
      'lifestyle': [
        { id: 'enableLiveSessions', label: 'Enable live sessions', description: 'Live wellness coaching sessions' },
        { id: 'enableInteractiveContent', label: 'Enable interactive content', description: 'Interactive lifestyle planning tools' },
        { id: 'hasLabContent', label: 'Include lab content', description: 'Personal development labs and exercises' },
        { id: 'enableHealthTracking', label: 'Health tracking', description: 'OpenFoodFacts API for nutrition planning' },
        { id: 'enableFitnessData', label: 'Fitness visualization', description: 'Gnuplot for health and fitness data' },
        { id: 'enableGoalSetting', label: 'Goal setting tools', description: 'Penpot for visual goal-setting boards' }
      ],
      'health': [
        { id: 'enableLiveSessions', label: 'Enable live sessions', description: 'Live wellness coaching and consultations' },
        { id: 'enableInteractiveContent', label: 'Enable interactive content', description: 'Interactive health scenarios and decision making' },
        { id: 'hasLabContent', label: 'Include lab content', description: 'Health simulation labs with OpenSimHealth' },
        { id: 'enablePatientCases', label: 'Patient case studies', description: 'Simulated patient scenarios for learning' },
        { id: 'enableNutritionLabs', label: 'Nutrition labs', description: 'OpenFoodFacts API for diet planning' },
        { id: 'enableSpeechAnalysis', label: 'Speech analysis', description: 'Praat for pronunciation and speech training' }
      ],
      'education': [
        { id: 'enableLiveSessions', label: 'Enable live sessions', description: 'Live teaching and tutoring sessions' },
        { id: 'enableInteractiveContent', label: 'Enable interactive content', description: 'Interactive educational content and exercises' },
        { id: 'hasLabContent', label: 'Include lab content', description: 'Educational simulation labs' },
        { id: 'enableLanguagePractice', label: 'Language practice', description: 'Jitsi Meet for conversation practice' },
        { id: 'enableFlashcards', label: 'Flashcard system', description: 'Anki integration for spaced repetition' },
        { id: 'enableTranslation', label: 'Translation tools', description: 'LibreTranslate for language exercises' }
      ]
    };
    return features[category] || features['technology'];
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleArrayInputChange = (field, value) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({
      ...prev,
      [field]: items
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Check if user has a valid token
    const token = localStorage.getItem('token');
    if (!token) {
      setErrors({ general: 'You must be logged in to edit courses. Please log in again.' });
      setLoading(false);
      return;
    }

    try {
      console.log('Sending course update request...', { courseId: course.id, formData });
      
      const response = await fetch(`http://localhost:5001/api/courses/${course.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const updatedCourse = await response.json();
        console.log('Course updated successfully:', updatedCourse);
        onSave(updatedCourse);
        onClose();
      } else {
        const errorData = await response.json();
        console.error('Update failed:', errorData);
        setErrors(errorData.errors || { general: `Failed to update course: ${errorData.message || 'Unknown error'}` });
      }
    } catch (error) {
      console.error('Network error:', error);
      setErrors({ general: 'Network error. Please check your connection and try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePublishCourse = async () => {
    setPublishing(true);
    setErrors({});

    // Check if user has a valid token
    const token = localStorage.getItem('token');
    if (!token) {
      setErrors({ general: 'You must be logged in to publish courses. Please log in again.' });
      setPublishing(false);
      return;
    }

    try {
      console.log('Publishing course...', { courseId: course.id });
      
      const response = await fetch(`http://localhost:5001/api/courses/${course.id}/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          isPublished: true,
          publishedAt: new Date().toISOString()
        })
      });

      console.log('Publish response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('Course published successfully:', result);
        // The response contains the course in result.course
        const updatedCourse = result.course || result;
        onSave(updatedCourse);
        alert('Course published successfully!');
      } else {
        const errorData = await response.json();
        console.error('Publish failed:', errorData);
        setErrors(errorData.errors || { general: `Failed to publish course: ${errorData.message || 'Unknown error'}` });
      }
    } catch (error) {
      console.error('Publish network error:', error);
      setErrors({ general: 'Network error. Please check your connection and try again.' });
    } finally {
      setPublishing(false);
    }
  };

  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Edit Course: {course.title}</h2>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          <style jsx>{`
            input, textarea, select {
              color: #065f46 !important;
            }
            input::placeholder, textarea::placeholder {
              color: #6b7280 !important;
            }
          `}</style>
          {errors.general && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {errors.general}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    style={{ color: '#1f2937' }}
                    required
                  />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                <input
                  type="text"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  style={{ color: '#1f2937' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                <textarea
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="custom-dropdown w-full rounded-lg px-3 py-2"
                  >
                    <option value="technology">💻 Technology & Programming</option>
                    <option value="business">💼 Business & Entrepreneurship</option>
                    <option value="design">🎨 Arts & Creative</option>
                    <option value="marketing">📈 Marketing & Sales</option>
                    <option value="lifestyle">🌟 Life Skills & Personal Development</option>
                    <option value="health">🏥 Health & Wellness</option>
                    <option value="education">🌍 Language Learning & Education</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    className="custom-dropdown w-full rounded-lg px-3 py-2"
                  >
                    <option value="en">English</option>
                    <option value="fr">French</option>
                    <option value="es">Spanish</option>
                    <option value="de">German</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    className="custom-dropdown w-full rounded-lg px-3 py-2"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleInputChange}
                    className="custom-dropdown w-full rounded-lg px-3 py-2"
                  >
                    <option value="basic">Basic</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Pricing & Access */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Pricing & Access</h3>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isFree"
                  checked={formData.isFree}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-700">Free Course</label>
              </div>

              {!formData.isFree && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleInputChange}
                      className="custom-dropdown w-full rounded-lg px-3 py-2"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="CAD">CAD</option>
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment Limit</label>
                <input
                  type="number"
                  name="enrollmentLimit"
                  value={formData.enrollmentLimit}
                  onChange={handleInputChange}
                  min="0"
                  placeholder="Leave empty for unlimited"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="firstLessonFree"
                    checked={formData.firstLessonFree}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label className="text-sm font-medium text-gray-700">First lesson free</label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="providesCertificate"
                    checked={formData.providesCertificate}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label className="text-sm font-medium text-gray-700">Provide certificate upon completion</label>
                </div>
              </div>
            </div>
          </div>

            {/* Category-Specific Interactive Features */}
            <div className="mt-8 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Interactive Features - {formData.category.charAt(0).toUpperCase() + formData.category.slice(1)}
              </h3>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-4">
                  Choose interactive features specific to your course category. These will be implemented in future updates.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getCategoryFeatures(formData.category).map((feature) => (
                    <div key={feature.id} className="flex items-start space-x-3 p-3 bg-white rounded-lg border">
                      <input
                        type="checkbox"
                        name={feature.id}
                        checked={formData[feature.id] || false}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <label className="text-sm font-medium text-gray-900 cursor-pointer">
                          {feature.label}
                        </label>
                        <p className="text-xs text-gray-500 mt-1">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* General Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">General Features</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="enableMarketing"
                        checked={formData.enableMarketing}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <label className="text-sm text-gray-700">Enable marketing features</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="enableMaikoCampaign"
                        checked={formData.enableMaikoCampaign}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <label className="text-sm text-gray-700">Enable Maiko campaign</label>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Course Status</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="providesCertificate"
                        checked={formData.providesCertificate}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <label className="text-sm text-gray-700">Provide certificate upon completion</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="firstLessonFree"
                        checked={formData.firstLessonFree}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <label className="text-sm text-gray-700">First lesson free preview</label>
                    </div>
                  </div>
                </div>
              </div>

            {/* Target Audience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
              <textarea
                name="targetAudience"
                value={formData.targetAudience}
                onChange={handleInputChange}
                rows={2}
                placeholder="Describe who this course is for..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Prerequisites */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prerequisites (comma-separated)</label>
              <input
                type="text"
                value={formData.prerequisites.join(', ')}
                onChange={(e) => handleArrayInputChange('prerequisites', e.target.value)}
                placeholder="e.g., Basic HTML knowledge, JavaScript fundamentals"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Learning Outcomes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Learning Outcomes (comma-separated)</label>
              <input
                type="text"
                value={formData.learningOutcomes.join(', ')}
                onChange={(e) => handleArrayInputChange('learningOutcomes', e.target.value)}
                placeholder="e.g., Build responsive websites, Master React hooks, Deploy applications"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Keywords */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Keywords (comma-separated)</label>
              <input
                type="text"
                value={formData.keywords.join(', ')}
                onChange={(e) => handleArrayInputChange('keywords', e.target.value)}
                placeholder="e.g., react, javascript, web development, frontend"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t">
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={handlePublishCourse}
                disabled={publishing || course.isPublished}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {publishing ? 'Publishing...' : course.isPublished ? 'Already Published' : 'Publish Course'}
              </button>
            </div>
            
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseEditModal;
