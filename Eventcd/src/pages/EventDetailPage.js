import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Globe, 
  Share2, 
  Heart,
  ArrowLeft,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { format, isAfter, isBefore, addDays } from 'date-fns';
import { eventsAPI, registrationsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const EventDetailPage = () => {
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);

  // Fetch event data
  const { data: eventData, isLoading, error } = useQuery(
    ['event', id, slug],
    () => {
      if (slug) {
        return eventsAPI.getEventBySlug(slug);
      }
      return eventsAPI.getEvent(id);
    },
    {
      enabled: !!(id || slug),
    }
  );

  // Registration mutation
  const registrationMutation = useMutation(
    (data) => registrationsAPI.createRegistration(data),
    {
      onSuccess: (response) => {
        toast.success('Registration successful!');
        navigate('/registration/success', { 
          state: { registration: response.data } 
        });
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Registration failed');
      },
    }
  );

  // Form for registration
  const { register, handleSubmit, formState: { errors } } = useForm();

  if (isLoading) return <LoadingSpinner size="lg" className="min-h-screen" />;
  if (error) return <div className="text-center py-12">Event not found</div>;

  const event = eventData?.data;
  if (!event) return <div className="text-center py-12">Event not found</div>;

  const isRegistrationOpen = () => {
    const now = new Date();
    const regStart = event.registrationStartDate ? new Date(event.registrationStartDate) : new Date(event.createdAt);
    const regEnd = event.registrationEndDate ? new Date(event.registrationEndDate) : new Date(event.startDate);
    return now >= regStart && now <= regEnd && event.status === 'published';
  };

  const isFullyBooked = () => {
    return event.maxAttendees && event.currentAttendees >= event.maxAttendees;
  };

  const getAvailableSpots = () => {
    if (!event.maxAttendees) return null;
    return Math.max(0, event.maxAttendees - event.currentAttendees);
  };

  const handleRegistration = async (data) => {
    if (!selectedTicket) {
      toast.error('Please select a ticket');
      return;
    }

    setIsRegistering(true);
    try {
      await registrationMutation.mutateAsync({
        eventId: event.id,
        ticketId: selectedTicket.id,
        attendeeName: data.attendeeName,
        attendeeEmail: data.attendeeEmail,
        attendeePhone: data.attendeePhone,
        customFields: {}
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const canRegister = isRegistrationOpen() && !isFullyBooked();
  const availableSpots = getAvailableSpots();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Events
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Event Image */}
            <div className="relative h-64 md:h-96 bg-gray-200 rounded-lg overflow-hidden mb-8">
              {event.coverImage ? (
                <img
                  src={event.coverImage}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                  <Calendar className="h-16 w-16 text-white" />
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex space-x-2">
                <button className="bg-white/90 hover:bg-white p-2 rounded-full shadow-sm transition-colors">
                  <Heart className="h-5 w-5 text-gray-600" />
                </button>
                <button className="bg-white/90 hover:bg-white p-2 rounded-full shadow-sm transition-colors">
                  <Share2 className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Event Info */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {event.category}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                    {event.eventType}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {event.isFree ? 'Free' : `${event.currency} ${event.price}`}
                  </div>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {event.title}
              </h1>

              <p className="text-gray-600 text-lg mb-6">
                {event.description}
              </p>

              {/* Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-gray-400 mt-1 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">
                        {format(new Date(event.startDate), 'EEEE, MMMM dd, yyyy')}
                      </div>
                      <div className="text-sm text-gray-600">
                        {format(new Date(event.startDate), 'h:mm a')} - {format(new Date(event.endDate), 'h:mm a')}
                      </div>
                    </div>
                  </div>

                  {event.venue && (
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-gray-400 mt-1 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">{event.venue}</div>
                        {event.address && (
                          <div className="text-sm text-gray-600">{event.address}</div>
                        )}
                        {(event.city || event.country) && (
                          <div className="text-sm text-gray-600">
                            {event.city && event.country ? `${event.city}, ${event.country}` : event.city || event.country}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {event.onlineLink && (
                    <div className="flex items-start">
                      <Globe className="h-5 w-5 text-gray-400 mt-1 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">Online Event</div>
                        <a
                          href={event.onlineLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Join Online
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">
                        {event.currentAttendees} attendees
                      </div>
                      {availableSpots !== null && (
                        <div className="text-sm text-gray-600">
                          {availableSpots} spots remaining
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">
                        {event.timezone}
                      </div>
                      <div className="text-sm text-gray-600">
                        Timezone
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Registration Status */}
              <div className="mt-6 p-4 rounded-lg border">
                {!isRegistrationOpen() && (
                  <div className="flex items-center text-amber-600">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    <span className="font-medium">Registration is not currently open</span>
                  </div>
                )}
                {isFullyBooked() && (
                  <div className="flex items-center text-red-600">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    <span className="font-medium">This event is fully booked</span>
                  </div>
                )}
                {canRegister && (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <span className="font-medium">Registration is open</span>
                  </div>
                )}
              </div>
            </div>

            {/* Organizer Info */}
            {event.Organizer && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Organizer</h3>
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                    {event.Organizer.logo ? (
                      <img
                        src={event.Organizer.logo}
                        alt={event.Organizer.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-medium text-gray-600">
                        {event.Organizer.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {event.Organizer.companyName || event.Organizer.name}
                    </h4>
                    {event.Organizer.description && (
                      <p className="text-gray-600 text-sm mt-1">
                        {event.Organizer.description}
                      </p>
                    )}
                    {event.Organizer.website && (
                      <a
                        href={event.Organizer.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Visit Website
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Registration Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Register for Event</h3>
              
              {!canRegister ? (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    {!isRegistrationOpen() ? 'Registration is not currently open' : 'This event is fully booked'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(handleRegistration)} className="space-y-4">
                  {/* Ticket Selection */}
                  {event.Tickets && event.Tickets.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Ticket
                      </label>
                      <div className="space-y-2">
                        {event.Tickets.map((ticket) => (
                          <label
                            key={ticket.id}
                            className={`block p-3 border rounded-lg cursor-pointer transition-colors ${
                              selectedTicket?.id === ticket.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <input
                              type="radio"
                              name="ticket"
                              value={ticket.id}
                              checked={selectedTicket?.id === ticket.id}
                              onChange={() => setSelectedTicket(ticket)}
                              className="sr-only"
                            />
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-medium text-gray-900">{ticket.name}</div>
                                {ticket.description && (
                                  <div className="text-sm text-gray-600">{ticket.description}</div>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="font-medium text-gray-900">
                                  {ticket.isFree ? 'Free' : `${ticket.currency} ${ticket.price}`}
                                </div>
                                {ticket.quantityAvailable && (
                                  <div className="text-sm text-gray-600">
                                    {ticket.quantityAvailable - ticket.quantitySold} left
                                  </div>
                                )}
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Registration Form */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      {...register('attendeeName', { required: 'Name is required' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.attendeeName && (
                      <p className="text-red-600 text-sm mt-1">{errors.attendeeName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      {...register('attendeeEmail', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.attendeeEmail && (
                      <p className="text-red-600 text-sm mt-1">{errors.attendeeEmail.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      {...register('attendeePhone')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isRegistering || !selectedTicket}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isRegistering ? 'Registering...' : 'Register Now'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
