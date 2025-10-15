const express = require('express');
const { sequelize, models } = require('./config/database');

const app = express();
app.use(express.json());

// Add logging middleware
app.use((req, res, next) => {
  console.log(`🔍 ${req.method} ${req.path}`);
  console.log('Headers:', req.headers);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', req.body);
  }
  next();
});

// Mock the courses/instructor endpoint to see what your frontend is calling
app.get('/api/courses/instructor', (req, res) => {
  console.log('📚 Frontend called /api/courses/instructor');
  console.log('Auth header:', req.headers.authorization);
  
  // Return mock data that matches what you see
  res.json({
    courses: [
      {
        id: 1,
        title: "test",
        description: "testing",
        price: 5.00,
        status: "published",
        totalStudents: 5,
        totalLessons: 5,
        earnings: 10.00
      },
      {
        id: 2,
        title: "React Fundamentals", 
        description: "Learn the basics of React.js from scratch",
        price: 15.00,
        status: "published",
        totalStudents: 3,
        totalLessons: 1,
        earnings: 18.00
      },
      {
        id: 3,
        title: "Node.js Backend Development",
        description: "Build robust backend applications with Node.js", 
        price: 15.00,
        status: "published",
        totalStudents: 2,
        totalLessons: 1,
        earnings: 12.00
      }
    ]
  });
});

// Mock the students endpoint
app.get('/api/courses/:id/students', (req, res) => {
  console.log(`👥 Frontend called /api/courses/${req.params.id}/students`);
  
  res.json({
    statistics: {
      totalStudents: 19,
      currentStudents: 15,
      completedStudents: 4
    },
    students: {
      total: [
        { id: 1, name: "John Doe", email: "john@example.com", progress: 75 },
        { id: 2, name: "Jane Smith", email: "jane@example.com", progress: 50 },
        { id: 3, name: "Bob Johnson", email: "bob@example.com", progress: 100 }
      ]
    }
  });
});

const PORT = 5002;
app.listen(PORT, () => {
  console.log(`🔍 Debug server running on port ${PORT}`);
  console.log('This will show what your frontend is actually calling');
  console.log('Check your browser network tab to see the calls');
});
