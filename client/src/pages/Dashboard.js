import React from 'react';
import { useAuth } from '../context/AuthContext';
import InstructorDashboard from './InstructorDashboard';
import StudentDashboard from './StudentDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  // Route to appropriate dashboard based on user role
  if (user?.role === 'instructor') {
    return <InstructorDashboard />;
  }
  
  // Default to student dashboard for students and other roles
  return <StudentDashboard />;
};

export default Dashboard;