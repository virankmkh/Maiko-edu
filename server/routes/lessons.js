const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { sequelize, models } = require('../config/database');
const Lesson = models.Lesson;
const Course = models.Course;
const auth = require('../middleware/auth');
const LessonActivityService = require('../services/lessonActivityService');
const ForumService = require('../services/forumService');
const router = express.Router();

// Helper function to check if lesson can be edited
const canEditLesson = async (lessonId) => {
  try {
    const status = await LessonActivityService.isLessonBeingStudied(lessonId);
    return {
      canEdit: !status.isActive,
      reason: status.isActive ? 'Students are currently studying this lesson' : null,
      activeStudents: status.activeStudents
    };
  } catch (error) {
    console.error('Error checking lesson edit status:', error);
    return { canEdit: false, reason: 'Error checking lesson status' };
  }
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath;
    if (file.fieldname === 'video') {
      uploadPath = path.join(__dirname, '../uploads/lessons/videos');
    } else if (file.fieldname === 'audio') {
      uploadPath = path.join(__dirname, '../uploads/lessons/audio');
    } else if (file.fieldname === 'document') {
      uploadPath = path.join(__dirname, '../uploads/lessons/documents');
    } else {
      uploadPath = path.join(__dirname, '../uploads/lessons/other');
    }
    
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate encrypted filename for security
    const encryptedName = crypto.createHash('md5').update(file.originalname + Date.now()).digest('hex');
    const ext = path.extname(file.originalname);
    cb(null, encryptedName + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 500 * 1024 * 1024 // 500MB limit for videos
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'video') {
      if (file.mimetype.startsWith('video/')) {
        cb(null, true);
      } else {
        cb(new Error('Only video files are allowed for video uploads'), false);
      }
    } else if (file.fieldname === 'audio') {
      if (file.mimetype.startsWith('audio/')) {
        cb(null, true);
      } else {
        cb(new Error('Only audio files are allowed for audio uploads'), false);
      }
    } else if (file.fieldname === 'document') {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Only PDF, DOC, DOCX, PPT, PPTX files are allowed'), false);
      }
    } else {
      cb(null, true);
    }
  }
});

