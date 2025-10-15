import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Code, 
  Building, 
  Megaphone, 
  Wrench, 
  Users, 
  Globe,
  Award,
  Lightbulb
} from 'lucide-react';

const Team = () => {
  const { t } = useLanguage();

  const teamMembers = [
    {
      name: 'Unspoken',
      bio: 'The brilliant mind behind Maiko EDU platform, Unspoken is a passionate technologist and educator who created this platform from scratch. With expertise in software development and IT education, she leads our technical initiatives and personally teaches IT courses to empower the next generation of Congolese tech professionals.',
      expertise: ['Software Development', 'IT Education', 'Platform Architecture', 'Technical Leadership'],
      icon: Code,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Roi loin',
      bio: 'A distinguished computer scientist and visionary leader, Roi loin drives our mission to democratize education and create opportunities for the Congolese community worldwide. His deep understanding of technology and business strategy guides our platform development and community outreach.',
      expertise: ['Computer Science', 'Business Strategy', 'Leadership', 'Innovation'],
      icon: Building,
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const values = [
    {
      icon: Users,
      title: t('team.values.unity.title'),
      description: t('team.values.unity.description')
    },
    {
      icon: Globe,
      title: t('team.values.globalImpact.title'),
      description: t('team.values.globalImpact.description')
    },
    {
      icon: Award,
      title: t('team.values.excellence.title'),
      description: t('team.values.excellence.description')
    },
    {
      icon: Lightbulb,
      title: t('team.values.innovation.title'),
      description: t('team.values.innovation.description')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              {t('team.hero.title').split(' ').map((word, index) => 
                word === 'Team' ? <span key={index} className="text-primary-600">{word}</span> : word + ' '
              )}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {t('team.hero.subtitle')}
            </p>
            <div className="inline-flex items-center px-6 py-3 bg-accent-500 text-white rounded-full text-lg font-semibold">
              🇨🇩 {t('team.hero.badge')}
            </div>
          </div>
        </div>
      </section>

      {/* Team Members Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('team.leadership.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('team.leadership.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <div className={`bg-gradient-to-r ${member.color} p-8 text-white text-center`}>
                  <div className="inline-flex p-4 rounded-full bg-white/20 mb-4">
                    <member.icon className="w-12 h-12" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{member.name}</h3>
                </div>
                
                <div className="p-8">
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {member.bio}
                  </p>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">
                      {t('team.areasOfExpertise')}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {member.expertise.map((skill, skillIndex) => (
                        <span 
                          key={skillIndex}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('team.values.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('team.values.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {t('team.story.title')}
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                {t('team.story.paragraph1')}
              </p>
              <p className="text-lg text-gray-600 mb-6">
                {t('team.story.paragraph2')}
              </p>
              <p className="text-lg text-gray-600">
                {t('team.story.paragraph3')}
              </p>
            </div>
            <div className="bg-gradient-to-br from-accent-100 to-primary-100 p-8 rounded-2xl">
              <div className="text-center">
                <div className="text-6xl mb-4">🚀</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('team.story.vision.title')}
                </h3>
                <p className="text-gray-600 mb-4">
                  {t('team.story.vision.description')}
                </p>
                <div className="inline-flex items-center px-4 py-2 bg-accent-500 text-white rounded-full text-sm font-semibold">
                  🇨🇩 {t('team.story.vision.badge')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {t('team.cta.title')}
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            {t('team.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/about"
              className="bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              {t('team.cta.learnMore')}
            </a>
            <a
              href="/courses"
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
            >
              {t('team.cta.startLearning')}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Team;
