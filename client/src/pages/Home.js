import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { 
  BookOpen, 
  Users, 
  Award, 
  Globe, 
  Star, 
  ArrowRight,
  Play,
  Clock,
  User,
  CheckCircle,
  TrendingUp,
  UserPlus,
  Link as LinkIcon,
  Share2
} from 'lucide-react';

// TypewriterText Component for animated text
const TypewriterText = ({ text, speed = 100, className = "" }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout;
    
    const typeText = () => {
      if (!isDeleting) {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          setCurrentIndex(currentIndex + 1);
          timeout = setTimeout(typeText, speed);
        } else {
          // Start deleting after a pause
          timeout = setTimeout(() => {
            setIsDeleting(true);
            setCurrentIndex(text.length);
          }, 2000);
        }
      } else {
        if (currentIndex > 0) {
          setDisplayedText(text.slice(0, currentIndex - 1));
          setCurrentIndex(currentIndex - 1);
          timeout = setTimeout(typeText, speed / 2);
        } else {
          // Start typing again
          setIsDeleting(false);
          timeout = setTimeout(typeText, speed);
        }
      }
    };

    timeout = setTimeout(typeText, speed);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [text, speed, currentIndex, isDeleting]);

  return (
    <div className={className}>
      {displayedText}
      <span className="animate-pulse">|</span>
    </div>
  );
};