// @route   GET /api/lessons/course/:courseId
// @desc    Get all lessons for a course
// @access  Public
router.get('/course/:courseId', async (req, res) => {
  try {
    const lessons = await Lesson.findAll({
      where: { courseId: req.params.courseId },
      order: [['order', 'ASC']],
      include: [
        { model: Course, as: 'course', attributes: ['id', 'title'] }
      ]
    });

    res.json({ lessons });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/lessons/course/:courseId
// @desc    Create a new lesson for a specific course
// @access  Private (Instructor)
router.post('/course/:courseId', auth, upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'audio', maxCount: 1 },
  { name: 'document', maxCount: 1 }
]), async (req, res) => {
  try {
    const { courseId } = req.params;
    const {
      title,
      description,
      content,
      contentTypes,
      maxPoints,
      passingScore,
      countsTowardsFinal,
      weight,
      isFree,
      isPublished,
      quizData,
      assignmentData
    } = req.body;

    // Verify course exists and user has permission
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is instructor of the course or admin
    if (course.instructorId.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Handle file uploads
    let videoUrl = null;
    let audioUrl = null;
    let documentUrl = null;

    if (req.files) {
      if (req.files.video && req.files.video[0]) {
        videoUrl = `/uploads/lessons/videos/${req.files.video[0].filename}`;
      }
      if (req.files.audio && req.files.audio[0]) {
        audioUrl = `/uploads/lessons/audio/${req.files.audio[0].filename}`;
      }
      if (req.files.document && req.files.document[0]) {
        documentUrl = `/uploads/lessons/documents/${req.files.document[0].filename}`;
      }
    }

    // Parse JSON fields - handle both string and array formats
    let parsedContentTypes = [];
    if (contentTypes) {
      if (typeof contentTypes === 'string') {
        // Handle comma-separated string like "video,audio,text"
        parsedContentTypes = contentTypes.split(',').map(type => type.trim());
      } else if (Array.isArray(contentTypes)) {
        parsedContentTypes = contentTypes;
      } else {
        parsedContentTypes = JSON.parse(contentTypes);
      }
    }
    
    const parsedQuizData = quizData ? (typeof quizData === 'string' ? JSON.parse(quizData) : quizData) : null;
    const parsedAssignmentData = assignmentData ? (typeof assignmentData === 'string' ? JSON.parse(assignmentData) : assignmentData) : null;

    // Get next order number
    const lastLesson = await Lesson.findOne({
      where: { courseId },
      order: [['order', 'DESC']]
    });
    const nextOrder = lastLesson ? lastLesson.order + 1 : 1;

    const lesson = await Lesson.create({
      courseId,
      title,
      description,
      content,
      contentTypes: parsedContentTypes,
      videoUrl,
      audioUrl,
      documentUrl,
      maxPoints: maxPoints ? parseFloat(maxPoints) : null,
      passingScore: passingScore ? parseFloat(passingScore) : null,
      countsTowardsFinal: countsTowardsFinal === 'true' || countsTowardsFinal === true,
      weight: weight ? parseFloat(weight) : 1.0,
      isFree: isFree === 'true' || isFree === true,
      isPublished: isPublished === 'true' || isPublished === true,
      order: nextOrder,
      quizData: parsedQuizData,
      assignmentData: parsedAssignmentData
    });

    // Update course lessons count
    await course.increment('lessonsCount');

    // Create automatic forum for the lesson
    try {
      await ForumService.createLessonForum(lesson.id, courseId, course.instructorId);
      console.log(`✅ Created forum for lesson: ${lesson.title}`);
    } catch (forumError) {
      console.error('Warning: Failed to create lesson forum:', forumError.message);
      // Don't fail lesson creation if forum creation fails
    }

    res.status(201).json(lesson);
  } catch (error) {
    console.error('Error creating lesson:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/lessons
// @desc    Create a new lesson
// @access  Private (Instructor)
router.post('/', auth, upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'audio', maxCount: 1 },
  { name: 'document', maxCount: 1 }
]), async (req, res) => {
  try {
    // Check if user is instructor
    if (req.user.role !== 'instructor' && req.user.role !== 'organization_admin') {
      return res.status(403).json({ message: 'Access denied. Only instructors can create lessons.' });
    }

    const {
      courseId,
      title,
      description,
      content,
      contentTypes,
      maxPoints,
      passingScore,
      countsTowardsFinal,
      weight,
      isFree,
      isPublished,
      quizData,
      assignmentData
    } = req.body;

    // Validate required fields
    if (!courseId || !title) {
      return res.status(400).json({ message: 'Course ID and title are required' });
    }

    // Check if course exists and user owns it
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructorId.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. You can only create lessons for your own courses.' });
    }

    // Parse content types
    const parsedContentTypes = typeof contentTypes === 'string' ? JSON.parse(contentTypes) : contentTypes;

    // Get the next order number
    const lastLesson = await Lesson.findOne({
      where: { courseId },
      order: [['order', 'DESC']]
    });
    const nextOrder = lastLesson ? lastLesson.order + 1 : 1;

    // Prepare lesson data
    const lessonData = {
      courseId: parseInt(courseId),
      title,
      description: description || '',
      content: content || '',
      contentTypes: parsedContentTypes || [],
      order: nextOrder,
      isFree: isFree === 'true' || isFree === true,
      isPublished: isPublished === 'true' || isPublished === true,
      maxPoints: maxPoints ? parseFloat(maxPoints) : null,
      passingScore: passingScore ? parseFloat(passingScore) : null,
      countsTowardsFinal: countsTowardsFinal === 'true' || countsTowardsFinal === true,
      weight: weight ? parseFloat(weight) : 1.0
    };

    // Handle file uploads
    if (req.files) {
      if (req.files.video && req.files.video[0]) {
        const videoFile = req.files.video[0];
        lessonData.videoUrl = `/uploads/lessons/videos/${videoFile.filename}`;
        lessonData.videoEncrypted = true;
        
        // Get video duration (simplified - in production, use ffprobe)
        lessonData.videoDuration = 0; // Placeholder - implement video duration extraction
      }

      if (req.files.audio && req.files.audio[0]) {
        const audioFile = req.files.audio[0];
        lessonData.audioUrl = `/uploads/lessons/audio/${audioFile.filename}`;
        lessonData.audioDuration = 0; // Placeholder - implement audio duration extraction
      }

      if (req.files.document && req.files.document[0]) {
        const docFile = req.files.document[0];
        lessonData.documentUrl = `/uploads/lessons/documents/${docFile.filename}`;
        lessonData.documentType = path.extname(docFile.originalname).toUpperCase().slice(1);
      }
    }

    // Handle quiz data
    if (quizData && parsedContentTypes.includes('quiz')) {
      const parsedQuizData = typeof quizData === 'string' ? JSON.parse(quizData) : quizData;
      lessonData.quizData = parsedQuizData;
      lessonData.quizSettings = {
        timeLimit: parsedQuizData.timeLimit || 0,
        attempts: parsedQuizData.attempts || 1,
        showAnswers: parsedQuizData.showAnswers || 'after_completion',
        shuffleQuestions: parsedQuizData.shuffleQuestions || false,
        shuffleAnswers: parsedQuizData.shuffleAnswers || false
      };
    }

    // Handle assignment data
    if (assignmentData && parsedContentTypes.includes('assignment')) {
      const parsedAssignmentData = typeof assignmentData === 'string' ? JSON.parse(assignmentData) : assignmentData;
      lessonData.assignmentData = parsedAssignmentData;
      lessonData.assignmentSettings = {
        dueDate: parsedAssignmentData.dueDate || null,
        instructions: parsedAssignmentData.instructions || '',
        gradingCriteria: parsedAssignmentData.gradingCriteria || '',
        allowLateSubmission: parsedAssignmentData.allowLateSubmission || false,
        latePenalty: parsedAssignmentData.latePenalty || 0
      };
    }

    // Create lesson
    const lesson = await Lesson.create(lessonData);

    // Update course lesson count
    await course.increment('lessonsCount');

    res.status(201).json({
      message: 'Lesson created successfully',
      lesson
    });

  } catch (error) {
    console.error('Error creating lesson:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// @route   GET /api/lessons/:id
// @desc    Get lesson by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const lesson = await Lesson.findByPk(req.params.id, {
      include: [
        { model: Course, as: 'course', attributes: ['id', 'title', 'instructorId'] }
      ]
    });

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    res.json(lesson);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/lessons/:id
// @desc    Update lesson
// @access  Private (Instructor)
router.put('/:id', auth, async (req, res) => {
  try {
    const lesson = await Lesson.findByPk(req.params.id, {
      include: [{ model: Course, as: 'course' }]
    });

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // Check ownership
    if (lesson.course.instructorId.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if lesson can be edited (no active students)
    const editStatus = await canEditLesson(req.params.id);
    if (!editStatus.canEdit) {
      return res.status(423).json({ 
        message: 'Lesson cannot be edited',
        reason: editStatus.reason,
        activeStudents: editStatus.activeStudents,
        error: 'LESSON_LOCKED'
      });
    }

    // Update lesson
    const updatedLesson = await lesson.update(req.body);

    res.json(updatedLesson);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/lessons/:id
// @desc    Delete lesson
// @access  Private (Instructor)
router.delete('/:id', auth, async (req, res) => {
  try {
    const lesson = await Lesson.findByPk(req.params.id, {
      include: [{ model: Course, as: 'course' }]
    });

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // Check ownership
    if (lesson.course.instructorId.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if lesson can be deleted (no active students)
    const editStatus = await canEditLesson(req.params.id);
    if (!editStatus.canEdit) {
      return res.status(423).json({ 
        message: 'Lesson cannot be deleted',
        reason: editStatus.reason,
        activeStudents: editStatus.activeStudents,
        error: 'LESSON_LOCKED'
      });
    }

    // Delete associated files
    if (lesson.videoUrl) {
      const videoPath = path.join(__dirname, '..', lesson.videoUrl);
      if (fs.existsSync(videoPath)) {
        fs.unlinkSync(videoPath);
      }
    }

    if (lesson.audioUrl) {
      const audioPath = path.join(__dirname, '..', lesson.audioUrl);
      if (fs.existsSync(audioPath)) {
        fs.unlinkSync(audioPath);
      }
    }

    if (lesson.documentUrl) {
      const docPath = path.join(__dirname, '..', lesson.documentUrl);
      if (fs.existsSync(docPath)) {
        fs.unlinkSync(docPath);
      }
    }

    // Delete lesson
    await lesson.destroy();

    // Update course lesson count
    await lesson.course.decrement('lessonsCount');

    res.json({ message: 'Lesson deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/lessons/reorder
// @desc    Reorder lessons
// @access  Private (Instructor)
router.put('/reorder', auth, async (req, res) => {
  try {
    const { courseId, lessonOrders } = req.body;

    // Check if user owns the course
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructorId.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update lesson orders
    for (const { lessonId, order } of lessonOrders) {
      await Lesson.update({ order }, { where: { id: lessonId, courseId } });
    }

    res.json({ message: 'Lessons reordered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/lessons/:id/video
// @desc    Stream video (secure, no download)
// @access  Private (Enrolled students)
router.get('/:id/video', auth, async (req, res) => {
  try {
    const lesson = await Lesson.findByPk(req.params.id, {
      include: [{ model: Course, as: 'course' }]
    });

    if (!lesson || !lesson.videoUrl) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Check if user is enrolled in the course
    // TODO: Implement enrollment check
    
    const videoPath = path.join(__dirname, '..', lesson.videoUrl);
    
    if (!fs.existsSync(videoPath)) {
      return res.status(404).json({ message: 'Video file not found' });
    }

    // Set headers to prevent download
    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // Stream video
    const videoStream = fs.createReadStream(videoPath);
    videoStream.pipe(res);

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;