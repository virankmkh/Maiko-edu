import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const OrganizationDashboard = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('organization.title')} Dashboard
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Manage your educational organization
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Organization Dashboard Coming Soon
          </h2>
          <p className="text-gray-600">
            This page will allow organization admins to manage courses, instructors, students, and analytics.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrganizationDashboard;