const Home = () => {
  const { t } = useLanguage();
  const [currentMessage, setCurrentMessage] = useState(0);


  // Alternate between learning and earning messages every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % 2);
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: BookOpen,
      title: t('home.features.diverseLibrary.title'),
      description: t('home.features.diverseLibrary.description')
    },
    {
      icon: Users,
      title: t('home.features.expertInstructors.title'),
      description: t('home.features.expertInstructors.description')
    },
    {
      icon: Award,
      title: t('home.features.industryCertifications.title'),
      description: t('home.features.industryCertifications.description')
    },
    {
      icon: Globe,
      title: t('home.features.flexibleLearning.title'),
      description: t('home.features.flexibleLearning.description')
    }
  ];

  const courseCategories = [
    {
      icon: '💼',
      title: t('home.courseCategories.business.title'),
      count: t('home.courseCategories.business.count'),
      description: t('home.courseCategories.business.description')
    },
    {
      icon: '💻',
      title: t('home.courseCategories.technology.title'),
      count: t('home.courseCategories.technology.count'),
      description: t('home.courseCategories.technology.description')
    },
    {
      icon: '🎨',
      title: t('home.courseCategories.arts.title'),
      count: t('home.courseCategories.arts.count'),
      description: t('home.courseCategories.arts.description')
    },
    {
      icon: '🌍',
      title: t('home.courseCategories.language.title'),
      count: t('home.courseCategories.language.count'),
      description: t('home.courseCategories.language.description')
    },
    {
      icon: '🏥',
      title: t('home.courseCategories.health.title'),
      count: t('home.courseCategories.health.count'),
      description: t('home.courseCategories.health.description')
    },
    {
      icon: '🌟',
      title: t('home.courseCategories.lifeSkills.title'),
      count: t('home.courseCategories.lifeSkills.count'),
      description: t('home.courseCategories.lifeSkills.description')
    }
  ];

  const earningSteps = [
    {
      icon: UserPlus,
      title: t('home.howToEarn.steps.step1.title'),
      description: t('home.howToEarn.steps.step1.description')
    },
    {
      icon: LinkIcon,
      title: t('home.howToEarn.steps.step2.title'),
      description: t('home.howToEarn.steps.step2.description')
    },
    {
      icon: Share2,
      title: t('home.howToEarn.steps.step3.title'),
      description: t('home.howToEarn.steps.step3.description')
    },
    {
      icon: TrendingUp,
      title: t('home.howToEarn.steps.step4.title'),
      description: t('home.howToEarn.steps.step4.description')
    }
  ];


  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Left Side - Mathematical Formulas */}
          <div className="absolute left-0 top-0 w-1/5 h-full opacity-60 pl-2 pr-2">
            <div className="relative w-full h-full flex flex-col justify-center items-start space-y-8 px-4">
              <TypewriterText 
                text="∫₀^∞ e^(-x²) dx = √π/2"
                speed={150}
                className="text-lg font-mono text-blue-600 animate-float-slow"
              />
              <TypewriterText 
                text="f(x) = ax² + bx + c"
                speed={200}
                className="text-lg font-mono text-green-600 animate-float-medium"
              />
              <TypewriterText 
                text="lim(x→0) sin(x)/x = 1"
                speed={120}
                className="text-lg font-mono text-purple-600 animate-float-fast"
              />
              <TypewriterText 
                text="∑(n=1 to ∞) 1/n² = π²/6"
                speed={180}
                className="text-lg font-mono text-red-600 animate-float-slow"
              />
              <TypewriterText 
                text="∇ × F = curl(F)"
                speed={160}
                className="text-lg font-mono text-indigo-600 animate-float-medium"
              />
              <TypewriterText 
                text="e^(iπ) + 1 = 0"
                speed={140}
                className="text-lg font-mono text-pink-600 animate-float-fast"
              />
            </div>
          </div>
          
          {/* Right Side - Mathematical Formulas */}
          <div className="absolute right-0 top-0 w-1/5 h-full opacity-60 pl-2 pr-2">
            <div className="relative w-full h-full flex flex-col justify-center items-end space-y-8 px-4">
              <TypewriterText 
                text="∂f/∂x = lim(h→0) [f(x+h)-f(x)]/h"
                speed={170}
                className="text-lg font-mono text-orange-600 animate-float-medium"
              />
              <TypewriterText 
                text="P(A|B) = P(B|A)P(A)/P(B)"
                speed={190}
                className="text-lg font-mono text-teal-600 animate-float-slow"
              />
              <TypewriterText 
                text="F = ma"
                speed={110}
                className="text-lg font-mono text-cyan-600 animate-float-fast"
              />
              <TypewriterText 
                text="E = mc²"
                speed={130}
                className="text-lg font-mono text-amber-600 animate-float-medium"
              />
              <TypewriterText 
                text="H = -∑ p(x) log p(x)"
                speed={210}
                className="text-lg font-mono text-emerald-600 animate-float-slow"
              />
              <TypewriterText 
                text="x = (-b ± √(b²-4ac))/2a"
                speed={160}
                className="text-lg font-mono text-rose-600 animate-float-fast"
              />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            {/* Alternating Hero Content */}
            <div className="animate-fade-in">
              {currentMessage === 0 ? (
                <>
                  <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                    {t('home.heroTitle').split(' ').map((word, index) => {
                      if (word === 'Almost' || word === 'Presque') {
                        return (
                          <span key={index} className="text-blue-600">
                            {word}{' '}
                          </span>
                        );
                      } else if (word === 'Anything' || word === 'N\'importe') {
                        return (
                          <span key={index} className="text-blue-600">
                            {word}{' '}
                          </span>
                        );
                      } else if (word === 'Maiko') {
                        return (
                          <span key={index}>
                            <span className="text-gray-300" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.3)'}}>Ma</span>
                            <span className="text-orange-500">iko</span>{' '}
                          </span>
                        );
                      } else if (word === 'EDU') {
                        return (
                          <span key={index} className="text-orange-500">
                            {word}{' '}
                          </span>
                        );
                      }
                      return word + ' ';
                    })}
                  </h1>
                  <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                    {t('home.heroSubtitle')}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      to="/courses"
                      className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center justify-center"
                    >
                      {t('home.exploreCourses')}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                    <Link
                      to="/register"
                      className="bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors inline-flex items-center justify-center"
                    >
                      {t('home.getStartedFree')}
                      <Play className="ml-2 h-5 w-5" />
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                    {t('home.earningTitle').split(' ').map((word, index) => {
                      if (word === 'Revenue' || word === 'Revenus') {
                        return (
                          <span key={index} className="text-blue-600">
                            {word}{' '}
                          </span>
                        );
                      } else if (word === 'Maiko' || word === 'EDU') {
                        return (
                          <span key={index} className="text-indigo-600">
                            {word}{' '}
                          </span>
                        );
                      }
                      return word + ' ';
                    })}
                  </h1>
                  <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                    {t('home.earningSubtitle')}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      to="/affiliate"
                      className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center justify-center"
                    >
                      {t('home.becomeAffiliate')}
                      <UserPlus className="ml-2 h-5 w-5" />
                    </Link>
                    <Link
                      to="/register"
                      className="bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors inline-flex items-center justify-center"
                    >
                      {t('home.startEarning')}
                      <TrendingUp className="ml-2 h-5 w-5" />
                    </Link>
                  </div>
                </>
              )}
            </div>
            
            <div className="mt-8 flex items-center justify-center">
              <div className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg">
                <span className="mr-2 text-lg">🇨🇩</span>
                <span className="font-semibold text-sm">{t('home.congoleseDiaspora')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Maiko EDU Section */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              {t('home.whyChooseMaiko')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t('home.whyChooseMaikoSubtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white text-center p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-green-600 rounded-full mb-6">
                  <feature.icon className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              {t('home.learnAnySkill')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t('home.learnAnySkillSubtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courseCategories.map((category, index) => {
              const isBusinessCategory = category.title === t('home.courseCategories.business.title');
              const CategoryComponent = isBusinessCategory ? Link : 'div';
              const categoryProps = isBusinessCategory ? { to: '/business-entrepreneurship' } : {};
              
              return (
                <CategoryComponent 
                  key={index} 
                  {...categoryProps}
                  className={`bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-100 ${isBusinessCategory ? 'cursor-pointer' : ''}`}
                >
                  <div className="text-5xl mb-6 text-center">{category.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                    {category.title}
                  </h3>
                  <p className="text-blue-600 font-bold text-lg mb-4 text-center">
                    {category.count}
                  </p>
                  <p className="text-gray-600 text-center leading-relaxed">
                    {category.description}
                  </p>
                  {isBusinessCategory && (
                    <div className="mt-4 text-center">
                      <span className="text-blue-600 font-semibold text-sm">
                        Click to explore →
                      </span>
                    </div>
                  )}
                </CategoryComponent>
              );
            })}
          </div>
        </div>
      </section>

      {/* How to Earn Money Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('home.howToEarn.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('home.howToEarn.subtitle')}
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {earningSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 text-orange-600 rounded-full mb-4">
                  <step.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>


          {/* Call to Action */}
          <div className="text-center bg-primary-50 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {t('home.howToEarn.cta.title')}
            </h3>
            <p className="text-xl text-gray-600 mb-6">
              {t('home.howToEarn.cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/affiliate"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center justify-center"
              >
                {t('home.howToEarn.cta.button')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/courses"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors border border-blue-600 inline-flex items-center justify-center"
              >
                {t('home.howToEarn.cta.secondaryButton')}
                <BookOpen className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;