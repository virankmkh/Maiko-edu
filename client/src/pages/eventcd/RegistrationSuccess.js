import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Calendar, Download, Share2 } from 'lucide-react';

const RegistrationSuccess = () => {
  const location = useLocation();
  const registration = location.state?.registration;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Registration Successful!
          </h1>
          <p className="text-gray-600 mb-8">
            You have successfully registered for the event. Check your email for confirmation details.
          </p>
        </div>

        {registration && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Registration Details</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Registration ID:</span>
                <span className="font-medium">{registration.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium text-green-600 capitalize">{registration.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount Paid:</span>
                <span className="font-medium">{registration.currency} {registration.amountPaid}</span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <Link
            to="/events"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Calendar className="h-5 w-5 mr-2" />
            Browse More Events
          </Link>
          
          <div className="flex space-x-4">
            <button className="flex-1 flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Download className="h-4 w-4 mr-2" />
              Download Ticket
            </button>
            <button className="flex-1 flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationSuccess;
