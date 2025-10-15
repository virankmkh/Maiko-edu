# 🎓 Maiko EDU - Comprehensive E-Learning Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-18.0.0-blue.svg)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13+-blue.svg)](https://www.postgresql.org/)

## 🌟 **Overview**

Maiko EDU is a comprehensive, full-stack e-learning platform built with modern web technologies. It provides a complete solution for online education with features including course management, video conferencing, interactive content, networking labs, and more.

## 🚀 **Key Features**

### **👥 Multi-Role System**
- **Students**: Course enrollment, progress tracking, certificates
- **Instructors**: Course creation, student management, analytics
- **Organization Admins**: Institution management, instructor oversight
- **System Admins**: Platform administration and configuration

### **📚 Course Management**
- Interactive course creation and editing
- Multi-media content support (videos, documents, quizzes)
- Progress tracking and analytics
- Certificate generation upon completion

### **🎥 Video Conferencing**
- **Jitsi Meet Integration**: Professional video calls with up to 100 participants
- Screen sharing and recording capabilities
- Mobile-optimized interface
- Real-time collaboration tools

### **🎮 Interactive Content (H5P)**
- Interactive videos with embedded questions
- Drag & drop activities
- Advanced quizzes and assessments
- Gamified learning experiences
- Mobile-optimized content

### **💻 Online IDE**
- Multi-language support (JavaScript, Python, Java, C++, etc.)
- Code execution in sandbox environment
- Code snippet saving and sharing
- Real-time collaboration (future feature)

### **🔬 Networking Labs**
- Virtual networking environment
- Device simulation and configuration
- Terminal access for hands-on learning
- Template-based lab creation

### **🌍 Internationalization**
- English and French language support
- RTL support for Arabic (future)
- Localized content and UI
- i18next integration

### **💰 Payment Integration**
- PayPal integration for course payments
- Affiliate marketing system
- Commission tracking and management
- Subscription-based access

### **📊 Analytics & Reporting**
- Matomo analytics integration
- Student progress tracking
- Course performance metrics
- Instructor analytics dashboard

## 🏗️ **Technology Stack**

### **Frontend**
- **React 18** - Modern JavaScript library
- **JavaScript ES6+** - No TypeScript, pure JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Context API** - State management
- **Lucide React** - Icon library

### **Backend**
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **PostgreSQL** - Relational database
- **Sequelize** - ORM for database operations
- **JWT** - Authentication and authorization
- **Socket.io** - Real-time communication

### **External Services**
- **Jitsi Meet** - Video conferencing
- **H5P** - Interactive content creation
- **Matomo** - Analytics and tracking
- **PayPal** - Payment processing

## 📁 **Project Structure**

```
Maiko-edu/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React Context providers
│   │   ├── assets/        # Static assets
│   │   └── App.js         # Main application component
│   ├── public/            # Public assets
│   └── package.json       # Frontend dependencies
├── server/                # Node.js backend application
│   ├── routes/            # API route handlers
│   ├── models/            # Database models
│   ├── middleware/        # Custom middleware
│   ├── services/          # Business logic services
│   ├── config/            # Configuration files
│   └── index.js           # Main server file
├── docs/                  # Documentation files
└── README.md              # This file
```

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js (v18 or higher)
- PostgreSQL (v13 or higher)
- Git

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/virankmkh/Maiko-edu.git
   cd Maiko-edu
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   npm install
   
   # Install frontend dependencies
   cd client
   npm install
   cd ..
   ```

3. **Environment Setup**
   ```bash
   # Copy environment template
   cp env-template.txt .env
   
   # Edit .env file with your configuration
   # Set up PostgreSQL connection, JWT secret, etc.
   ```

4. **Database Setup**
   ```bash
   # Start PostgreSQL service
   # Create database and run migrations
   npm run db:setup
   ```

5. **Start the application**
   ```bash
   # Start backend server (port 5001)
   npm start
   
   # In another terminal, start frontend (port 3000)
   cd client
   npm start
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001

## 🧪 **Test Accounts**

### **Student Account**
- **Email**: `vn@adn.presidence.cd`
- **Password**: `password123`
- **Role**: Student

### **Instructor Account**
- **Email**: `sarah.johnson@lecturer.com`
- **Password**: `lecturer123`
- **Role**: Instructor

### **Organization Admin**
- **Email**: `jean.mukamba@techacademy-drc.com`
- **Password**: `admin123`
- **Role**: Organization Admin

## 📖 **API Documentation**

### **Authentication Endpoints**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### **Course Endpoints**
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create new course
- `GET /api/courses/:id` - Get course details
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

### **Enrollment Endpoints**
- `POST /api/enrollments` - Enroll in course
- `GET /api/enrollments` - Get user enrollments
- `GET /api/enrollments/:id/progress` - Get course progress

### **Jitsi Endpoints**
- `GET /api/jitsi/config` - Get Jitsi configuration
- `POST /api/jitsi/rooms` - Create new room
- `GET /api/jitsi/rooms/:roomName` - Get room info
- `DELETE /api/jitsi/rooms/:roomName` - End room

## 🔧 **Development**

### **Available Scripts**
```bash
# Backend scripts
npm start              # Start production server
npm run dev            # Start development server
npm run db:setup       # Setup database
npm run db:migrate     # Run database migrations
npm run db:seed        # Seed database with sample data

# Frontend scripts
cd client
npm start              # Start development server
npm run build          # Build for production
npm test               # Run tests
```

### **Code Style**
- ESLint configuration for code quality
- Prettier for code formatting
- Consistent naming conventions
- Comprehensive error handling

## 🚀 **Deployment**

### **Production Build**
```bash
# Build frontend
cd client
npm run build

# Start production server
cd ..
npm start
```

### **Environment Variables**
Set the following environment variables for production:
- `NODE_ENV=production`
- `PORT=5001`
- `JWT_SECRET=your-secret-key`
- `DATABASE_URL=your-postgresql-url`
- `CLIENT_URL=https://your-domain.com`

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 **Support**

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation in the `/docs` folder
- Review the troubleshooting guide

## 🎯 **Roadmap**

### **Phase 1** ✅ **COMPLETED**
- [x] Jitsi Meet integration
- [x] Basic course management
- [x] User authentication system
- [x] Multi-role dashboard system

### **Phase 2** 🔄 **IN PROGRESS**
- [x] H5P interactive content integration
- [ ] Advanced quiz system
- [ ] Assignment management
- [ ] Grade book functionality

### **Phase 3** 📋 **PLANNED**
- [ ] Matomo analytics integration
- [ ] Open Badges system
- [ ] Mobile app development
- [ ] Advanced reporting

### **Phase 4** 🔮 **FUTURE**
- [ ] AI-powered content recommendations
- [ ] Advanced collaboration tools
- [ ] Blockchain-based certificates
- [ ] VR/AR learning experiences

## 🙏 **Acknowledgments**

- **Jitsi Meet** for video conferencing capabilities
- **H5P** for interactive content creation
- **React** and **Node.js** communities
- **PostgreSQL** for reliable database management
- **Tailwind CSS** for beautiful UI components

---

**Built with ❤️ for the future of education**

*Last Updated: January 2025*