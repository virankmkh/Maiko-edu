const jwt = require('jsonwebtoken');
const Organizer = require('../models/Organizer');

const organizerAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token d\'accès requis'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if token is for organizer
    if (decoded.type !== 'organizer') {
      return res.status(401).json({
        success: false,
        message: 'Token invalide pour les organisateurs'
      });
    }

    const organizer = await Organizer.findByPk(decoded.organizerId);
    if (!organizer) {
      return res.status(401).json({
        success: false,
        message: 'Organisateur non trouvé'
      });
    }

    if (!organizer.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Compte organisateur désactivé'
      });
    }

    req.user = {
      id: organizer.id,
      email: organizer.email,
      companyName: organizer.companyName,
      type: 'organizer'
    };

    next();
  } catch (error) {
    console.error('Organizer auth middleware error:', error);
    res.status(401).json({
      success: false,
      message: 'Token invalide'
    });
  }
};

module.exports = organizerAuth;
