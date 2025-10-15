import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';
import CoursePaymentModal from '../components/CoursePaymentModal';

const Courses = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  
  // State management
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [enrolling, setEnrolling] = useState({});
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [enrollmentStatus, setEnrollmentStatus] = useState({});

  // Categories
  const categories = [
    { id: 'all', name: String(t('courses.categories.all') || 'All Categories'), icon: '📚' },
    { id: 'business', name: String(t('courses.categories.business') || 'Business'), icon: '💼' },
    { id: 'technology', name: String(t('courses.categories.technology') || 'Technology'), icon: '💻' },
    { id: 'arts', name: String(t('courses.categories.arts') || 'Arts'), icon: '🎨' },
    { id: 'language', name: String(t('courses.categories.language') || 'Language'), icon: '🗣️' },
    { id: 'health', name: String(t('courses.categories.health') || 'Health'), icon: '🏥' },
    { id: 'lifeskills', name: String(t('courses.categories.lifeskills') || 'Life Skills'), icon: '🌟' }
  ];

  const difficulties = [
    { id: 'all', name: String(t('courses.difficulties.all') || 'All Levels') },
    { id: 'beginner', name: String(t('courses.difficulties.beginner') || 'Beginner') },
    { id: 'intermediate', name: String(t('courses.difficulties.intermediate') || 'Intermediate') },
    { id: 'advanced', name: String(t('courses.difficulties.advanced') || 'Advanced') }
  ];

  const sortOptions = [
    { id: 'newest', name: String(t('courses.sortOptions.newest') || 'Newest First') },
    { id: 'oldest', name: String(t('courses.sortOptions.oldest') || 'Oldest First') },
    { id: 'price-low', name: String(t('courses.sortOptions.priceLow') || 'Price: Low to High') },
    { id: 'price-high', name: String(t('courses.sortOptions.priceHigh') || 'Price: High to Low') },
    { id: 'title', name: String(t('courses.sortOptions.title') || 'Title A-Z') },
    { id: 'rating', name: String(t('courses.sortOptions.rating') || 'Highest Rated') }
  ];

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  // Filter and sort courses when filters change
  useEffect(() => {
    filterAndSortCourses();
  }, [courses, searchTerm, selectedCategory, selectedDifficulty, sortBy]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/courses', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCourses(data.courses || []);
      } else {
        console.error('Failed to fetch courses:', response.status);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortCourses = () => {
    let filtered = [...courses];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(course => course.difficulty === selectedDifficulty);
    }

    // Sort courses
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'price-low':
          return (a.price || 0) - (b.price || 0);
        case 'price-high':
          return (b.price || 0) - (a.price || 0);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'rating':
          return (b.averageRating || 0) - (a.averageRating || 0);
        default:
          return 0;
      }
    });

    setFilteredCourses(filtered);
  };

  const handleEnroll = async (course) => {
    if (!user) {
      alert('Please log in to enroll in courses');
      return;
    }

    try {
      setEnrolling(prev => ({ ...prev, [course.id]: true }));
      
      const response = await fetch('http://localhost:5001/api/enrollments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ courseId: course.id })
      });

      if (response.ok) {
        const result = await response.json();
        
        // Check if course is free or paid
        if (course.price === 0) {
          alert('Successfully enrolled in free course!');
        } else {
          // For paid courses, show payment modal
          setSelectedCourse(course);
          setShowPaymentModal(true);
        }
        
        // Update enrollment status
        setEnrollmentStatus(prev => ({
          ...prev,
          [course.id]: result.enrollment
        }));
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to enroll in course');
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      alert('Failed to enroll in course');
    } finally {
      setEnrolling(prev => ({ ...prev, [course.id]: false }));
    }
  };

  const handlePaymentSuccess = (result) => {
    alert('Payment successful! You now have full access to the course.');
    // Update enrollment status
    if (selectedCourse) {
      setEnrollmentStatus(prev => ({
        ...prev,
        [selectedCourse.id]: result.enrollment
      }));
    }
  };

  const getEnrollmentButton = (course) => {
    const enrollment = enrollmentStatus[course.id];
    
    if (enrolling[course.id]) {
      return (
        <button disabled className="bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed">
          {String(t('courses.enrolling') || 'Enrolling...')}
        </button>
      );
    }

    if (enrollment) {
      if (enrollment.paymentStatus === 'paid' || enrollment.developmentMode) {
        return (
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg">
            {enrollment.developmentMode 
              ? '🔓 Dev Mode - Enrolled' 
              : String(t('courses.enrolled') || 'Enrolled')
            }
          </button>
        );
      } else if (enrollment.paymentStatus === 'free') {
        return (
          <button 
            onClick={() => {
              setSelectedCourse(course);
              setShowPaymentModal(true);
            }}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
          >
            {String(t('courses.upgrade') || 'Upgrade to Full Access')}
          </button>
        );
      }
    }

    // Default enroll button - DEVELOPMENT MODE: Always allow enrollment
    return (
      <button
        onClick={() => handleEnroll(course)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        {course.price === 0 
          ? String(t('courses.enrollNow') || 'Enroll Now')
          : '🔓 Dev Mode - Enroll Free'
        }
      </button>
    );
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPrice = (price) => {
    return price === 0 ? String(t('courses.free') || 'Free') : `$${price}`;
  };

  if (loading) {
    return <Loading fullScreen size="xl" text="Loading courses..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {String(t('courses.title') || 'All Courses')}
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Discover our comprehensive collection of courses across all categories
          </p>
          
          {/* Development Mode Notice */}
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg max-w-2xl mx-auto">
            <div className="flex items-center justify-center">
              <span className="text-2xl mr-2">🔓</span>
              <div>
                <strong>Development Mode:</strong> Payment restrictions are temporarily disabled. 
                All courses and lessons are accessible for testing.
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {String(t('courses.search') || 'Search Courses')}
              </label>
              <input
                type="text"
                placeholder={String(t('courses.searchPlaceholder') || 'Search by title, description, or category...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {String(t('courses.category') || 'Category')}
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="custom-dropdown w-full px-4 py-2 rounded-lg"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {String(t('courses.difficulty') || 'Difficulty')}
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="custom-dropdown w-full px-4 py-2 rounded-lg"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty.id} value={difficulty.id}>
                    {difficulty.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sort Options */}
          <div className="mt-4 flex flex-wrap gap-4 items-center">
            <span className="text-sm font-medium text-gray-700">{String(t('courses.sortBy') || 'Sort by')}:</span>
            {sortOptions.map(option => (
              <button
                key={option.id}
                onClick={() => setSortBy(option.id)}
                className={`px-3 py-1 rounded-full text-sm ${
                  sortBy === option.id
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            {String(t('courses.showing') || 'Showing')} {filteredCourses.length} {String(t('courses.of') || 'of')} {courses.length} {String(t('courses.courses') || 'courses')}
            {searchTerm && ` ${String(t('courses.for') || 'for')} "${searchTerm}"`}
            {selectedCategory !== 'all' && ` ${String(t('courses.in') || 'in')} ${categories.find(c => c.id === selectedCategory)?.name}`}
          </p>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* Course Thumbnail */}
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-6xl text-gray-400">📚</div>
                  )}
                </div>

                {/* Course Content */}
                <div className="p-6">
                  {/* Category and Difficulty */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-blue-600 font-medium">
                      {categories.find(c => c.id === course.category)?.icon} {course.category?.charAt(0).toUpperCase() + course.category?.slice(1)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(course.difficulty)}`}>
                      {course.difficulty?.charAt(0).toUpperCase() + course.difficulty?.slice(1)}
                    </span>
                  </div>

                  {/* Course Title */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {course.title}
                  </h3>

                  {/* Course Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {course.shortDescription || course.description}
                  </p>

                  {/* Course Meta */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>👨‍🏫 {course.instructor?.firstName || String(t('courses.instructor') || 'Instructor')}</span>
                    <span>⏱️ {course.duration || 'N/A'} {String(t('courses.duration') || 'min')}</span>
                  </div>

                  {/* Price and Enroll Button */}
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">
                      {formatPrice(course.price)}
                    </span>
                    {getEnrollmentButton(course)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl text-gray-400 mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{String(t('courses.noCoursesFound') || 'No courses found')}</h3>
            <p className="text-gray-600 mb-4">
              {String(t('courses.tryAdjusting') || 'Try adjusting your search terms or filters')}
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedDifficulty('all');
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              {String(t('courses.clearFilters') || 'Clear Filters')}
            </button>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      <CoursePaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        course={selectedCourse}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default Courses;
