const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Get token from header (support both x-auth-token and Authorization Bearer)
  let token = req.header('x-auth-token');
  
  // If no x-auth-token, try Authorization header
  if (!token) {
    const authHeader = req.header('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7); // Remove 'Bearer ' prefix
    }
  }

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Role-based authorization middleware
module.exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Access denied. Insufficient permissions.' 
      });
    }

    next();
  };
};

// Organization-specific authorization
module.exports.authorizeOrganization = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  // Admin can access everything
  if (req.user.role === 'admin') {
    return next();
  }

  // Check if user belongs to the organization
  const organizationId = req.params.organizationId || req.body.organizationId;
  
  if (req.user.role === 'organization_admin' || req.user.role === 'instructor') {
    if (req.user.organizationId && req.user.organizationId.toString() === organizationId) {
      return next();
    }
  }

  return res.status(403).json({ 
    message: 'Access denied. You can only access your organization\'s resources.' 
  });
};

// Course-specific authorization
module.exports.authorizeCourse = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const courseId = req.params.courseId || req.body.courseId;
    
    // Admin can access everything
    if (req.user.role === 'admin') {
      return next();
    }

    // Get course to check organization
    const Course = require('../models/Course');
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Organization admin/instructor can access their courses
    if (req.user.role === 'organization_admin' || req.user.role === 'instructor') {
      if (req.user.organizationId && 
          req.user.organizationId.toString() === course.organizationId.toString()) {
        return next();
      }
    }

    // Students can access enrolled courses
    if (req.user.role === 'student') {
      const User = require('../models/User');
      const user = await User.findById(req.user.id);
      const isEnrolled = user.enrolledCourses.some(
        enrollment => enrollment.courseId.toString() === courseId
      );
      
      if (isEnrolled) {
        return next();
      }
    }

    return res.status(403).json({ 
      message: 'Access denied. You cannot access this course.' 
    });
  } catch (error) {
    console.error('Course authorization error:', error);
    return res.status(500).json({ message: 'Server error during authorization' });
  }
};

// Optional authentication (doesn't fail if no token)
module.exports.optionalAuth = (req, res, next) => {
  let token = req.header('x-auth-token');
  
  // If no x-auth-token, try Authorization header
  if (!token) {
    const authHeader = req.header('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7); // Remove 'Bearer ' prefix
    }
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      req.user = decoded.user;
    } catch (err) {
      // Token is invalid, but we continue without user
      req.user = null;
    }
  }

  next();
};
