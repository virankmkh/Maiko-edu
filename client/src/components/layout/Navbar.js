import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Menu, 
  X, 
  User, 
  BookOpen, 
  GraduationCap, 
  Globe, 
  LogOut,
  ChevronDown,
  Building2,
  Users,
  Settings
} from 'lucide-react';

// Import the logo
import logoImage from '../../assets/Maiko logo.png';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  
  const { user, isAuthenticated, logout } = useAuth();
  const { currentLanguage, languages, changeLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const toggleLanguageMenu = () => {
    setIsLanguageMenuOpen(!isLanguageMenuOpen);
  };

  const closeAllMenus = () => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
    setIsLanguageMenuOpen(false);
  };

  const isActive = (path) => {
    // Special case for instructors: highlight "Courses" when on instructor dashboard
    if (isAuthenticated && user?.role === 'instructor' && path === '/instructor/dashboard' && location.pathname === '/instructor/dashboard') {
      return true;
    }
    return location.pathname === path;
  };

  const getNavItems = () => {
    // If on VIRANK landing page, show VIRANK-specific navigation
    if (location.pathname === '/') {
      return [
        { path: '/#vision', label: 'Notre Vision', icon: null },
        { path: '/#projets', label: 'Nos Projets', icon: null },
        { path: '/#blog', label: 'Le Blog', icon: null },
        { path: '/#fondatrice', label: 'Notre Fondatrice', icon: null },
        { path: '/home', label: 'Maiko EDU', icon: BookOpen },
      ];
    }

    const baseItems = [
      { path: '/', label: t('navigation.home'), icon: null },
      { path: '/about', label: t('navigation.about'), icon: null },
      { path: '/team', label: t('navigation.team'), icon: null },
      { path: '/contact', label: t('navigation.contact'), icon: null },
    ];

    // For instructors, "Courses" should go to their dashboard
    if (isAuthenticated && user?.role === 'instructor') {
      return [
        { path: '/', label: t('navigation.home'), icon: null },
        { path: '/instructor/dashboard', label: t('navigation.courses'), icon: BookOpen },
        { path: '/about', label: t('navigation.about'), icon: null },
        { path: '/team', label: t('navigation.team'), icon: null },
        { path: '/contact', label: t('navigation.contact'), icon: null },
      ];
    }

    // For other users, "Courses" goes to the public courses page
    return [
      { path: '/', label: t('navigation.home'), icon: null },
      { path: '/courses', label: t('navigation.courses'), icon: BookOpen },
      { path: '/about', label: t('navigation.about'), icon: null },
      { path: '/team', label: t('navigation.team'), icon: null },
      { path: '/contact', label: t('navigation.contact'), icon: null },
    ];
  };

  const navItems = getNavItems();

  const userMenuItems = [
    { 
      label: t('common.dashboard'), 
      path: user?.role === 'instructor' ? '/instructor/dashboard' : '/dashboard', 
      icon: GraduationCap,
      roles: ['student', 'instructor', 'organization_admin', 'admin']
    },
    { 
      label: t('common.profile'), 
      path: '/profile', 
      icon: User,
      roles: ['student', 'instructor', 'organization_admin', 'admin']
    },
    { 
      label: t('organization.title'), 
      path: '/organization/dashboard', 
      icon: Building2,
      roles: ['organization_admin']
    },
    { 
      label: t('affiliate.title'), 
      path: '/affiliate/dashboard', 
      icon: Users,
      roles: ['student', 'instructor', 'organization_admin']
    },
    { 
      label: t('common.settings'), 
      path: '/admin', 
      icon: Settings,
      roles: ['admin']
    },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24 py-2">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src={logoImage} 
                alt="Maiko" 
                className="h-30 w-30 object-contain"
                onError={(e) => {
                  // Fallback to public folder if import fails
                  e.target.src = '/Maiko logo.png';
                }}
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
                onClick={closeAllMenus}
              >
                {item.icon && <item.icon className="inline w-4 h-4 mr-2" />}
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right side - Language, Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={toggleLanguageMenu}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span>{languages[currentLanguage]?.flag}</span>
                <span>{languages[currentLanguage]?.name}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {isLanguageMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                  {Object.entries(languages).map(([code, lang]) => (
                    <button
                      key={code}
                      onClick={() => {
                        changeLanguage(code);
                        setIsLanguageMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2 ${
                        currentLanguage === code ? 'text-primary-600 bg-primary-50' : 'text-gray-700'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth Buttons */}
            {!isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  {t('common.login')}
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors"
                >
                  {t('common.register')}
                </Link>
              </div>
            ) : (
              /* User Menu */
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary-600" />
                  </div>
                  <span className="hidden lg:block">{user?.firstName || user?.email}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 mt-1">
                        {user?.role}
                      </span>
                    </div>
                    
                    {userMenuItems
                      .filter(item => !item.roles || item.roles.includes(user?.role))
                      .map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <item.icon className="w-4 h-4 mr-3" />
                          {item.label}
                        </Link>
                      ))}
                    
                    <div className="border-t border-gray-200 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        {t('common.logout')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
                onClick={closeAllMenus}
              >
                {item.icon && <item.icon className="inline w-4 h-4 mr-2" />}
                {item.label}
              </Link>
            ))}
            
            {/* Mobile Auth */}
            {!isAuthenticated ? (
              <div className="pt-4 space-y-2">
                <Link
                  to="/login"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors"
                  onClick={closeAllMenus}
                >
                  {t('common.login')}
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 text-base font-medium bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                  onClick={closeAllMenus}
                >
                  {t('common.register')}
                </Link>
              </div>
            ) : (
              <div className="pt-4 space-y-2 border-t border-gray-200">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
                
                {userMenuItems
                  .filter(item => !item.roles || item.roles.includes(user?.role))
                  .map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600 rounded-md transition-colors"
                      onClick={closeAllMenus}
                    >
                      <item.icon className="w-4 h-4 mr-3" />
                      {item.label}
                    </Link>
                  ))}
                
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-red-600 rounded-md transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  {t('common.logout')}
                </button>
              </div>
            )}
            
            {/* Mobile Language Switcher */}
            <div className="pt-4 border-t border-gray-200">
              <p className="px-3 py-2 text-sm font-medium text-gray-500 uppercase tracking-wider">
                {t('common.language')}
              </p>
              {Object.entries(languages).map(([code, lang]) => (
                <button
                  key={code}
                  onClick={() => {
                    changeLanguage(code);
                    closeAllMenus();
                  }}
                  className={`w-full text-left px-3 py-2 text-base font-medium transition-colors rounded-md ${
                    currentLanguage === code 
                      ? 'text-primary-600 bg-primary-50' 
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-2">{lang.flag}</span>
                  {lang.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
