import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';

// Pages
import LandingPage from './pages/LandingPage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import OrganizerDashboard from './pages/OrganizerDashboard';
import OrganizerLogin from './pages/OrganizerLogin';
import OrganizerRegister from './pages/OrganizerRegister';
import RegistrationSuccess from './pages/RegistrationSuccess';
import CheckInPage from './pages/CheckInPage';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/event/:id" element={<EventDetailPage />} />
            <Route path="/event/slug/:slug" element={<EventDetailPage />} />
            <Route path="/registration/success" element={<RegistrationSuccess />} />
            <Route path="/check-in" element={<CheckInPage />} />
            
            {/* Organizer Routes */}
            <Route path="/organizer/login" element={<OrganizerLogin />} />
            <Route path="/organizer/register" element={<OrganizerRegister />} />
            <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
          </Routes>
          
          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
