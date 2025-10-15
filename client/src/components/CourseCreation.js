import React, { useState } from 'react';
// import { useLanguage } from '../context/LanguageContext'; // Commented out as not currently used

const CourseCreation = ({ onCourseCreated, onCancel }) => {
  // const { t } = useLanguage(); // Commented out as not currently used
  
  // Form state
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Section 1 - Basic Course Info
    title: '',
    category: '',
    shortDescription: '',
    fullDescription: '',
    
    // Section 2 - Course Details
    thumbnail: null,
    difficulty: 'beginner',
    language: 'english',
    price: 5,
    duration: '',
    
    // Section 3 - Initial Content Setup
    numberOfLessons: 10, // Default to 10 lessons
    lessonTitles: [],
    enableLiveSessions: false,
    enableInteractiveContent: false,
    
    // Marketing & Commission
    enableMarketing: false,
    enableMaikoCampaign: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  
  // Language options - must be declared before use
  const languages = [
    { value: 'english', label: '🇺🇸 English (Auto-correct: ON)', code: 'en' },
    { value: 'french', label: '🇫🇷 Français (Correction automatique: ON)', code: 'fr' },
    { value: 'spanish', label: '🇪🇸 Español (Corrección automática: ON)', code: 'es' },
    { value: 'portuguese', label: '🇵🇹 Português (Correção automática: ON)', code: 'pt' }
  ];

  // Get current language code for spell check
  const currentLanguage = languages.find(lang => lang.value === formData.language)?.code || 'en';

  // Fixed categories with icons
  const categories = [
    { value: 'business', label: '💼 Business & Entrepreneurship', icon: '💼' },
    { value: 'technology', label: '💻 Technology & Programming', icon: '💻' },
    { value: 'arts', label: '🎨 Arts & Creative', icon: '🎨' },
    { value: 'language', label: '🌍 Language Learning', icon: '🌍' },
    { value: 'health', label: '🏥 Health & Wellness', icon: '🏥' },
    { value: 'lifeskills', label: '🌟 Life Skills & Personal Development', icon: '🌟' }
  ];

  const difficulties = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  // Validation
  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.title.trim()) newErrors.title = 'Course title is required';
      if (formData.title.length > 100) newErrors.title = 'Title must be 100 characters or less';
      if (!formData.category) newErrors.category = 'Category is required';
      if (!formData.shortDescription.trim()) newErrors.shortDescription = 'Short description is required';
      if (formData.shortDescription.length > 250) newErrors.shortDescription = 'Description must be 250 characters or less';
    }
    
    if (step === 2) {
      if (!formData.thumbnail) newErrors.thumbnail = 'Course thumbnail is required';
      if (formData.price < 5 || formData.price > 15) newErrors.price = 'Price must be between $5 and $15';
      if (!formData.duration || formData.duration < 1) newErrors.duration = 'Duration must be at least 1 hour';
      if (formData.duration > 200) newErrors.duration = 'Duration cannot exceed 200 hours';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          thumbnail: 'Please select an image file (JPG, PNG)'
        }));
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          thumbnail: 'File size must be less than 10MB'
        }));
        return;
      }
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      // Update form data
      handleInputChange('thumbnail', file);
      
      // Clear any previous errors
      setErrors(prev => ({
        ...prev,
        thumbnail: ''
      }));
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(2)) return;
    
    setIsSubmitting(true);
    try {
      // Calculate instructor share (40%)
      const instructorShare = formData.price * 0.4;
      
      // Calculate Maiko commission if campaign enabled (5% of instructor's 40%)
      const maikoCommission = formData.enableMaikoCampaign ? instructorShare * 0.05 : 0;
      const finalInstructorShare = instructorShare - maikoCommission;
      
      // Prepare form data for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('shortDescription', formData.shortDescription);
      formDataToSend.append('fullDescription', formData.fullDescription || '');
      formDataToSend.append('difficulty', formData.difficulty);
      formDataToSend.append('language', formData.language);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('duration', formData.duration || '');
      formDataToSend.append('numberOfLessons', formData.numberOfLessons);
      formDataToSend.append('enableLiveSessions', formData.enableLiveSessions);
      formDataToSend.append('enableInteractiveContent', formData.enableInteractiveContent);
      formDataToSend.append('enableMarketing', formData.enableMarketing);
      formDataToSend.append('enableMaikoCampaign', formData.enableMaikoCampaign);
      formDataToSend.append('instructorShare', finalInstructorShare);
      formDataToSend.append('maikoCommission', maikoCommission);
      formDataToSend.append('status', 'draft');
      formDataToSend.append('firstLessonFree', true);
      
      // Add thumbnail file if selected
      if (formData.thumbnail) {
        formDataToSend.append('thumbnail', formData.thumbnail);
      }
      
      const response = await fetch('http://localhost:5001/api/courses', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataToSend
      });
      
      if (response.ok) {
        const newCourse = await response.json();
        
        // Generate marketing coupon
        const couponCode = `COURSE${newCourse.id}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        
        // Show success message with coupon
        alert(`🎉 Course created successfully!\n\n📚 Course Structure:\n• Base: ${formData.numberOfLessons} lessons for $${formData.price}\n• Additional: Every 10 extra lessons = +$${formData.price}\n• Duration: ${formData.duration} hours\n• First lesson: FREE for students\n\n💰 Your Commission: $${finalInstructorShare.toFixed(2)} per enrollment (40%)\n${formData.enableMaikoCampaign ? `• Maiko Commission: $${maikoCommission.toFixed(2)} per enrollment (5%)\n` : ''}🎫 Marketing Coupon: ${couponCode}\n\n✅ Ready to start teaching!`);
        
        onCourseCreated(newCourse);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create course');
      }
    } catch (error) {
      console.error('Error creating course:', error);
      alert(`Error creating course: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Basic Course Information</h2>
      
      {/* Course Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Course Title *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 text-gray-900 placeholder-gray-500 ${
            errors.title ? 'border-red-500' : 'border-gray-400'
          }`}
          placeholder="Enter your course title (max 100 characters)"
          maxLength={100}
          spellCheck="true"
          autoCorrect="on"
          autoComplete="on"
          lang={currentLanguage}
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        <p className="text-gray-500 text-sm mt-1">{formData.title.length}/100 characters</p>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category *
        </label>
        <select
          value={formData.category}
          onChange={(e) => handleInputChange('category', e.target.value)}
          className={`custom-dropdown w-full px-3 py-2 rounded-md shadow-sm ${
            errors.category ? 'border-red-500' : ''
          }`}
        >
          <option value="">Select a category</option>
          {categories.map(category => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
      </div>

      {/* Short Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Short Description *
        </label>
        <textarea
          value={formData.shortDescription}
          onChange={(e) => handleInputChange('shortDescription', e.target.value)}
          rows={3}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 text-gray-900 placeholder-gray-500 ${
            errors.shortDescription ? 'border-red-500' : 'border-gray-400'
          }`}
          placeholder="1-2 sentences describing your course (max 250 characters)"
          maxLength={250}
          spellCheck="true"
          autoCorrect="on"
          autoComplete="on"
          lang={currentLanguage}
        />
        {errors.shortDescription && <p className="text-red-500 text-sm mt-1">{errors.shortDescription}</p>}
        <p className="text-gray-500 text-sm mt-1">{formData.shortDescription.length}/250 characters</p>
      </div>

      {/* Full Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Description (Optional)
        </label>
        <textarea
          value={formData.fullDescription}
          onChange={(e) => handleInputChange('fullDescription', e.target.value)}
          rows={6}
          className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 text-gray-900 placeholder-gray-500"
          placeholder="Detailed course overview, what students will learn, prerequisites, etc."
          spellCheck="true"
          autoCorrect="on"
          autoComplete="on"
          lang={currentLanguage}
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Course Details</h2>
      
      {/* Course Thumbnail */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Course Thumbnail *
        </label>
        
        {thumbnailPreview ? (
          <div className="mt-1">
            <div className="relative">
              <img
                src={thumbnailPreview}
                alt="Course thumbnail preview"
                className="w-full h-48 object-cover rounded-md border border-gray-400"
              />
              <button
                type="button"
                onClick={() => {
                  setThumbnailPreview(null);
                  handleInputChange('thumbnail', null);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-sm text-green-600 mt-2">✓ Thumbnail uploaded successfully</p>
          </div>
        ) : (
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-400 border-dashed rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="space-y-1 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                  <span>Click to upload</span>
                  <input
                    type="file"
                    className="sr-only"
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={handleFileUpload}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG up to 10MB (min 800x450px)</p>
            </div>
          </div>
        )}
        
        {errors.thumbnail && <p className="text-red-500 text-sm mt-1">{errors.thumbnail}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Difficulty Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Difficulty Level
          </label>
          <select
            value={formData.difficulty}
            onChange={(e) => handleInputChange('difficulty', e.target.value)}
            className="custom-dropdown w-full px-3 py-2 rounded-md shadow-sm"
          >
            {difficulties.map(difficulty => (
              <option key={difficulty.value} value={difficulty.value}>
                {difficulty.label}
              </option>
            ))}
          </select>
        </div>

        {/* Language */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language of Instruction
          </label>
          <select
            value={formData.language}
            onChange={(e) => handleInputChange('language', e.target.value)}
            className="custom-dropdown w-full px-3 py-2 rounded-md shadow-sm"
          >
            {languages.map(language => (
              <option key={language.value} value={language.value}>
                {language.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Price * ($5 - $15 for 10 lessons)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              min="5"
              max="15"
              value={formData.price}
              onChange={(e) => handleInputChange('price', parseInt(e.target.value))}
              className={`w-full pl-7 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 text-gray-900 ${
                errors.price ? 'border-red-500' : 'border-gray-400'
              }`}
            />
          </div>
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          
          {/* Pricing Information */}
          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">📚 Course Structure & Pricing</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• <strong>Base Course:</strong> {formData.price || 0} lessons for ${formData.price || 0}</p>
              <p>• <strong>Additional Lessons:</strong> Every 10 extra lessons = +${formData.price || 0}</p>
              <p>• <strong>Your Commission:</strong> ${(formData.price * 0.4).toFixed(2)} per enrollment (40%)</p>
              <p>• <strong>First Lesson:</strong> Always FREE for students</p>
            </div>
          </div>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estimated Duration (Hours Only) *
          </label>
          <div className="relative">
            <input
              type="number"
              min="1"
              max="200"
              step="0.5"
              value={formData.duration}
              onChange={(e) => handleInputChange('duration', parseFloat(e.target.value) || '')}
              className="w-full px-3 py-2 pr-12 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 text-gray-900 placeholder-gray-500"
              placeholder="e.g., 15.5"
              spellCheck="false"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">hours</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            💡 Professional tip: 1 hour = 60 minutes of content
          </p>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Initial Content Setup</h2>
      
      {/* Number of Lessons */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Initial Lessons (Base: 10 lessons included)
        </label>
        <div className="relative">
          <input
            type="number"
            min="10"
            max="50"
            value={formData.numberOfLessons || 10}
            onChange={(e) => handleInputChange('numberOfLessons', parseInt(e.target.value) || 10)}
            className="w-full px-3 py-2 pr-16 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 text-gray-900"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">lessons</span>
          </div>
        </div>
        <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="text-sm text-green-800">
            <p className="font-medium mb-1">💡 Professional Course Structure:</p>
            <ul className="space-y-1">
              <li>• <strong>Base Package:</strong> 10 lessons for ${formData.price || 0}</li>
              <li>• <strong>Additional Lessons:</strong> Every 10 extra = +${formData.price || 0}</li>
              <li>• <strong>Student Benefits:</strong> First lesson always FREE</li>
              <li>• <strong>Flexibility:</strong> Add more lessons anytime in course editor</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Live Session Setup */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Live Session Setup</h3>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="enableLiveSessions"
            checked={formData.enableLiveSessions}
            onChange={(e) => handleInputChange('enableLiveSessions', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="enableLiveSessions" className="ml-2 block text-sm text-gray-900">
            Enable Jitsi live sessions for this course
          </label>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Only the instructor can initiate live meetings. Students can join when invited.
        </p>
      </div>

      {/* Interactive Content */}
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Interactive Learning</h3>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="enableInteractiveContent"
            checked={formData.enableInteractiveContent}
            onChange={(e) => handleInputChange('enableInteractiveContent', e.target.checked)}
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
          <label htmlFor="enableInteractiveContent" className="ml-2 block text-sm text-gray-900">
            Add interactive learning activities
          </label>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Create quizzes, interactive videos, presentations, and hands-on exercises
        </p>
      </div>

      {/* Marketing Options */}
      <div className="bg-yellow-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Marketing & Commission</h3>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="enableMarketing"
              checked={formData.enableMarketing}
              onChange={(e) => handleInputChange('enableMarketing', e.target.checked)}
              className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
            />
            <label htmlFor="enableMarketing" className="ml-2 block text-sm text-gray-900">
              Enable marketing coupon (20% commission for affiliates)
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="enableMaikoCampaign"
              checked={formData.enableMaikoCampaign}
              onChange={(e) => handleInputChange('enableMaikoCampaign', e.target.checked)}
              className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
            />
            <label htmlFor="enableMaikoCampaign" className="ml-2 block text-sm text-gray-900">
              Let MAIKO EDU run marketing campaigns (5% commission to Maiko)
            </label>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-white rounded border">
          <h4 className="font-medium text-gray-900 mb-2">Commission Breakdown:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Course Price: ${formData.price}</li>
            <li>• Your Base Commission: ${(formData.price * 0.4).toFixed(2)} (40%)</li>
            {formData.enableMaikoCampaign && (
              <li>• Maiko Commission: ${(formData.price * 0.4 * 0.05).toFixed(2)} (5% of your 40%)</li>
            )}
            <li>• Your Final Commission: ${(formData.price * 0.4 * (formData.enableMaikoCampaign ? 0.95 : 1)).toFixed(2)}</li>
            <li>• First Lesson: Always FREE for students</li>
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      {/* Progress Bar */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-900">Create New Course</h1>
          <span className="text-sm text-gray-500">Step {currentStep} of 3</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Form Content */}
      <div className="px-6 py-8">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </div>

      {/* Navigation Buttons */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
        <button
          onClick={currentStep === 1 ? onCancel : handlePrevious}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {currentStep === 1 ? 'Cancel' : 'Previous'}
        </button>
        
        <div className="flex space-x-3">
          {currentStep < 3 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Course'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCreation;
