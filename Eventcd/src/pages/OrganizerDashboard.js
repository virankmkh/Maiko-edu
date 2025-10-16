import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { 
  Calendar, 
  Plus, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Settings,
  LogOut,
  Eye,
  Edit,
  Trash2,
  BarChart3
} from 'lucide-react';
import { format } from 'date-fns';
import { eventsAPI, authAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const OrganizerDashboard = () => {
  const navigate = useNavigate();
  const [organizer, setOrganizer] = useState(null);

  useEffect(() => {
    const storedOrganizer = localStorage.getItem('organizer');
    if (storedOrganizer) {
      setOrganizer(JSON.parse(storedOrganizer));
    } else {
      navigate('/organizer/login');
    }
  }, [navigate]);

  // Fetch organizer's events
  const { data: eventsData, isLoading, refetch } = useQuery(
    'organizerEvents',
    () => eventsAPI.getEvents({ organizerId: organizer?.id }),
    {
      enabled: !!organizer?.id,
    }
  );

  const handleLogout = () => {
    localStorage.removeItem('organizerToken');
    localStorage.removeItem('organizer');
    navigate('/organizer/login');
  };

  const getEventStatus = (event) => {
    const now = new Date();
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);

    if (now > endDate) return { status: 'completed', color: 'bg-gray-100 text-gray-800' };
    if (now < startDate) return { status: 'upcoming', color: 'bg-blue-100 text-blue-800' };
    return { status: 'live', color: 'bg-green-100 text-green-800' };
  };

  if (!organizer) return <LoadingSpinner size="lg" className="min-h-screen" />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="bg-blue-600 p-2 rounded-lg mr-4">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">Welcome back, {organizer.name}!</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Events</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {eventsData?.data?.length || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Attendees</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {eventsData?.data?.reduce((sum, event) => sum + event.currentAttendees, 0) || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">$0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Events</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {eventsData?.data?.filter(event => {
                    const now = new Date();
                    const startDate = new Date(event.startDate);
                    const endDate = new Date(event.endDate);
                    return now >= startDate && now <= endDate;
                  }).length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Events Section */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Your Events</h2>
              <Link
                to="/organizer/events/create"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Link>
            </div>
          </div>

          <div className="p-6">
            {isLoading ? (
              <LoadingSpinner />
            ) : eventsData?.data?.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
                <p className="text-gray-600 mb-6">Get started by creating your first event</p>
                <Link
                  to="/organizer/events/create"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Event
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {eventsData?.data?.map((event) => {
                  const eventStatus = getEventStatus(event);
                  
                  return (
                    <div key={event.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      {/* Event Image */}
                      <div className="relative h-48 bg-gray-200">
                        {event.coverImage ? (
                          <img
                            src={event.coverImage}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                            <Calendar className="h-12 w-12 text-white" />
                          </div>
                        )}
                        
                        {/* Status Badge */}
                        <div className="absolute top-4 left-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${eventStatus.color}`}>
                            {eventStatus.status === 'live' ? 'Live' : eventStatus.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                          </span>
                        </div>

                        {/* Price Badge */}
                        <div className="absolute top-4 right-4">
                          <span className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-900 shadow-sm">
                            {event.isFree ? 'Free' : `${event.currency} ${event.price}`}
                          </span>
                        </div>
                      </div>

                      {/* Event Content */}
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                            {event.category}
                          </span>
                          <span className="text-sm text-gray-500">
                            {event.eventType}
                          </span>
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                          {event.title}
                        </h3>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {event.shortDescription || event.description}
                        </p>

                        {/* Event Details */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            {format(new Date(event.startDate), 'MMM dd, yyyy')}
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="h-4 w-4 mr-2" />
                            {event.currentAttendees} attendees
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-2">
                          <Link
                            to={`/event/${event.id}`}
                            className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Link>
                          <button className="px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
