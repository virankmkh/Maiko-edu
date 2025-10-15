import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import logoImage from '../../assets/Maiko logo.png';
import { 
  Users, 
  Globe, 
  Mail, 
  Phone, 
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  MessageCircle,
  X
} from 'lucide-react';

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: t('navigation.about'), href: '/about' },
      { name: t('navigation.team'), href: '/team' },
      { name: t('navigation.contact'), href: '/contact' },
      { name: t('navigation.terms'), href: '/terms' },
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Contact Support', href: '/contact' },
      { name: 'FAQ', href: '/faq' },
      { name: 'Community', href: '/community' },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', href: 'https://facebook.com/maikoedu', icon: Facebook },
    { name: 'X (Twitter)', href: 'https://x.com/maikoedu', icon: X },
    { name: 'Instagram', href: 'https://instagram.com/maikoedu', icon: Instagram },
    { name: 'LinkedIn', href: 'https://linkedin.com/company/maikoedu', icon: Linkedin },
    { name: 'YouTube', href: 'https://youtube.com/@maikoedu', icon: Youtube },
    { name: 'TikTok', href: 'https://tiktok.com/@maikoedu', icon: MessageCircle },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <img 
                src={logoImage} 
                alt="Maiko EDU" 
                className="h-12 w-12 object-contain"
                onError={(e) => {
                  // Fallback to public folder if import fails
                  e.target.src = '/Maiko logo.png';
                }}
              />
              <span className="text-2xl font-bold">Maiko EDU</span>
            </div>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-base font-semibold mb-2 flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Company
            </h3>
            <ul className="space-y-1">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Globe className="w-5 h-5 mr-2" />
              Contact
            </h3>
            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <Mail className="w-4 h-4 mr-2" />
                <span>info@maikoedu.org</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Phone className="w-4 h-4 mr-2" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-start text-gray-300">
                <MapPin className="w-4 h-4 mr-2 mt-0.5" />
                <span>123 Education Street, Learning City, LC 12345</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} Maiko EDU. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <Link to="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-xs font-medium tracking-wide" 
               style={{
                 color: '#999999',
                 textShadow: `
                   inset 1px 1px 0px #666666,
                   inset 2px 2px 0px #444444,
                   inset 3px 3px 0px #222222,
                   1px 1px 0px #CCCCCC,
                   2px 2px 0px #AAAAAA
                 `,
                 letterSpacing: '0.05em',
                 fontWeight: '500'
               }}>
              Intellectual Property of VIRA NEEMA
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
