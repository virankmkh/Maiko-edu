const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const Organizer = require('../models/Organizer');
const auth = require('../middleware/auth');
const router = express.Router();

// Generate JWT Token
const generateToken = (organizerId) => {
  return jwt.sign(
    { organizerId, type: 'organizer' },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// @route   POST /api/organizer-auth/register
// @desc    Register a new organizer
// @access  Public
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('companyName').isLength({ min: 2, max: 100 }),
  body('contactPerson').isLength({ min: 2, max: 100 }),
  body('phone').optional().isLength({ min: 10, max: 20 }),
  body('companyDescription').optional().isLength({ max: 1000 }),
  body('website').optional().isURL(),
  body('address').optional().isLength({ max: 500 }),
  body('city').optional().isLength({ max: 100 }),
  body('country').optional().isLength({ max: 100 })
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: errors.array()
      });
    }

    const {
      email,
      password,
      companyName,
      contactPerson,
      phone,
      companyDescription,
      website,
      address,
      city,
      country
    } = req.body;

    // Check if organizer already exists
    const existingOrganizer = await Organizer.findOne({ where: { email } });
    if (existingOrganizer) {
      return res.status(400).json({
        success: false,
        message: 'Un organisateur avec cet email existe déjà'
      });
    }

    // Create new organizer
    const organizer = await Organizer.create({
      email,
      password,
      companyName,
      contactPerson,
      phone,
      companyDescription,
      website,
      address,
      city,
      country: country || 'RDC'
    });

    // Generate token
    const token = generateToken(organizer.id);

    res.status(201).json({
      success: true,
      message: 'Compte organisateur créé avec succès',
      token,
      organizer: organizer.toJSON()
    });

  } catch (error) {
    console.error('Organizer registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création du compte'
    });
  }
});

// @route   POST /api/organizer-auth/login
// @desc    Login organizer
// @access  Public
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Email et mot de passe requis'
      });
    }

    const { email, password } = req.body;

    // Find organizer
    const organizer = await Organizer.findOne({ where: { email } });
    if (!organizer) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Check if account is active
    if (!organizer.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Compte désactivé. Contactez le support.'
      });
    }

    // Validate password
    const isPasswordValid = await organizer.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Update last login
    await organizer.update({ lastLogin: new Date() });

    // Generate token
    const token = generateToken(organizer.id);

    res.json({
      success: true,
      message: 'Connexion réussie',
      token,
      organizer: organizer.toJSON()
    });

  } catch (error) {
    console.error('Organizer login error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la connexion'
    });
  }
});

// @route   GET /api/organizer-auth/me
// @desc    Get current organizer
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const organizer = await Organizer.findByPk(req.user.id);
    if (!organizer) {
      return res.status(404).json({
        success: false,
        message: 'Organisateur non trouvé'
      });
    }

    res.json({
      success: true,
      organizer: organizer.toJSON()
    });

  } catch (error) {
    console.error('Get organizer error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// @route   PUT /api/organizer-auth/profile
// @desc    Update organizer profile
// @access  Private
router.put('/profile', auth, [
  body('companyName').optional().isLength({ min: 2, max: 100 }),
  body('contactPerson').optional().isLength({ min: 2, max: 100 }),
  body('phone').optional().isLength({ min: 10, max: 20 }),
  body('companyDescription').optional().isLength({ max: 1000 }),
  body('website').optional().isURL(),
  body('address').optional().isLength({ max: 500 }),
  body('city').optional().isLength({ max: 100 }),
  body('country').optional().isLength({ max: 100 })
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: errors.array()
      });
    }

    const organizer = await Organizer.findByPk(req.user.id);
    if (!organizer) {
      return res.status(404).json({
        success: false,
        message: 'Organisateur non trouvé'
      });
    }

    // Update organizer
    const allowedUpdates = [
      'companyName', 'contactPerson', 'phone', 'companyDescription',
      'website', 'address', 'city', 'country'
    ];
    
    const updates = {};
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    await organizer.update(updates);

    res.json({
      success: true,
      message: 'Profil mis à jour avec succès',
      organizer: organizer.toJSON()
    });

  } catch (error) {
    console.error('Update organizer profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la mise à jour'
    });
  }
});

// @route   PUT /api/organizer-auth/password
// @desc    Update organizer password
// @access  Private
router.put('/password', auth, [
  body('currentPassword').exists(),
  body('newPassword').isLength({ min: 6 })
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Mot de passe actuel et nouveau mot de passe requis (min 6 caractères)'
      });
    }

    const { currentPassword, newPassword } = req.body;

    const organizer = await Organizer.findByPk(req.user.id);
    if (!organizer) {
      return res.status(404).json({
        success: false,
        message: 'Organisateur non trouvé'
      });
    }

    // Validate current password
    const isCurrentPasswordValid = await organizer.validatePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Mot de passe actuel incorrect'
      });
    }

    // Update password
    await organizer.update({ password: newPassword });

    res.json({
      success: true,
      message: 'Mot de passe mis à jour avec succès'
    });

  } catch (error) {
    console.error('Update organizer password error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la mise à jour du mot de passe'
    });
  }
});

module.exports = router;
