const express = require('express');
const { body, validationResult } = require('express-validator');
const { Op } = require('sequelize');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { sequelize, models } = require('../config/database');
const Course = models.Course;
const User = models.User;
const Organization = models.Organization;
const auth = require('../middleware/auth');
const PredefinedCourseService = require('../services/predefinedCourseService');
const ForumService = require('../services/forumService');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/course-thumbnails');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'thumbnail-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// @route   GET /api/courses
// @desc    Get all published courses
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Simple test - just return all courses without complex queries
    const courses = await Course.findAll();
    
    res.json({
      courses: courses || [],
      totalPages: 1,
      currentPage: 1,
      total: courses ? courses.length : 0
    });
  } catch (err) {
    console.error('Courses route error:', err.message);
    console.error('Full error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   POST /api/courses
// @desc    Create a new course
// @access  Private (Instructor)
router.post('/', auth, upload.single('thumbnail'), [
  body('title').notEmpty().withMessage('Course title is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('shortDescription').notEmpty().withMessage('Short description is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('difficulty').isIn(['beginner', 'intermediate', 'advanced']).withMessage('Invalid difficulty level')
], async (req, res) => {
  try {
    // Check if user is instructor
    if (req.user.role !== 'instructor' && req.user.role !== 'organization_admin') {
      return res.status(403).json({ message: 'Access denied. Only instructors can create courses.' });
    }

    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const {
      title,
      category,
      shortDescription,
      fullDescription,
      difficulty,
      language,
      price,
      duration,
      enableLiveSessions,
      enableInteractiveContent,
      enableMarketing,
      enableMaikoCampaign,
      instructorShare,
      maikoCommission
    } = req.body;

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');

    // Get user's organization ID (default to 1 if not set)
    const organizationId = req.user.organizationId || 1;

    // Handle uploaded thumbnail
    let thumbnailUrl = null;
    if (req.file) {
      thumbnailUrl = `/uploads/course-thumbnails/${req.file.filename}`;
    }

    // Validate price range (updated to allow higher prices)
    if (price < 0 || price > 1000) {
      return res.status(400).json({ 
        message: 'Price must be between $0 and $1000' 
      });
    }

    // Validate category
    const validCategories = ['business', 'technology', 'arts', 'language', 'health', 'lifeskills'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ 
        message: 'Invalid category. Must be one of: ' + validCategories.join(', ') 
      });
    }

    // Create course
    const courseData = {
      title,
      category,
      shortDescription,
      description: fullDescription || shortDescription, // Use fullDescription as description
      fullDescription: fullDescription || '',
      difficulty,
      language: language === 'english' ? 'en' : (language === 'french' ? 'fr' : 'en'),
      price: parseFloat(price),
      duration: duration || '',
      thumbnail: thumbnailUrl,
      slug,
      organizationId,
      instructorId: req.user.id,
      status: 'published', // Instructors can publish directly
      enableLiveSessions: enableLiveSessions === 'true' || enableLiveSessions === true,
      enableInteractiveContent: enableInteractiveContent === 'true' || enableInteractiveContent === true,
      enableMarketing: enableMarketing === 'true' || enableMarketing === true,
      enableMaikoCampaign: enableMaikoCampaign === 'true' || enableMaikoCampaign === true,
      instructorShare: parseFloat(instructorShare) || (price * 0.4),
      maikoCommission: parseFloat(maikoCommission) || 0,
      firstLessonFree: true, // First lesson is always free
      enrolledStudents: 0,
      earnings: 0,
      rating: 0,
      lessonsCount: 0
    };

    const newCourse = await Course.create(courseData);

    // Create automatic forum for the course
    try {
      await ForumService.createCourseForums(newCourse.id, newCourse.instructorId);
      console.log(`✅ Created forum for course: ${newCourse.title}`);
    } catch (forumError) {
      console.error('Warning: Failed to create course forum:', forumError.message);
      // Don't fail course creation if forum creation fails
    }

    // Generate marketing coupon
    const couponCode = `COURSE${newCourse.id}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    res.status(201).json({
      message: 'Course created successfully',
      course: newCourse,
      couponCode,
      commission: {
        instructorShare: newCourse.instructorShare,
        maikoCommission: newCourse.maikoCommission,
        finalInstructorShare: newCourse.instructorShare - newCourse.maikoCommission
      }
    });

  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// @route   GET /api/courses/instructor
// @desc    Get courses by instructor
// @access  Private (Instructor)
router.get('/instructor', auth, async (req, res) => {
  try {
    if (req.user.role !== 'instructor' && req.user.role !== 'organization_admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const courses = await Course.findAll({
      where: { instructorId: req.user.id },
      include: [
        { model: User, as: 'instructor', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: Organization, as: 'organization', attributes: ['id', 'name'] }
      ]
    });

    res.json({ courses });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/courses/:id
// @desc    Get course by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      include: [
        { model: Organization, as: 'organization', attributes: ['name', 'displayName', 'logo'] },
        { model: User, as: 'instructor', attributes: ['firstName', 'lastName'] }
      ]
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Get student statistics
    const CourseEnrollment = models.CourseEnrollment;
    
    const totalStudents = await CourseEnrollment.count({
      where: { courseId: req.params.id }
    });
    
    const currentStudents = await CourseEnrollment.count({
      where: { 
        courseId: req.params.id,
        isActive: true,
        progress: { [Op.lt]: 100 }
      }
    });
    
    const completedStudents = await CourseEnrollment.count({
      where: { 
        courseId: req.params.id,
        progress: 100
      }
    });

    // Increment view count
    course.views += 1;
    await course.save();

    // Add student statistics to course data
    const courseData = course.toJSON();
    courseData.totalStudents = totalStudents;
    courseData.currentStudents = currentStudents;
    courseData.completedStudents = completedStudents;

    res.json(courseData);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});


// @route   PUT /api/courses/:id
// @desc    Update course
// @access  Private (Course owner)
router.put('/:id', [
  auth,
  body('title').optional().trim(),
  body('description').optional().trim(),
  body('category').optional().trim(),
  body('price').optional().isNumeric()
], async (req, res) => {
  try {
    console.log('🔍 UPDATE COURSE DEBUG:');
    console.log('  Course ID:', req.params.id);
    console.log('  User ID:', req.user.id);
    console.log('  User Role:', req.user.role);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const course = await Course.findByPk(req.params.id);
    if (!course) {
      console.log('  ❌ Course not found');
      return res.status(404).json({ message: 'Course not found' });
    }

    console.log('  Course Instructor ID:', course.instructorId);
    console.log('  Course Instructor ID Type:', typeof course.instructorId);
    console.log('  User ID Type:', typeof req.user.id);
    console.log('  IDs Match:', course.instructorId.toString() === req.user.id.toString());

    // Check ownership
    if (course.instructorId.toString() !== req.user.id.toString() && 
        req.user.role !== 'admin') {
      console.log('  ❌ Access denied - ownership check failed');
      return res.status(403).json({ message: 'Access denied' });
    }

    console.log('  ✅ Access granted - updating course');

    // Update course with all provided fields
    const updateData = { ...req.body };
    
    // Convert data types
    if (updateData.price !== undefined) {
      updateData.price = parseFloat(updateData.price);
    }
    if (updateData.enrollmentLimit !== undefined) {
      updateData.enrollmentLimit = updateData.enrollmentLimit === '' ? null : parseInt(updateData.enrollmentLimit);
    }
    if (updateData.isFree !== undefined) {
      updateData.isFree = updateData.isFree === 'true' || updateData.isFree === true;
    }
    if (updateData.providesCertificate !== undefined) {
      updateData.providesCertificate = updateData.providesCertificate === 'true' || updateData.providesCertificate === true;
    }
    if (updateData.firstLessonFree !== undefined) {
      updateData.firstLessonFree = updateData.firstLessonFree === 'true' || updateData.firstLessonFree === true;
    }
    if (updateData.enableLiveSessions !== undefined) {
      updateData.enableLiveSessions = updateData.enableLiveSessions === 'true' || updateData.enableLiveSessions === true;
    }
    if (updateData.enableInteractiveContent !== undefined) {
      updateData.enableInteractiveContent = updateData.enableInteractiveContent === 'true' || updateData.enableInteractiveContent === true;
    }
    if (updateData.enableMarketing !== undefined) {
      updateData.enableMarketing = updateData.enableMarketing === 'true' || updateData.enableMarketing === true;
    }
    if (updateData.enableMaikoCampaign !== undefined) {
      updateData.enableMaikoCampaign = updateData.enableMaikoCampaign === 'true' || updateData.enableMaikoCampaign === true;
    }
    if (updateData.hasLabContent !== undefined) {
      updateData.hasLabContent = updateData.hasLabContent === 'true' || updateData.hasLabContent === true;
    }
    
    // Handle array fields
    if (updateData.prerequisites && typeof updateData.prerequisites === 'string') {
      updateData.prerequisites = updateData.prerequisites.split(',').map(item => item.trim()).filter(item => item);
    }
    if (updateData.learningOutcomes && typeof updateData.learningOutcomes === 'string') {
      updateData.learningOutcomes = updateData.learningOutcomes.split(',').map(item => item.trim()).filter(item => item);
    }
    if (updateData.keywords && typeof updateData.keywords === 'string') {
      updateData.keywords = updateData.keywords.split(',').map(item => item.trim()).filter(item => item);
    }
    if (updateData.tags && typeof updateData.tags === 'string') {
      updateData.tags = updateData.tags.split(',').map(item => item.trim()).filter(item => item);
    }

    // Update slug if title changed
    if (updateData.title && updateData.title !== course.title) {
      updateData.slug = updateData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
    }

    const updatedCourse = await course.update(updateData);

    console.log('  ✅ Course updated successfully');
    res.json(updatedCourse);
  } catch (err) {
    console.error('❌ Update course error:', err.message);
    console.error('❌ Full error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   POST /api/courses/:id/publish
// @desc    Publish course
// @access  Private (Course owner)
router.post('/:id/publish', auth, async (req, res) => {
  try {
    console.log('🔍 PUBLISH COURSE DEBUG:');
    console.log('  Course ID:', req.params.id);
    console.log('  User ID:', req.user.id);
    console.log('  User Role:', req.user.role);
    
    const course = await Course.findByPk(req.params.id);
    if (!course) {
      console.log('  ❌ Course not found');
      return res.status(404).json({ message: 'Course not found' });
    }

    console.log('  Course Instructor ID:', course.instructorId);
    console.log('  Course Instructor ID Type:', typeof course.instructorId);
    console.log('  User ID Type:', typeof req.user.id);
    console.log('  IDs Match:', course.instructorId.toString() === req.user.id.toString());

    // Check ownership
    if (course.instructorId.toString() !== req.user.id.toString() && 
        req.user.role !== 'admin') {
      console.log('  ❌ Access denied - ownership check failed');
      return res.status(403).json({ message: 'Access denied' });
    }

    console.log('  ✅ Access granted - updating course');

    // Update course to published
    const updatedCourse = await course.update({
      isPublished: true,
      status: 'published',
      publishedAt: new Date()
    });

    console.log('  ✅ Course published successfully');

    res.json({
      message: 'Course published successfully',
      course: updatedCourse
    });
  } catch (err) {
    console.error('❌ Publish course error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/courses/:id/enroll
// @desc    Enroll in a course
// @access  Private (Student)
router.post('/:id/enroll', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can enroll in courses' });
    }

    const course = await Course.findByPk(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (!course.isPublished) {
      return res.status(400).json({ message: 'Course is not available for enrollment' });
    }

    const user = await User.findByPk(req.user.id);
    const isEnrolled = user.enrolledCourses.some(
      enrollment => enrollment.courseId.toString() === req.params.id
    );

    if (isEnrolled) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Add course to user's enrolled courses
    user.enrolledCourses.push({
      courseId: req.params.id,
      enrolledAt: new Date()
    });

    await user.save();

    // Increment course enrollment count
    course.currentEnrollments += 1;
    await course.save();

    res.json({ message: 'Successfully enrolled in course' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/courses/:id/progress
// @desc    Get course progress for user
// @access  Private (Enrolled student)
router.get('/:id/progress', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const enrollment = user.enrolledCourses.find(
      e => e.courseId.toString() === req.params.id
    );

    if (!enrollment) {
      return res.status(404).json({ message: 'Not enrolled in this course' });
    }

    res.json({
      progress: enrollment.progress,
      completedLessons: enrollment.completedLessons,
      lastAccessed: enrollment.lastAccessed
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/courses/:id/progress
// @desc    Update course progress
// @access  Private (Enrolled student)
router.put('/:id/progress', auth, async (req, res) => {
  try {
    const { lessonId, completed } = req.body;

    const user = await User.findById(req.user.id);
    const enrollment = user.enrolledCourses.find(
      e => e.courseId.toString() === req.params.id
    );

    if (!enrollment) {
      return res.status(404).json({ message: 'Not enrolled in this course' });
    }

    if (completed && !enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
    }

    // Calculate progress based on completed lessons
    const course = await Course.findByPk(req.params.id);
    const totalLessons = course.totalLessons;
    enrollment.progress = Math.round((enrollment.completedLessons.length / totalLessons) * 100);
    enrollment.lastAccessed = new Date();

    await user.save();

    res.json({ 
      progress: enrollment.progress,
      completedLessons: enrollment.completedLessons 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/courses/:id
// @desc    Delete course
// @access  Private (Course owner)
router.delete('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check ownership
    if (course.instructorId.toString() !== req.user.id && 
        req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    await course.destroy();
    res.json({ message: 'Course removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/courses/predefined/categories
// @desc    Get all predefined course categories
// @access  Public
router.get('/predefined/categories', (req, res) => {
  try {
    const categories = PredefinedCourseService.getCategories();
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/courses/predefined/subcategories/:categoryKey
// @desc    Get subcategories for a specific category
// @access  Public
router.get('/predefined/subcategories/:categoryKey', (req, res) => {
  try {
    const { categoryKey } = req.params;
    const subcategories = PredefinedCourseService.getSubcategories(categoryKey);
    res.json(subcategories);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/courses/predefined/:categoryKey
// @desc    Get predefined courses for a category
// @access  Public
router.get('/predefined/:categoryKey', (req, res) => {
  try {
    const { categoryKey } = req.params;
    const { subcategory } = req.query;
    
    const courses = PredefinedCourseService.getPredefinedCourses(categoryKey, subcategory);
    res.json(courses);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/courses/predefined/:categoryKey/formatted
// @desc    Get formatted predefined courses for frontend display
// @access  Public
router.get('/predefined/:categoryKey/formatted', (req, res) => {
  try {
    const { categoryKey } = req.params;
    const courses = PredefinedCourseService.getFormattedCourses(categoryKey);
    res.json(courses);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/courses/:id/students
// @desc    Get course student statistics and lists
// @access  Private (Instructor/Admin)
router.get('/:id/students', auth, async (req, res) => {
  try {
    const courseId = req.params.id;
    
    // Check if user is instructor or admin
    if (req.user.role !== 'instructor' && req.user.role !== 'admin' && req.user.role !== 'organization_admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get course to verify ownership (for instructors)
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if instructor owns this course
    if (req.user.role === 'instructor' && course.instructorId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Use models from database config
    const CourseEnrollment = models.CourseEnrollment;
    const User = models.User;

    // Get all enrollments for this course
    const enrollments = await CourseEnrollment.findAll({
      where: { courseId },
      include: [
        {
          model: User,
          as: 'student',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ],
      order: [['enrolledAt', 'DESC']]
    });

    // Calculate statistics
    const totalStudents = enrollments.length;
    const currentStudents = enrollments.filter(e => e.isActive && e.progress < 100).length;
    const completedStudents = enrollments.filter(e => e.progress === 100).length;

    // Get student lists
    const totalStudentsList = enrollments.map(e => ({
      id: e.student.id,
      name: `${e.student.firstName} ${e.student.lastName}`,
      email: e.student.email,
      enrolledAt: e.enrolledAt,
      progress: e.progress,
      lastAccessedAt: e.lastAccessedAt
    }));

    const currentStudentsList = enrollments
      .filter(e => e.isActive && e.progress < 100)
      .map(e => ({
        id: e.student.id,
        name: `${e.student.firstName} ${e.student.lastName}`,
        email: e.student.email,
        enrolledAt: e.enrolledAt,
        progress: e.progress,
        lastAccessedAt: e.lastAccessedAt
      }));

    const completedStudentsList = enrollments
      .filter(e => e.progress === 100)
      .map(e => ({
        id: e.student.id,
        name: `${e.student.firstName} ${e.student.lastName}`,
        email: e.student.email,
        enrolledAt: e.enrolledAt,
        completedAt: e.completedAt,
        progress: e.progress
      }));

    res.json({
      statistics: {
        totalStudents,
        currentStudents,
        completedStudents
      },
      students: {
        total: totalStudentsList,
        current: currentStudentsList,
        completed: completedStudentsList
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/courses/predefined/create
// @desc    Create a course from predefined template
// @access  Private (Instructor/Org Admin)
router.post('/predefined/create', [
  auth,
  body('categoryKey', 'Category key is required').notEmpty().trim(),
  body('title', 'Title is required').notEmpty().trim(),
  body('price', 'Price is required').isNumeric(),
  body('language', 'Language is required').isIn(['en', 'fr'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { categoryKey, title, price, language } = req.body;

    // Check if user can create courses
    if (req.user.role !== 'instructor' && req.user.role !== 'organization_admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Validate predefined course
    try {
      PredefinedCourseService.validateCourseCreation(categoryKey, title);
    } catch (validationError) {
      return res.status(400).json({ message: validationError.message });
    }

    // Get course template
    const courseTemplate = PredefinedCourseService.getCourseTemplate(categoryKey, title);

    // Create the course
    const course = await Course.create({
      ...courseTemplate,
      price,
      language,
      organizationId: req.user.organizationId || 1,
      instructorId: req.user.id,
      status: 'published',
      isActive: true
    });

    res.json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
