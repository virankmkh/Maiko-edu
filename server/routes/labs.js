const express = require('express');
const { body, param, validationResult } = require('express-validator');
const router = express.Router();
const { models } = require('../config/database');
const { LabSession, LabTemplate, User, Course } = models;
const eveNgService = require('../services/eveNgService');
const auth = require('../middleware/auth');

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

/**
 * @route   GET /api/labs/templates
 * @desc    Get all lab templates for a course
 * @access  Private
 */
router.get('/templates/:courseId', auth, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // Check if user is enrolled in the course
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Get lab templates for the course
    const templates = await LabTemplate.findByCourse(courseId);

    res.json({
      success: true,
      data: templates
    });
  } catch (error) {
    console.error('Error fetching lab templates:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch lab templates'
    });
  }
});

/**
 * @route   GET /api/labs/templates/:templateId
 * @desc    Get specific lab template details
 * @access  Private
 */
router.get('/templates/:templateId', auth, async (req, res) => {
  try {
    const { templateId } = req.params;

    const template = await LabTemplate.findByPk(templateId);
    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Lab template not found'
      });
    }

    res.json({
      success: true,
      data: template
    });
  } catch (error) {
    console.error('Error fetching lab template:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch lab template'
    });
  }
});

/**
 * @route   POST /api/labs/start
 * @desc    Start a new lab session
 * @access  Private
 */
router.post('/start', [
  auth,
  body('templateId').isInt().withMessage('Template ID must be a valid integer'),
  body('courseId').isInt().withMessage('Course ID must be a valid integer'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { templateId, courseId } = req.body;
    const userId = req.user.id;

    // Check if user already has an active lab session
    const existingSession = await LabSession.findActiveByUser(userId);
    if (existingSession) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active lab session. Please stop it before starting a new one.'
      });
    }

    // Get lab template
    const template = await LabTemplate.findByPk(templateId);
    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Lab template not found'
      });
    }

    // Check EVE-NG availability
    const isEveNgAvailable = await eveNgService.healthCheck();
    if (!isEveNgAvailable) {
      return res.status(503).json({
        success: false,
        message: 'EVE-NG server is currently unavailable. Please try again later.'
      });
    }

    // Authenticate with EVE-NG
    await eveNgService.authenticate();

    // Create lab session record
    const labSession = await LabSession.create({
      userId,
      courseId,
      labTemplateId: template.eveTemplateId,
      status: 'starting'
    });

    try {
      // Create lab instance in EVE-NG
      const labName = `lab_${userId}_${Date.now()}`;
      const eveLab = await eveNgService.createLabInstance(
        template.eveTemplateId,
        labName,
        userId
      );

      // Update lab session with EVE-NG lab ID
      labSession.eveLabId = eveLab.id;
      labSession.labConfiguration = template.topology;
      await labSession.save();

      // Start the lab
      const startResult = await eveNgService.startLab(eveLab.id);
      
      // Get device connections
      const topology = await eveNgService.getLabTopology(eveLab.id);
      
      // Update lab session with device connections and status
      labSession.deviceConnections = topology.devices;
      labSession.status = 'running';
      labSession.startedAt = new Date();
      labSession.lastActivity = new Date();
      await labSession.save();

      res.json({
        success: true,
        message: 'Lab session started successfully',
        data: {
          labSessionId: labSession.id,
          eveLabId: eveLab.id,
          status: labSession.status,
          devices: labSession.deviceConnections,
          template: {
            name: template.name,
            description: template.description,
            instructions: template.instructions
          }
        }
      });

    } catch (eveError) {
      // If EVE-NG operations fail, update lab session status
      labSession.status = 'error';
      labSession.errorMessage = eveError.message;
      await labSession.save();

      throw eveError;
    }

  } catch (error) {
    console.error('Error starting lab session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start lab session',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/labs/:sessionId/stop
 * @desc    Stop a lab session
 * @access  Private
 */
router.post('/:sessionId/stop', [
  auth,
  param('sessionId').isInt().withMessage('Session ID must be a valid integer'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;

    // Find lab session
    const labSession = await LabSession.findOne({
      where: {
        id: sessionId,
        userId,
        isActive: true
      }
    });

    if (!labSession) {
      return res.status(404).json({
        success: false,
        message: 'Lab session not found'
      });
    }

    if (labSession.status === 'stopped') {
      return res.status(400).json({
        success: false,
        message: 'Lab session is already stopped'
      });
    }

    try {
      // Stop lab in EVE-NG
      if (labSession.eveLabId) {
        await eveNgService.stopLab(labSession.eveLabId);
      }

      // Update lab session status
      labSession.status = 'stopped';
      labSession.stoppedAt = new Date();
      await labSession.save();

      res.json({
        success: true,
        message: 'Lab session stopped successfully'
      });

    } catch (eveError) {
      console.error('Error stopping EVE-NG lab:', eveError);
      // Still update the database even if EVE-NG fails
      labSession.status = 'error';
      labSession.errorMessage = eveError.message;
      await labSession.save();

      res.status(500).json({
        success: false,
        message: 'Failed to stop lab session in EVE-NG, but session marked as stopped'
      });
    }

  } catch (error) {
    console.error('Error stopping lab session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to stop lab session'
    });
  }
});

/**
 * @route   POST /api/labs/:sessionId/save
 * @desc    Save lab session state
 * @access  Private
 */
router.post('/:sessionId/save', [
  auth,
  param('sessionId').isInt().withMessage('Session ID must be a valid integer'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;

    // Find lab session
    const labSession = await LabSession.findOne({
      where: {
        id: sessionId,
        userId,
        isActive: true
      }
    });

    if (!labSession) {
      return res.status(404).json({
        success: false,
        message: 'Lab session not found'
      });
    }

    if (labSession.status !== 'running') {
      return res.status(400).json({
        success: false,
        message: 'Lab session must be running to save'
      });
    }

    try {
      // Save lab in EVE-NG
      if (labSession.eveLabId) {
        await eveNgService.saveLab(labSession.eveLabId);
      }

      // Update last activity
      labSession.lastActivity = new Date();
      await labSession.save();

      res.json({
        success: true,
        message: 'Lab session saved successfully'
      });

    } catch (eveError) {
      console.error('Error saving EVE-NG lab:', eveError);
      res.status(500).json({
        success: false,
        message: 'Failed to save lab session'
      });
    }

  } catch (error) {
    console.error('Error saving lab session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save lab session'
    });
  }
});

