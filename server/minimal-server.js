const express = require('express');
const cors = require('cors');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = 5002;

// Basic middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
  res.json({
    message: 'Minimal server is working!',
    timestamp: new Date().toISOString()
  });
});

// Mock enrollment route (bypasses database)
app.post('/api/enrollments', (req, res) => {
  console.log('🔓 DEVELOPMENT MODE: Mock enrollment request received');
  console.log('Course ID:', req.body.courseId);
  
  // Simulate processing delay
  setTimeout(() => {
    res.json({
      message: 'Successfully enrolled in course! (Development mode)',
      enrollment: {
        id: Date.now(),
        courseId: req.body.courseId,
        userId: 1,
        enrolledAt: new Date().toISOString(),
        paymentStatus: 'free'
      }
    });
  }, 500);
});

// Mock courses route
app.get('/api/courses', (req, res) => {
  res.json([
    {
      id: 6,
      title: 'Complete Web Development Bootcamp',
      shortDescription: 'Master modern web development with HTML, CSS, JavaScript, React, and Node.js',
      price: 49.99,
      category: 'technology',
      difficulty: 'beginner',
      instructor: { firstName: 'Dr. Sarah', lastName: 'Johnson' }
    }
  ]);
});

// Mock lessons route
app.get('/api/lessons/course/:courseId', (req, res) => {
  res.json({
    lessons: [
      {
        id: 1,
        title: 'Introduction to Web Development',
        description: 'Get started with web development fundamentals',
        content: '<h2>Welcome to Web Development!</h2><p>This is your first lesson in web development.</p>',
        contentTypes: ['text'],
        order: 1
      },
      {
        id: 2,
        title: 'HTML Basics',
        description: 'Learn the fundamentals of HTML',
        content: '<h2>HTML Basics</h2><p>HTML is the foundation of web development.</p>',
        contentTypes: ['text'],
        order: 2
      }
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Minimal server running on port ${PORT}`);
  console.log(`🔗 Test endpoint: http://localhost:${PORT}/api/test`);
  console.log(`🔓 Development mode: All payments bypassed`);
});
