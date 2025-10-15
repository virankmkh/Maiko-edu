import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { Toaster } from 'react-hot-toast';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PrivateRoute from './components/PrivateRoute';
import ErrorBoundary from './components/ErrorBoundary';

// Pages
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import About from './pages/About';
import Team from './pages/Team';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import InstructorDashboard from './pages/InstructorDashboard';
import Profile from './pages/Profile';
import CoursePlayer from './pages/CoursePlayer';
import IDE from './pages/IDE';
import OrganizationDashboard from './pages/OrganizationDashboard';
import AffiliateDashboard from './pages/AffiliateDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LabPage from './pages/LabPage';
import LabManagement from './pages/LabManagement';
import BusinessEntrepreneurship from './pages/BusinessEntrepreneurship';
import TestError from './components/TestError';
import JitsiTest from './components/JitsiTest';
import H5PTest from './components/H5PTest';
import CourseCreationTest from './pages/CourseCreationTest';
import CoursePlayerDebug from './pages/CoursePlayerDebug';
import DebugLoader from './components/DebugLoader';
import VirankLanding from './pages/VirankLanding';
import EventCDLanding from './pages/eventcd/EventCDLanding';
import OrganizerLogin from './pages/eventcd/OrganizerLogin';
import OrganizerRegister from './pages/eventcd/OrganizerRegister';

// Wrapper component to conditionally render Navbar
const AppContent = () => {
  const location = useLocation();
  const isVirankLanding = location.pathname === '/';
  const isEventCD = location.pathname.startsWith('/eventcd');
  
  // Update favicon based on current page
  React.useEffect(() => {
    const favicon = document.querySelector('link[rel="icon"]');
    if (isEventCD) {
      if (favicon) {
        favicon.href = '/eventcd-favicon.png';
      } else {
        const link = document.createElement('link');
        link.rel = 'icon';
        link.href = '/eventcd-favicon.png';
        document.head.appendChild(link);
      }
    } else {
      if (favicon) {
        favicon.href = '/favicon.ico';
      }
    }
  }, [isEventCD]);
  
  return (
    <div className="App flex flex-col min-h-screen">
      <DebugLoader />
      {!isVirankLanding && !isEventCD && <Navbar />}
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<VirankLanding />} />
          <Route path="/eventcd" element={<EventCDLanding />} />
          <Route path="/eventcd/login" element={<OrganizerLogin />} />
          <Route path="/eventcd/register" element={<OrganizerRegister />} />
          <Route path="/maiko-edu" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/team" element={<Team />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/business-entrepreneurship" element={<BusinessEntrepreneurship />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/test-error" element={<TestError />} />
          <Route path="/jitsi-test" element={<JitsiTest />} />
          <Route path="/h5p-test" element={<H5PTest />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/instructor/dashboard" element={
            <PrivateRoute requiredRole="instructor">
              <InstructorDashboard />
            </PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
          <Route path="/course/:id/play" element={
            <PrivateRoute>
              <CoursePlayer />
            </PrivateRoute>
          } />
          <Route path="/ide" element={
            <PrivateRoute>
              <IDE />
            </PrivateRoute>
          } />
          <Route path="/organization/dashboard" element={
            <PrivateRoute requiredRole="organization_admin">
              <OrganizationDashboard />
            </PrivateRoute>
          } />
          <Route path="/affiliate/dashboard" element={
            <PrivateRoute>
              <AffiliateDashboard />
            </PrivateRoute>
          } />
          <Route path="/admin/dashboard" element={
            <PrivateRoute requiredRole="organization_admin">
              <AdminDashboard />
            </PrivateRoute>
          } />
          <Route path="/debug/course-creation" element={
            <PrivateRoute>
              <CourseCreationTest />
            </PrivateRoute>
          } />
          <Route path="/debug/course-player/:id" element={
            <PrivateRoute>
              <CoursePlayerDebug />
            </PrivateRoute>
          } />
          <Route path="/lab/:courseId/:templateId" element={
            <PrivateRoute>
              <LabPage />
            </PrivateRoute>
          } />
          <Route path="/labs/management" element={
            <PrivateRoute requiredRole="instructor">
              <LabManagement />
            </PrivateRoute>
          } />
        </Routes>
      </main>
      {!isVirankLanding && !isEventCD && <Footer />}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <AppContent />
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