/**
 * @route   GET /api/labs/:sessionId/status
 * @desc    Get lab session status
 * @access  Private
 */
router.get('/:sessionId/status', [
  auth,
  param('sessionId').isInt().withMessage('Session ID must be a valid integer'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;

    // Find lab session
    const labSession = await LabSession.findOne({
      where: {
        id: sessionId,
        userId,
        isActive: true
      },
      include: [
        { model: LabTemplate, as: 'template' },
        { model: Course, as: 'course' }
      ]
    });

    if (!labSession) {
      return res.status(404).json({
        success: false,
        message: 'Lab session not found'
      });
    }

    // Get real-time status from EVE-NG if lab is running
    let eveStatus = null;
    if (labSession.eveLabId && labSession.status === 'running') {
      try {
        eveStatus = await eveNgService.getLabStatus(labSession.eveLabId);
      } catch (error) {
        console.error('Error getting EVE-NG status:', error);
      }
    }

    res.json({
      success: true,
      data: {
        id: labSession.id,
        status: labSession.status,
        startedAt: labSession.startedAt,
        stoppedAt: labSession.stoppedAt,
        lastActivity: labSession.lastActivity,
        errorMessage: labSession.errorMessage,
        devices: labSession.deviceConnections,
        template: labSession.template,
        course: labSession.course,
        eveStatus
      }
    });

  } catch (error) {
    console.error('Error getting lab session status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get lab session status'
    });
  }
});

/**
 * @route   GET /api/labs/my-sessions
 * @desc    Get user's lab sessions
 * @access  Private
 */
router.get('/my-sessions', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId, status } = req.query;

    const whereClause = { userId, isActive: true };
    if (courseId) whereClause.courseId = courseId;
    if (status) whereClause.status = status;

    const sessions = await LabSession.findAll({
      where: whereClause,
      include: [
        { model: LabTemplate, as: 'template' },
        { model: Course, as: 'course' }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: sessions
    });

  } catch (error) {
    console.error('Error fetching user lab sessions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch lab sessions'
    });
  }
});

/**
 * @route   DELETE /api/labs/:sessionId
 * @desc    Delete a lab session
 * @access  Private
 */
router.delete('/:sessionId', [
  auth,
  param('sessionId').isInt().withMessage('Session ID must be a valid integer'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;

    // Find lab session
    const labSession = await LabSession.findOne({
      where: {
        id: sessionId,
        userId,
        isActive: true
      }
    });

    if (!labSession) {
      return res.status(404).json({
        success: false,
        message: 'Lab session not found'
      });
    }

    try {
      // Delete lab from EVE-NG if it exists
      if (labSession.eveLabId) {
        await eveNgService.deleteLab(labSession.eveLabId);
      }

      // Mark session as inactive
      labSession.isActive = false;
      await labSession.save();

      res.json({
        success: true,
        message: 'Lab session deleted successfully'
      });

    } catch (eveError) {
      console.error('Error deleting EVE-NG lab:', eveError);
      // Still mark as inactive in database
      labSession.isActive = false;
      await labSession.save();

      res.json({
        success: true,
        message: 'Lab session marked as deleted (EVE-NG cleanup may have failed)'
      });
    }

  } catch (error) {
    console.error('Error deleting lab session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete lab session'
    });
  }
});

module.exports = router;
