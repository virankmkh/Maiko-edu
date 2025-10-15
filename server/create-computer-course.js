const { sequelize, models } = require('./config/database');
const bcrypt = require('bcryptjs');

async function createComputerCourse() {
  try {
    console.log('🚀 Creating comprehensive computer programming course...\n');

    // First, let's find or create an instructor
    let instructor = await models.User.findOne({
      where: { email: 'instructor@maiko.edu' }
    });

    if (!instructor) {
      console.log('📝 Creating instructor account...');
      const hashedPassword = await bcrypt.hash('instructor123', 10);
      instructor = await models.User.create({
        firstName: 'Dr. Sarah',
        lastName: 'Johnson',
        email: 'instructor@maiko.edu',
        password: hashedPassword,
        role: 'instructor',
        isActive: true,
        isVerified: true,
        phone: '+243 123 456 789',
        dateOfBirth: '1985-06-15'
      });
      console.log('✅ Instructor created:', instructor.email);
    }

    // Create an organization first
    console.log('🏢 Creating organization...');
    const organization = await models.Organization.create({
      name: 'Maiko EDU Academy',
      description: 'Leading online education platform for technology courses',
      website: 'https://maiko.edu',
      email: 'info@maiko.edu',
      phone: '+243 123 456 789',
      address: 'Kinshasa, Democratic Republic of Congo',
      isVerified: true,
      isActive: true
    });
    console.log('✅ Organization created:', organization.name);

    // Create the main course
    console.log('📚 Creating "Complete Web Development Bootcamp" course...');
    const course = await models.Course.create({
      title: 'Advanced Web Development Bootcamp 2025',
      slug: 'advanced-web-development-bootcamp-2025',
      shortDescription: 'Master modern web development with HTML, CSS, JavaScript, React, and Node.js',
      description: `This comprehensive bootcamp covers everything you need to become a professional web developer. You'll learn frontend development with HTML, CSS, and JavaScript, then move to modern frameworks like React. The course also covers backend development with Node.js, databases, and deployment.

What you'll learn:
- HTML5 and CSS3 fundamentals
- JavaScript ES6+ and modern features
- React.js for building dynamic user interfaces
- Node.js and Express.js for backend development
- Database design and management
- API development and integration
- Git version control
- Deployment and DevOps basics

Perfect for beginners and those looking to advance their skills!`,
      category: 'technology',
      difficulty: 'beginner',
      language: 'en',
      price: 49.99,
      currency: 'USD',
      duration: 1200, // 20 hours
      level: 'intermediate',
      instructorId: instructor.id,
      organizationId: organization.id,
      isPublished: true,
      thumbnail: '/images/courses/web-development-bootcamp.jpg',
      tags: ['web development', 'javascript', 'react', 'nodejs', 'html', 'css'],
      requirements: [
        'Basic computer skills',
        'No programming experience required',
        'Willingness to learn and practice'
      ],
      objectives: [
        'Build responsive websites with HTML and CSS',
        'Create interactive web applications with JavaScript',
        'Develop modern UIs with React.js',
        'Build RESTful APIs with Node.js',
        'Deploy applications to the cloud',
        'Use Git for version control'
      ]
    });

    console.log('✅ Course created:', course.title);

    // Create lessons
    const lessons = [
      {
        title: 'Introduction to Web Development',
        description: 'Get started with web development fundamentals and set up your development environment.',
        content: `# Welcome to Web Development!

In this first lesson, we'll cover:

## What is Web Development?
Web development is the process of building websites and web applications. It involves two main areas:
- **Frontend**: What users see and interact with
- **Backend**: Server-side logic and database management

## The Web Development Stack
- **HTML**: Structure and content
- **CSS**: Styling and layout
- **JavaScript**: Interactivity and behavior
- **Frameworks**: React, Vue, Angular
- **Backend**: Node.js, Python, PHP
- **Databases**: MySQL, MongoDB, PostgreSQL

## Setting Up Your Environment
1. Install a code editor (VS Code recommended)
2. Install Node.js and npm
3. Set up Git for version control
4. Create your first project folder

Let's start coding!`,
        order: 1,
        isFree: true,
        isPublished: true,
        videoUrl: '/videos/web-dev-intro.mp4',
        videoDuration: 900, // 15 minutes
        contentTypes: ['video', 'text', 'quiz'],
        objectives: [
          'Understand what web development is',
          'Set up development environment',
          'Create first HTML page'
        ],
        resources: [
          { name: 'VS Code Download', url: 'https://code.visualstudio.com/' },
          { name: 'Node.js Download', url: 'https://nodejs.org/' },
          { name: 'Git Download', url: 'https://git-scm.com/' }
        ],
        quizData: {
          questions: [
            {
              id: 1,
              question: 'What does HTML stand for?',
              type: 'multiple-choice',
              options: [
                'HyperText Markup Language',
                'High Tech Modern Language',
                'Home Tool Markup Language',
                'Hyperlink and Text Markup Language'
              ],
              correctAnswer: 0,
              explanation: 'HTML stands for HyperText Markup Language, which is the standard markup language for creating web pages.'
            },
            {
              id: 2,
              question: 'Which of the following is NOT a frontend technology?',
              type: 'multiple-choice',
              options: ['HTML', 'CSS', 'JavaScript', 'MySQL'],
              correctAnswer: 3,
              explanation: 'MySQL is a database technology used in backend development, not frontend.'
            }
          ]
        },
        quizSettings: {
          timeLimit: 300, // 5 minutes
          attempts: 3,
          passingScore: 70,
          showAnswers: true
        }
      },
      {
        title: 'HTML5 Fundamentals',
        description: 'Learn HTML5 structure, semantic elements, and best practices for modern web development.',
        content: `# HTML5 Fundamentals

HTML5 is the latest version of HTML with many new features and improvements.

## Basic HTML Structure
\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First Web Page</title>
</head>
<body>
    <h1>Welcome to My Website</h1>
    <p>This is a paragraph of text.</p>
</body>
</html>
\`\`\`

## Semantic HTML Elements
- \`<header>\`: Site or section header
- \`<nav>\`: Navigation links
- \`<main>\`: Main content area
- \`<section>\`: Thematic grouping of content
- \`<article>\`: Self-contained content
- \`<aside>\`: Sidebar content
- \`<footer>\`: Site or section footer

## Forms and Input Elements
\`\`\`html
<form action="/submit" method="POST">
    <label for="name">Name:</label>
    <input type="text" id="name" name="name" required>
    
    <label for="email">Email:</label>
    <input type="email" id="email" name="email" required>
    
    <button type="submit">Submit</button>
</form>
\`\`\`

## Practice Exercise
Create a personal portfolio page using semantic HTML elements.`,
        order: 2,
        isFree: false,
        isPublished: true,
        videoUrl: '/videos/html5-fundamentals.mp4',
        videoDuration: 1200, // 20 minutes
        contentTypes: ['video', 'text', 'assignment', 'ide'],
        objectives: [
          'Master HTML5 semantic elements',
          'Create accessible forms',
          'Build a complete HTML page'
        ],
        assignmentData: {
          title: 'Build a Personal Portfolio Page',
          description: 'Create a complete HTML page for your personal portfolio using semantic HTML5 elements.',
          requirements: [
            'Use proper HTML5 document structure',
            'Include semantic elements (header, nav, main, section, article, footer)',
            'Add a contact form with proper input types',
            'Include at least 3 sections: About, Skills, Contact',
            'Use proper heading hierarchy (h1, h2, h3)'
          ],
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          maxPoints: 100
        },
        assignmentSettings: {
          allowLateSubmission: true,
          latePenalty: 10, // 10% penalty per day
          gradingCriteria: [
            { criterion: 'HTML Structure', points: 25 },
            { criterion: 'Semantic Elements', points: 25 },
            { criterion: 'Form Implementation', points: 20 },
            { criterion: 'Code Quality', points: 15 },
            { criterion: 'Creativity', points: 15 }
          ]
        },
        codeData: {
          language: 'html',
          starterCode: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Portfolio</title>
</head>
<body>
    <!-- Your HTML code here -->
</body>
</html>`,
          tests: [
            {
              id: 1,
              name: 'HTML Structure Test',
              description: 'Check if the HTML document has proper structure',
              input: 'HTML content',
              expectedOutput: 'Valid HTML5 document'
            }
          ]
        }
      },
      {
        title: 'CSS3 Styling and Layout',
        description: 'Master CSS3 features including Flexbox, Grid, animations, and responsive design.',
        content: `# CSS3 Styling and Layout

CSS3 brings powerful new features for styling and layout.

## CSS Grid Layout
\`\`\`css
.container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 20px;
}

.item {
    background: #f0f0f0;
    padding: 20px;
    border-radius: 8px;
}
\`\`\`

## Flexbox
\`\`\`css
.flex-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
}

.flex-item {
    flex: 1;
    min-width: 200px;
}
\`\`\`

## CSS Animations
\`\`\`css
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.animated {
    animation: fadeIn 1s ease-in-out;
}
\`\`\`

## Responsive Design
\`\`\`css
@media (max-width: 768px) {
    .container {
        grid-template-columns: 1fr;
    }
}
\`\`\`

## Practice Exercise
Style your portfolio page with modern CSS3 features.`,
        order: 3,
        isFree: false,
        isPublished: true,
        videoUrl: '/videos/css3-styling.mp4',
        videoDuration: 1200, // 20 minutes (max allowed)
        contentTypes: ['video', 'text', 'assignment', 'ide'],
        objectives: [
          'Master CSS Grid and Flexbox',
          'Create responsive designs',
          'Add CSS animations and transitions'
        ],
        assignmentData: {
          title: 'Style Your Portfolio with CSS3',
          description: 'Enhance your portfolio page with modern CSS3 styling and responsive design.',
          requirements: [
            'Use CSS Grid or Flexbox for layout',
            'Implement responsive design with media queries',
            'Add CSS animations and transitions',
            'Use CSS custom properties (variables)',
            'Ensure mobile-first approach'
          ],
          dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
          maxPoints: 100
        },
        codeData: {
          language: 'css',
          starterCode: `/* Your CSS styles here */
:root {
    --primary-color: #007bff;
    --secondary-color: #6c757d;
    --font-family: 'Arial', sans-serif;
}

body {
    font-family: var(--font-family);
    margin: 0;
    padding: 0;
}

/* Add your styles below */`,
          tests: [
            {
              id: 1,
              name: 'Responsive Design Test',
              description: 'Check if the design is responsive',
              input: 'CSS content',
              expectedOutput: 'Mobile-responsive layout'
            }
          ]
        }
      },
      {
        title: 'JavaScript ES6+ Fundamentals',
        description: 'Learn modern JavaScript features including ES6+, DOM manipulation, and async programming.',
        content: `# JavaScript ES6+ Fundamentals

Modern JavaScript has evolved significantly with ES6+ features.

## ES6+ Features

### Arrow Functions
\`\`\`javascript
// Traditional function
function add(a, b) {
    return a + b;
}

// Arrow function
const add = (a, b) => a + b;
\`\`\`

### Destructuring
\`\`\`javascript
const person = { name: 'John', age: 30, city: 'New York' };
const { name, age } = person;
console.log(name, age); // John 30
\`\`\`

### Template Literals
\`\`\`javascript
const name = 'John';
const greeting = \`Hello, \${name}! Welcome to our website.\`;
\`\`\`

### Promises and Async/Await
\`\`\`javascript
// Using Promises
fetch('/api/data')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));

// Using Async/Await
async function fetchData() {
    try {
        const response = await fetch('/api/data');
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error(error);
    }
}
\`\`\`

## DOM Manipulation
\`\`\`javascript
// Select elements
const button = document.querySelector('#myButton');
const container = document.getElementById('container');

// Add event listeners
button.addEventListener('click', () => {
    container.innerHTML = '<p>Button clicked!</p>';
});
\`\`\`

## Practice Exercise
Build an interactive calculator with modern JavaScript.`,
        order: 4,
        isFree: false,
        isPublished: true,
        videoUrl: '/videos/javascript-es6.mp4',
        videoDuration: 1200, // 20 minutes (max allowed)
        contentTypes: ['video', 'text', 'assignment', 'ide', 'quiz'],
        objectives: [
          'Master ES6+ JavaScript features',
          'Understand async programming',
          'Build interactive web applications'
        ],
        quizData: {
          questions: [
            {
              id: 1,
              question: 'What does the spread operator (...) do in JavaScript?',
              type: 'multiple-choice',
              options: [
                'Creates a new array with all elements',
                'Spreads array elements as individual arguments',
                'Combines two arrays',
                'All of the above'
              ],
              correctAnswer: 3,
              explanation: 'The spread operator can be used to create new arrays, spread elements as arguments, and combine arrays.'
            },
            {
              id: 2,
              question: 'What is the main difference between let and var?',
              type: 'multiple-choice',
              options: [
                'let has block scope, var has function scope',
                'var has block scope, let has function scope',
                'There is no difference',
                'let is faster than var'
              ],
              correctAnswer: 0,
              explanation: 'let has block scope while var has function scope, making let more predictable.'
            }
          ]
        },
        assignmentData: {
          title: 'Build an Interactive Calculator',
          description: 'Create a fully functional calculator using modern JavaScript ES6+ features.',
          requirements: [
            'Use ES6+ features (arrow functions, template literals, destructuring)',
            'Implement all basic operations (+, -, *, /)',
            'Add keyboard support',
            'Include error handling',
            'Use modern DOM manipulation techniques'
          ],
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
          maxPoints: 100
        },
        codeData: {
          language: 'javascript',
          starterCode: `// Interactive Calculator
class Calculator {
    constructor() {
        this.display = document.getElementById('display');
        this.currentInput = '';
        this.previousInput = '';
        this.operation = null;
    }

    // Add your methods here
    addNumber(number) {
        // TODO: Implement number input
    }

    addOperation(operation) {
        // TODO: Implement operation selection
    }

    calculate() {
        // TODO: Implement calculation logic
    }

    clear() {
        // TODO: Implement clear functionality
    }
}

// Initialize calculator
const calculator = new Calculator();`,
          tests: [
            {
              id: 1,
              name: 'Addition Test',
              description: 'Test basic addition functionality',
              input: '2 + 3',
              expectedOutput: '5'
            },
            {
              id: 2,
              name: 'Division Test',
              description: 'Test division with decimal result',
              input: '10 / 3',
              expectedOutput: '3.3333333333333335'
            }
          ]
        }
      }
    ];

    // Create lessons
    console.log('📖 Creating lessons...');
    for (const lessonData of lessons) {
      const lesson = await models.Lesson.create({
        courseId: course.id,
        ...lessonData
      });
      console.log(`✅ Lesson created: ${lesson.title}`);
    }

    // Create a forum for the course
    console.log('💬 Creating course forum...');
    const forum = await models.Forum.create({
      courseId: course.id,
      title: 'Web Development Discussion',
      description: 'Discuss web development topics, ask questions, and share resources with fellow students.',
      isActive: true,
      allowStudentPosts: true,
      requireApproval: false
    });
    console.log('✅ Forum created:', forum.title);

    // Create some sample forum posts
    const samplePosts = [
      {
        title: 'Welcome to the Web Development Course!',
        content: 'Welcome everyone! Feel free to introduce yourself and share your web development goals.',
        authorId: instructor.id,
        forumId: forum.id,
        isPinned: true
      },
      {
        title: 'HTML vs HTML5 - What\'s the difference?',
        content: 'Can someone explain the main differences between HTML and HTML5? I\'m a bit confused about the new features.',
        authorId: instructor.id,
        forumId: forum.id
      },
      {
        title: 'Best VS Code extensions for web development',
        content: 'Here are some must-have VS Code extensions that will make your web development journey easier:\n\n1. Live Server - for local development\n2. Prettier - for code formatting\n3. ES7+ React/Redux/React-Native snippets\n4. Auto Rename Tag\n5. Bracket Pair Colorizer',
        authorId: instructor.id,
        forumId: forum.id
      }
    ];

    for (const postData of samplePosts) {
      await models.ForumPost.create(postData);
    }
    console.log('✅ Sample forum posts created');

    // Create lab sessions for IDE practice
    console.log('💻 Creating lab sessions...');
    const labSessions = [
      {
        title: 'HTML Practice Lab',
        description: 'Practice HTML fundamentals with hands-on coding exercises.',
        courseId: course.id,
        instructorId: instructor.id,
        startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours duration
        maxParticipants: 20,
        isActive: true,
        labTemplate: {
          language: 'html',
          starterCode: '<!DOCTYPE html>\n<html>\n<head>\n    <title>Practice Lab</title>\n</head>\n<body>\n    <!-- Start coding here -->\n</body>\n</html>',
          instructions: 'Create a complete HTML page with semantic elements and a contact form.',
          tests: [
            {
              name: 'HTML Structure',
              description: 'Check for proper HTML5 structure',
              expectedOutput: 'Valid HTML document'
            }
          ]
        }
      },
      {
        title: 'JavaScript Interactive Lab',
        description: 'Build interactive features with JavaScript in our online IDE.',
        courseId: course.id,
        instructorId: instructor.id,
        startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // 3 hours duration
        maxParticipants: 15,
        isActive: true,
        labTemplate: {
          language: 'javascript',
          starterCode: '// JavaScript Practice Lab\n// Build an interactive to-do list application\n\nclass TodoApp {\n    constructor() {\n        this.todos = [];\n    }\n    \n    // Add your methods here\n}',
          instructions: 'Create a fully functional to-do list application with add, edit, delete, and mark complete features.',
          tests: [
            {
              name: 'Add Todo',
              description: 'Test adding new todos',
              expectedOutput: 'Todo added successfully'
            },
            {
              name: 'Delete Todo',
              description: 'Test deleting todos',
              expectedOutput: 'Todo deleted successfully'
            }
          ]
        }
      }
    ];

    for (const labData of labSessions) {
      await models.LabSession.create(labData);
    }
    console.log('✅ Lab sessions created');

    console.log('\n🎉 Course creation completed successfully!');
    console.log('\n📊 Course Summary:');
    console.log(`- Course: ${course.title}`);
    console.log(`- Price: $${course.price}`);
    console.log(`- Duration: ${course.duration} minutes`);
    console.log(`- Lessons: ${lessons.length}`);
    console.log(`- Forum: ${forum.title}`);
    console.log(`- Lab Sessions: ${labSessions.length}`);
    console.log(`- Instructor: ${instructor.firstName} ${instructor.lastName}`);

    console.log('\n🔗 Access the course:');
    console.log(`- Frontend: http://localhost:3000/courses`);
    console.log(`- Instructor Login: instructor@maiko.edu / instructor123`);

  } catch (error) {
    console.error('❌ Error creating course:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the script
createComputerCourse();
