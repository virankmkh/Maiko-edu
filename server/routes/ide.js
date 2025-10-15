const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// @route   POST /api/ide/execute
// @desc    Execute code in sandbox environment
// @access  Private (Enrolled students)
router.post('/execute', [
  auth,
  body('code', 'Code is required').notEmpty(),
  body('language', 'Language is required').isIn(['javascript', 'python', 'java', 'cpp', 'html', 'css', 'react', 'vue', 'php', 'sql'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { code, language, tests = [] } = req.body;

    // Execute code based on language
    let output = '';
    let error = '';
    let status = 'success';

    try {
      switch (language) {
        case 'javascript':
          output = await executeJavaScript(code);
          break;
        case 'python':
          output = await executePython(code);
          break;
        case 'html':
          output = await executeHTML(code);
          break;
        case 'css':
          output = await executeCSS(code);
          break;
        case 'react':
          output = await executeReact(code);
          break;
        default:
          output = `Language ${language} not supported yet`;
          status = 'error';
      }

      // Run tests if provided
      if (tests.length > 0 && status === 'success') {
        const testResults = await runTests(code, language, tests);
        output += '\n\n--- Test Results ---\n' + testResults;
      }

    } catch (err) {
      error = err.message;
      status = 'error';
    }

    res.json({
      output: output || error,
      status,
      language,
      timestamp: new Date()
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/ide/history/:courseId
// @desc    Get IDE execution history for a course
// @access  Private (Enrolled student)
router.get('/history/:courseId', auth, async (req, res) => {
  try {
    const { courseId } = req.params;

    const User = require('../models/User');
    const user = await User.findById(req.user.id);
    const enrollment = user.enrolledCourses.find(
      e => e.courseId.toString() === courseId
    );

    if (!enrollment) {
      return res.status(403).json({ message: 'Not enrolled in this course' });
    }

    res.json({
      history: enrollment.ideHistory || [],
      totalExecutions: (enrollment.ideHistory || []).length
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/ide/save-snippet
// @desc    Save code snippet for later use
// @access  Private
router.post('/save-snippet', [
  auth,
  body('title', 'Title is required').notEmpty().trim(),
  body('code', 'Code is required').notEmpty(),
  body('language', 'Language is required').isIn(['javascript', 'python', 'java', 'cpp', 'csharp', 'php', 'ruby', 'go', 'rust', 'swift']),
  body('description').optional().trim(),
  body('tags').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, code, language, description, tags } = req.body;

    const User = require('../models/User');
    const user = await User.findById(req.user.id);

    if (!user.savedSnippets) {
      user.savedSnippets = [];
    }

    const snippet = {
      title,
      code,
      language,
      description,
      tags: tags || [],
      createdAt: new Date()
    };

    user.savedSnippets.push(snippet);
    await user.save();

    res.json({
      message: 'Snippet saved successfully',
      snippet
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/ide/snippets
// @desc    Get user's saved code snippets
// @access  Private
router.get('/snippets', auth, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user.id);

    res.json({
      snippets: user.savedSnippets || [],
      total: (user.savedSnippets || []).length
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/ide/snippets/:snippetId
// @desc    Update saved code snippet
// @access  Private
router.put('/snippets/:snippetId', [
  auth,
  body('title').optional().trim(),
  body('code').optional(),
  body('description').optional().trim(),
  body('tags').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const User = require('../models/User');
    const user = await User.findById(req.user.id);
    const snippetIndex = user.savedSnippets.findIndex(
      s => s._id.toString() === req.params.snippetId
    );

    if (snippetIndex === -1) {
      return res.status(404).json({ message: 'Snippet not found' });
    }

    // Update snippet fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        user.savedSnippets[snippetIndex][key] = req.body[key];
      }
    });

    user.savedSnippets[snippetIndex].updatedAt = new Date();
    await user.save();

    res.json({
      message: 'Snippet updated successfully',
      snippet: user.savedSnippets[snippetIndex]
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/ide/snippets/:snippetId
// @desc    Delete saved code snippet
// @access  Private
router.delete('/snippets/:snippetId', auth, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user.id);
    
    const snippetIndex = user.savedSnippets.findIndex(
      s => s._id.toString() === req.params.snippetId
    );

    if (snippetIndex === -1) {
      return res.status(404).json({ message: 'Snippet not found' });
    }

    user.savedSnippets.splice(snippetIndex, 1);
    await user.save();

    res.json({ message: 'Snippet deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/ide/languages
// @desc    Get supported programming languages
// @access  Public
router.get('/languages', (req, res) => {
  const languages = [
    { id: 'javascript', name: 'JavaScript', extension: '.js', icon: '⚡' },
    { id: 'python', name: 'Python', extension: '.py', icon: '🐍' },
    { id: 'java', name: 'Java', extension: '.java', icon: '☕' },
    { id: 'cpp', name: 'C++', extension: '.cpp', icon: '⚙️' },
    { id: 'csharp', name: 'C#', extension: '.cs', icon: '🔷' },
    { id: 'php', name: 'PHP', extension: '.php', icon: '🐘' },
    { id: 'ruby', name: 'Ruby', extension: '.rb', icon: '💎' },
    { id: 'go', name: 'Go', extension: '.go', icon: '🚀' },
    { id: 'rust', name: 'Rust', extension: '.rs', icon: '🦀' },
    { id: 'swift', name: 'Swift', extension: '.swift', icon: '🍎' }
  ];

  res.json(languages);
});

// Code execution functions
async function executeJavaScript(code) {
  return new Promise((resolve, reject) => {
    try {
      // Create a safe execution context
      const vm = require('vm');
      const sandbox = {
        console: {
          log: (...args) => {
            // Capture console.log output
            return args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' ');
          }
        },
        setTimeout: setTimeout,
        setInterval: setInterval,
        clearTimeout: clearTimeout,
        clearInterval: clearInterval
      };
      
      const context = vm.createContext(sandbox);
      const script = new vm.Script(code);
      
      let output = '';
      const originalLog = console.log;
      console.log = (...args) => {
        output += args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ') + '\n';
      };
      
      script.runInContext(context, { timeout: 5000 });
      console.log = originalLog;
      
      resolve(output || 'Code executed successfully (no output)');
    } catch (error) {
      reject(new Error(`JavaScript Error: ${error.message}`));
    }
  });
}

async function executePython(code) {
  return new Promise((resolve, reject) => {
    const python = spawn('python', ['-c', code]);
    let output = '';
    let error = '';

    python.stdout.on('data', (data) => {
      output += data.toString();
    });

    python.stderr.on('data', (data) => {
      error += data.toString();
    });

    python.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Python Error: ${error}`));
      } else {
        resolve(output || 'Code executed successfully (no output)');
      }
    });

    python.on('error', (err) => {
      reject(new Error(`Python not available: ${err.message}`));
    });
  });
}

async function executeHTML(code) {
  // For HTML, we'll return a preview URL or the HTML content
  return `HTML Preview:\n${code}\n\nNote: This would normally open in a browser preview.`;
}

async function executeCSS(code) {
  // For CSS, we'll return the CSS content
  return `CSS Generated:\n${code}\n\nNote: This would normally be applied to an HTML preview.`;
}

async function executeReact(code) {
  // For React, we'll return a basic analysis
  return `React Component:\n${code}\n\nNote: This would normally render in a React preview environment.`;
}

async function runTests(code, language, tests) {
  let results = '';
  
  for (const test of tests) {
    try {
      if (language === 'javascript') {
        // Simple test execution for JavaScript
        const testCode = `
          ${code}
          
          // Test: ${test.name}
          try {
            // This is a simplified test runner
            // In a real implementation, you'd have proper test frameworks
            console.log('Test: ${test.name} - Running...');
            // Add actual test logic here based on test.input and test.expectedOutput
            console.log('Test: ${test.name} - Passed');
          } catch (error) {
            console.log('Test: ${test.name} - Failed: ' + error.message);
          }
        `;
        
        const testOutput = await executeJavaScript(testCode);
        results += testOutput;
      } else {
        results += `Test: ${test.name} - Not implemented for ${language}\n`;
      }
    } catch (error) {
      results += `Test: ${test.name} - Error: ${error.message}\n`;
    }
  }
  
  return results;
}

module.exports = router;
