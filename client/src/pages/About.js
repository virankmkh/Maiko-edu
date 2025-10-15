import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { 
  Users, 
  Globe, 
  BookOpen, 
  DollarSign, 
  Heart, 
  Target,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const About = () => {
  const { t } = useLanguage();

  const missionPoints = t('about.missionPoints', { returnObjects: true });
  
  // Ensure missionPoints is an array
  const safeMissionPoints = Array.isArray(missionPoints) ? missionPoints : [];

  const values = [
    {
      icon: Heart,
      title: t('about.values.communityFirst.title'),
      description: t('about.values.communityFirst.description')
    },
    {
      icon: Target,
      title: t('about.values.excellence.title'),
      description: t('about.values.excellence.description')
    },
    {
      icon: Globe,
      title: t('about.values.globalReach.title'),
      description: t('about.values.globalReach.description')
    },
    {
      icon: Users,
      title: t('about.values.inclusivity.title'),
      description: t('about.values.inclusivity.description')
    }
  ];

  const paymentMethods = [
    { name: 'PayPal', icon: '💳' },
    { name: 'Visa/Mastercard', icon: '💳' },
    { name: 'Orange Money', icon: '📱' },
    { name: 'M-Pesa', icon: '📱' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              {t('about.title').split('Maiko EDU').map((part, index) => 
                index === 0 ? part : (
                  <React.Fragment key={index}>
                    <span className="text-primary-600">Maiko EDU</span>
                    {part}
                  </React.Fragment>
                )
              )}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {t('about.subtitle')}
            </p>
            <div className="inline-flex items-center px-6 py-3 bg-accent-500 text-white rounded-full text-lg font-semibold">
              🇨🇩 {t('home.congoleseDiaspora')}
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {t('about.ourStory')}
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                {t('about.storyText1')}
              </p>
              <p className="text-lg text-gray-600 mb-6">
                {t('about.storyText2')}
              </p>
              <p className="text-lg text-gray-600 mb-6">
                {t('about.storyText3')}
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary-100 to-secondary-100 p-8 rounded-2xl">
              <div className="text-center">
                <div className="text-6xl mb-4">🇨🇩</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('home.congoleseDiaspora')}
                </h3>
                <p className="text-gray-600">
                  {t('about.fromSocialToImpact')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('about.ourMission')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('about.missionSubtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="inline-flex p-3 rounded-full bg-primary-100 mb-4">
                  <value.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              {t('about.whatWeOffer')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-primary-600" />
                  {t('about.comprehensiveLibrary')}
                </h4>
                <ul className="space-y-2">
                  {safeMissionPoints.map((point, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-secondary-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-accent-600" />
                  {t('about.affordablePricing')}
                </h4>
                <p className="text-gray-600 mb-4">
                  {t('about.pricingText')}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {paymentMethods.map((method, index) => (
                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-2xl mr-2">{method.icon}</span>
                      <span className="text-sm font-medium text-gray-700">{method.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Affiliate Program Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('home.earnWhileYouLearn')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('home.earnWhileYouLearnSubtitle')}
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">
              {t('about.joinAffiliateProgram')}
            </h3>
            <p className="text-lg mb-6 opacity-90">
              {t('about.joinAffiliateSubtitle')}
            </p>
            <Link
              to="/affiliate/dashboard"
              className="inline-flex items-center bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              {t('home.learnMore')}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-accent-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {t('about.readyToJoin')}
          </h2>
          <p className="text-xl text-accent-100 mb-8 max-w-2xl mx-auto">
            {t('about.readyToJoinSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-accent-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              {t('about.getStartedToday')}
            </Link>
            <Link
              to="/courses"
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-accent-600 transition-colors"
            >
              {t('about.exploreCourses')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
