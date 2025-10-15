const express = require('express');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const { sequelize, models } = require('../config/database');
const { Forum, ForumPost, ForumReaction, GroupCall, User, Course, Lesson, CourseEnrollment } = models;
const { v4: uuidv4 } = require('uuid');
const ForumService = require('../services/forumService');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/forum-media');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'forum-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images, videos, and audio files
    if (file.mimetype.startsWith('image/') || 
        file.mimetype.startsWith('video/') || 
        file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image, video, and audio files are allowed'), false);
    }
  }
});

// Get forums for a course with enhanced access control
router.get('/course/:courseId', auth, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { lessonId } = req.query;

    // Check if course exists
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Get accessible forums using the service
    const forums = await ForumService.getAccessibleForums(courseId, req.user.id, req.user.role);

    // Filter by lessonId if specified
    let filteredForums = forums;
    if (lessonId) {
      filteredForums = forums.filter(forum => forum.lessonId == lessonId);
    } else {
      // Course-level forums only
      filteredForums = forums.filter(forum => forum.lessonId === null);
    }

    // Add lesson progress information for students
    if (req.user.role === 'student') {
      const lessonProgress = await ForumService.getUserLessonProgress(req.user.id, courseId);
      filteredForums = filteredForums.map(forum => ({
        ...forum,
        canAccess: forum.accessReason !== 'Must start lesson before accessing forum',
        lessonProgress: lessonProgress.find(p => p.lessonId === forum.lessonId)
      }));
    }

    res.json(filteredForums);
  } catch (error) {
    console.error('Error fetching forums:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new forum
router.post('/course/:courseId', [
  auth,
  body('title', 'Title is required').notEmpty(),
  body('description', 'Description is required').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { courseId } = req.params;
    const { title, description, lessonId, isPinned = false } = req.body;
    const userId = req.user.id;

    // Check if user is enrolled in the course
    const enrollment = await CourseEnrollment.findOne({
      where: { courseId, userId: userId }
    });

    if (!enrollment) {
      return res.status(403).json({ message: 'You must be enrolled in this course to create forums' });
    }

    const forum = await Forum.create({
      courseId,
      lessonId: lessonId || null,
      title,
      description,
      isPinned,
      creatorId: userId
    });

    res.status(201).json(forum);
  } catch (error) {
    console.error('Error creating forum:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get posts for a forum
router.get('/:forumId/posts', auth, async (req, res) => {
  try {
    const { forumId } = req.params;
    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;

    const offset = (page - 1) * limit;

    const posts = await ForumPost.findAndCountAll({
      where: { forumId, parentPostId: null }, // Only top-level posts
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'firstName', 'lastName', 'role']
        },
        {
          model: ForumPost,
          as: 'replies',
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['id', 'firstName', 'lastName']
            }
          ],
          limit: 3,
          order: [['createdAt', 'ASC']]
        }
      ],
      order: [
        ['isPinned', 'DESC'],
        [sortBy, sortOrder]
      ],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      posts: posts.rows,
      totalCount: posts.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(posts.count / limit)
    });
  } catch (error) {
    console.error('Error fetching forum posts:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new post
router.post('/:forumId/posts', [
  auth,
  upload.single('mediaFile'),
  body('content', 'Content is required').notEmpty(),
  body('postType', 'Invalid post type').isIn(['text', 'audio', 'video', 'announcement', 'question', 'discussion'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { forumId } = req.params;
    const {
      title,
      content,
      postType = 'text',
      mediaUrl,
      mediaType,
      mediaDuration,
      parentPostId,
      tags = []
    } = req.body;
    const userId = req.user.id;

    // Handle uploaded file
    let mediaUrlFinal = mediaUrl;
    let mediaTypeFinal = mediaType;
    
    if (req.file) {
      mediaUrlFinal = `/uploads/forum-media/${req.file.filename}`;
      mediaTypeFinal = req.file.mimetype;
    }

    // Check if user has access to this forum
    const forum = await Forum.findByPk(forumId, {
      include: [
        {
          model: Course,
          as: 'course'
        }
      ]
    });

    if (!forum) {
      return res.status(404).json({ message: 'Forum not found' });
    }

    // Check enrollment
    const enrollment = await CourseEnrollment.findOne({
      where: { courseId: forum.courseId, userId: userId }
    });

    if (!enrollment) {
      return res.status(403).json({ message: 'You must be enrolled in this course to post' });
    }

    const post = await ForumPost.create({
      forumId,
      authorId: userId,
      parentPostId,
      title,
      content,
      postType,
      mediaUrl: mediaUrlFinal,
      mediaType: mediaTypeFinal,
      mediaDuration,
      tags
    });

    // Update forum post count and last activity
    await Forum.update(
      {
        postCount: await ForumPost.count({ where: { forumId } }),
        lastActivityAt: new Date()
      },
      { where: { id: forumId } }
    );

    // If it's a reply, update parent post reply count
    if (parentPostId) {
      await ForumPost.update(
        { replyCount: await ForumPost.count({ where: { parentPostId } }) },
        { where: { id: parentPostId } }
      );
    }

    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// React to a post
router.post('/posts/:postId/react', [
  auth,
  body('reactionType', 'Invalid reaction type').isIn(['like', 'dislike', 'love', 'laugh', 'angry', 'sad', 'wow'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { postId } = req.params;
    const { reactionType } = req.body;
    const userId = req.user.id;

    // Check if user already reacted
    const existingReaction = await ForumReaction.findOne({
      where: { postId, userId }
    });

    if (existingReaction) {
      if (existingReaction.reactionType === reactionType) {
        // Remove reaction
        await existingReaction.destroy();
      } else {
        // Update reaction
        existingReaction.reactionType = reactionType;
        await existingReaction.save();
      }
    } else {
      // Create new reaction
      await ForumReaction.create({
        postId,
        userId,
        reactionType
      });
    }

    // Update post like count
    const likeCount = await ForumReaction.count({
      where: { postId, reactionType: 'like' }
    });

    await ForumPost.update(
      { likeCount },
      { where: { id: postId } }
    );

    res.json({ message: 'Reaction updated' });
  } catch (error) {
    console.error('Error updating reaction:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get group calls for a forum
router.get('/:forumId/calls', auth, async (req, res) => {
  try {
    const { forumId } = req.params;
    const { status = 'active' } = req.query;

    const calls = await GroupCall.findAll({
      where: { forumId, status },
      include: [
        {
          model: User,
          as: 'host',
          attributes: ['id', 'firstName', 'lastName', 'avatar']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(calls);
  } catch (error) {
    console.error('Error fetching group calls:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a group call
router.post('/:forumId/calls', [
  auth,
  body('title', 'Title is required').notEmpty(),
  body('scheduledAt', 'Scheduled time is required').isISO8601()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { forumId } = req.params;
    const {
      title,
      description,
      scheduledAt,
      maxParticipants = 10,
      callType = 'discussion',
      isLiveLesson = false,
      isProctoredExam = false,
      accessFee = 0,
      instructorControls = {},
      moderators = [],
      examSettings = {},
      settings = {}
    } = req.body;
    const userId = req.user.id;

    // Check if user has access to this forum
    const forum = await Forum.findByPk(forumId, {
      include: [
        {
          model: Course,
          as: 'course'
        }
      ]
    });

    if (!forum) {
      return res.status(404).json({ message: 'Forum not found' });
    }

    // Check if user is instructor for live lessons
    if (isLiveLesson && req.user.role !== 'instructor') {
      return res.status(403).json({ message: 'Only instructors can create live lessons' });
    }

    // Check enrollment
    const enrollment = await CourseEnrollment.findOne({
      where: { courseId: forum.courseId, userId: userId }
    });

    if (!enrollment) {
      return res.status(403).json({ message: 'You must be enrolled in this course to create calls' });
    }

    const roomId = uuidv4();
    const call = await GroupCall.create({
      forumId,
      hostId: userId,
      title,
      description,
      roomId,
      scheduledAt: new Date(scheduledAt),
      maxParticipants: Math.min(maxParticipants, 50), // Max 50 participants
      callType,
      isLiveLesson,
      isProctoredExam,
      accessFee: isLiveLesson ? 1.00 : accessFee,
      isPaid: isLiveLesson,
      instructorControls: {
        allowScreenShare: true,
        allowStudentVideo: false,
        allowStudentAudio: false,
        allowChat: true,
        allowQuestions: true,
        muteAllStudents: false,
        requireHandRaise: true,
        allowRecording: false,
        ...instructorControls
      },
      moderators,
      examSettings: isProctoredExam ? {
        allowTabSwitch: false,
        allowCopyPaste: false,
        requireFullScreen: true,
        monitorScreen: true,
        timeLimit: null,
        questionCount: 0,
        ...examSettings
      } : {},
      settings
    });

    res.status(201).json(call);
  } catch (error) {
    console.error('Error creating group call:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Join a group call
router.post('/calls/:callId/join', auth, async (req, res) => {
  try {
    const { callId } = req.params;
    const userId = req.user.id;

    const call = await GroupCall.findByPk(callId);
    if (!call) {
      return res.status(404).json({ message: 'Call not found' });
    }

    if (call.status !== 'active' && call.status !== 'scheduled') {
      return res.status(400).json({ message: 'Call is not available' });
    }

    if (call.currentParticipants >= call.maxParticipants) {
      return res.status(400).json({ message: 'Call is full' });
    }

    // Update participant count
    await call.update({
      currentParticipants: call.currentParticipants + 1,
      status: call.status === 'scheduled' ? 'active' : call.status
    });

    res.json({ 
      message: 'Joined call successfully',
      roomId: call.roomId,
      callId: call.id
    });
  } catch (error) {
    console.error('Error joining call:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Pay for live lesson access
router.post('/calls/:callId/pay', auth, async (req, res) => {
  try {
    const { callId } = req.params;
    const { paymentMethod, paymentId } = req.body;
    const userId = req.user.id;

    const call = await GroupCall.findByPk(callId);
    if (!call) {
      return res.status(404).json({ message: 'Call not found' });
    }

    if (!call.isLiveLesson || !call.isPaid) {
      return res.status(400).json({ message: 'This call does not require payment' });
    }

    // Check if already paid
    const existingPayment = await LiveLessonPayment.findOne({
      where: { callId, userId: userId }
    });

    if (existingPayment && existingPayment.status === 'completed') {
      return res.status(400).json({ message: 'You have already paid for this live lesson' });
    }

    // Create payment record
    const payment = await LiveLessonPayment.create({
      callId,
      userId: userId,
      amount: call.accessFee,
      paymentMethod,
      paymentId,
      status: 'completed',
      paidAt: new Date()
    });

    res.json({ message: 'Payment successful', payment });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Join live lesson (with payment check)
router.post('/calls/:callId/join-live', auth, async (req, res) => {
  try {
    const { callId } = req.params;
    const userId = req.user.id;

    const call = await GroupCall.findByPk(callId);
    if (!call) {
      return res.status(404).json({ message: 'Call not found' });
    }

    if (call.status !== 'active' && call.status !== 'scheduled') {
      return res.status(400).json({ message: 'Call is not available' });
    }

    // Check payment for live lessons
    if (call.isLiveLesson && call.isPaid) {
      const payment = await LiveLessonPayment.findOne({
        where: { callId, userId: userId, status: 'completed' }
      });

      if (!payment) {
        return res.status(402).json({ 
          message: 'Payment required', 
          amount: call.accessFee,
          currency: 'USD'
        });
      }
    }

    // Check participant limit
    const participantCount = await LiveLessonParticipant.count({
      where: { callId }
    });

    if (participantCount >= call.maxParticipants) {
      return res.status(400).json({ message: 'Call is full' });
    }

    // Add participant
    const participant = await LiveLessonParticipant.create({
      callId,
      userId,
      role: call.hostId === userId ? 'instructor' : 'student',
      joinedAt: new Date(),
      permissions: call.hostId === userId ? {
        canSpeak: true,
        canShareScreen: true,
        canChat: true,
        canAskQuestions: true,
        canModerate: true
      } : {
        canSpeak: false,
        canShareScreen: false,
        canChat: true,
        canAskQuestions: true,
        canModerate: false
      }
    });

    res.json({ 
      message: 'Joined successfully',
      roomId: call.roomId,
      participantId: participant.id,
      permissions: participant.permissions
    });
  } catch (error) {
    console.error('Error joining live lesson:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Instructor controls for live lesson
router.put('/calls/:callId/controls', auth, async (req, res) => {
  try {
    const { callId } = req.params;
    const { controls } = req.body;
    const userId = req.user.id;

    const call = await GroupCall.findByPk(callId);
    if (!call) {
      return res.status(404).json({ message: 'Call not found' });
    }

    // Check if user is instructor
    if (call.hostId !== userId && req.user.role !== 'instructor') {
      return res.status(403).json({ message: 'Only instructors can control live lessons' });
    }

    await call.update({
      instructorControls: { ...call.instructorControls, ...controls }
    });

    res.json({ message: 'Controls updated', controls: call.instructorControls });
  } catch (error) {
    console.error('Error updating controls:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mute/unmute participant
router.put('/calls/:callId/participants/:participantId/mute', auth, async (req, res) => {
  try {
    const { callId, participantId } = req.params;
    const { muted } = req.body;
    const userId = req.user.id;

    const call = await GroupCall.findByPk(callId);
    if (!call) {
      return res.status(404).json({ message: 'Call not found' });
    }

    // Check if user is instructor or moderator
    const participant = await LiveLessonParticipant.findOne({
      where: { callId, userId }
    });

    if (!participant || (participant.role !== 'instructor' && participant.role !== 'moderator')) {
      return res.status(403).json({ message: 'Only instructors and moderators can mute participants' });
    }

    const targetParticipant = await LiveLessonParticipant.findByPk(participantId);
    if (!targetParticipant) {
      return res.status(404).json({ message: 'Participant not found' });
    }

    await targetParticipant.update({ isMuted: muted });

    res.json({ message: `Participant ${muted ? 'muted' : 'unmuted'}` });
  } catch (error) {
    console.error('Error muting participant:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Hand raise system
router.post('/calls/:callId/raise-hand', auth, async (req, res) => {
  try {
    const { callId } = req.params;
    const userId = req.user.id;

    const participant = await LiveLessonParticipant.findOne({
      where: { callId, userId }
    });

    if (!participant) {
      return res.status(404).json({ message: 'Participant not found' });
    }

    await participant.update({
      handRaised: true,
      handRaisedAt: new Date()
    });

    res.json({ message: 'Hand raised' });
  } catch (error) {
    console.error('Error raising hand:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Grant speaking permission
router.post('/calls/:callId/participants/:participantId/grant-speech', auth, async (req, res) => {
  try {
    const { callId, participantId } = req.params;
    const userId = req.user.id;

    const call = await GroupCall.findByPk(callId);
    if (!call) {
      return res.status(404).json({ message: 'Call not found' });
    }

    // Check if user is instructor or moderator
    const participant = await LiveLessonParticipant.findOne({
      where: { callId, userId }
    });

    if (!participant || (participant.role !== 'instructor' && participant.role !== 'moderator')) {
      return res.status(403).json({ message: 'Only instructors and moderators can grant speech' });
    }

    const targetParticipant = await LiveLessonParticipant.findByPk(participantId);
    if (!targetParticipant) {
      return res.status(404).json({ message: 'Participant not found' });
    }

    await targetParticipant.update({
      permissions: {
        ...targetParticipant.permissions,
        canSpeak: true
      },
      handRaised: false,
      handRaisedAt: null
    });

    res.json({ message: 'Speaking permission granted' });
  } catch (error) {
    console.error('Error granting speech:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
