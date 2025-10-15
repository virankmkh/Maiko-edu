import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, Users } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Privacy = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('privacy.title')}
            </h1>
            <p className="text-gray-600">
              {t('privacy.lastUpdated')} {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <h2>{t('privacy.informationWeCollect.title')}</h2>
            <p>
              {t('privacy.informationWeCollect.description')}
            </p>
            <ul>
              <li><strong>{t('privacy.informationWeCollect.personalInfo')}</strong> {t('privacy.informationWeCollect.personalInfoDesc')}</li>
              <li><strong>{t('privacy.informationWeCollect.professionalInfo')}</strong> {t('privacy.informationWeCollect.professionalInfoDesc')}</li>
              <li><strong>{t('privacy.informationWeCollect.paymentInfo')}</strong> {t('privacy.informationWeCollect.paymentInfoDesc')}</li>
              <li><strong>{t('privacy.informationWeCollect.usageData')}</strong> {t('privacy.informationWeCollect.usageDataDesc')}</li>
            </ul>

            <h2>{t('privacy.howWeUseInfo.title')}</h2>
            <p>{t('privacy.howWeUseInfo.description')}</p>
            <ul>
              <li>{t('privacy.howWeUseInfo.provideServices')}</li>
              <li>{t('privacy.howWeUseInfo.processPayments')}</li>
              <li>{t('privacy.howWeUseInfo.sendUpdates')}</li>
              <li>{t('privacy.howWeUseInfo.customerSupport')}</li>
              <li>{t('privacy.howWeUseInfo.improvePlatform')}</li>
              <li>{t('privacy.howWeUseInfo.legalCompliance')}</li>
            </ul>

            <h2>{t('privacy.dataSecurity.title')}</h2>
            <p>
              {t('privacy.dataSecurity.description')}
            </p>
            <ul>
              <li>{t('privacy.dataSecurity.encryption')}</li>
              <li>{t('privacy.dataSecurity.https')}</li>
              <li>{t('privacy.dataSecurity.audits')}</li>
              <li>{t('privacy.dataSecurity.limitedAccess')}</li>
              <li>{t('privacy.dataSecurity.secureStorage')}</li>
            </ul>

            <h2>{t('privacy.dataSharing.title')}</h2>
            <p>
              {t('privacy.dataSharing.description')}
            </p>
            <ul>
              <li><strong>{t('privacy.dataSharing.paymentProcessors')}</strong> {t('privacy.dataSharing.paymentProcessorsDesc')}</li>
              <li><strong>{t('privacy.dataSharing.serviceProviders')}</strong> {t('privacy.dataSharing.serviceProvidersDesc')}</li>
              <li><strong>{t('privacy.dataSharing.legalRequirements')}</strong> {t('privacy.dataSharing.legalRequirementsDesc')}</li>
              <li><strong>{t('privacy.dataSharing.withConsent')}</strong> {t('privacy.dataSharing.withConsentDesc')}</li>
            </ul>

            <h2>{t('privacy.yourRights.title')}</h2>
            <p>{t('privacy.yourRights.description')}</p>
            <ul>
              <li>{t('privacy.yourRights.accessInfo')}</li>
              <li>{t('privacy.yourRights.updateInfo')}</li>
              <li>{t('privacy.yourRights.deleteAccount')}</li>
              <li>{t('privacy.yourRights.optOut')}</li>
              <li>{t('privacy.yourRights.exportData')}</li>
            </ul>

            <h2>{t('privacy.dataRetention.title')}</h2>
            <p>
              {t('privacy.dataRetention.description')}
            </p>

            <h2>{t('privacy.cookies.title')}</h2>
            <p>
              {t('privacy.cookies.description')}
            </p>

            <h2>{t('privacy.childrenPrivacy.title')}</h2>
            <p>
              {t('privacy.childrenPrivacy.description')}
            </p>

            <h2>{t('privacy.internationalTransfers.title')}</h2>
            <p>
              {t('privacy.internationalTransfers.description')}
            </p>

            <h2>{t('privacy.policyChanges.title')}</h2>
            <p>
              {t('privacy.policyChanges.description')}
            </p>

            <div className="bg-primary-50 p-6 rounded-lg mt-8">
              <h3 className="text-primary-800 mb-2">{t('privacy.commitment.title')}</h3>
              <p className="text-primary-700">
                {t('privacy.commitment.description')}
              </p>
            </div>

            <div className="bg-accent-50 p-6 rounded-lg mt-6">
              <h3 className="text-accent-800 mb-2">{t('privacy.contactUs.title')}</h3>
              <p className="text-accent-700">
                {t('privacy.contactUs.description')}
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link
              to="/register"
              className="inline-flex items-center bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              <Users className="w-5 h-5 mr-2" />
              {t('privacy.joinCommunity')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
