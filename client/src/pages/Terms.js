import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, DollarSign, BookOpen } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Terms = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('terms.title')}
            </h1>
            <p className="text-gray-600">
              {t('terms.lastUpdated')} {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <h2>{t('terms.acceptanceOfTerms.title')}</h2>
            <p>
              {t('terms.acceptanceOfTerms.description')}
            </p>

            <h2>{t('terms.userAccounts.title')}</h2>
            <p>
              {t('terms.userAccounts.description')}
            </p>

            <h2>{t('terms.courseRegistration.title')}</h2>
            <p>
              {t('terms.courseRegistration.description')}
            </p>

            <h2>{t('terms.revenueSharing.title')}</h2>
            <ul>
              <li><strong>{t('terms.revenueSharing.organizations')}</strong> {t('terms.revenueSharing.organizationsDesc')}</li>
              <li><strong>{t('terms.revenueSharing.affiliate')}</strong> {t('terms.revenueSharing.affiliateDesc')}</li>
            </ul>

            <h2>{t('terms.dataPrivacy.title')}</h2>
            <p>
              {t('terms.dataPrivacy.description')}
            </p>

            <h2>{t('terms.courseAccess.title')}</h2>
            <p>
              {t('terms.courseAccess.description')}
            </p>

            <h2>{t('terms.refundPolicy.title')}</h2>
            <p>
              {t('terms.refundPolicy.description')}
            </p>

            <h2>{t('terms.prohibitedActivities.title')}</h2>
            <p>
              {t('terms.prohibitedActivities.description')}
            </p>

            <h2>{t('terms.termination.title')}</h2>
            <p>
              {t('terms.termination.description')}
            </p>

            <h2>{t('terms.changesToTerms.title')}</h2>
            <p>
              {t('terms.changesToTerms.description')}
            </p>

            <div className="bg-primary-50 p-6 rounded-lg mt-8">
              <h3 className="text-primary-800 mb-2">{t('terms.mission.title')}</h3>
              <p className="text-primary-700">
                {t('terms.mission.description')}
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link
              to="/register"
              className="inline-flex items-center bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              {t('terms.getStarted')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
