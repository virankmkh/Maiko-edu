import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  CheckCircle,
  DollarSign,
  ArrowRight,
  Shield,
  Heart
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('📝 Form submitted with data:', formData);
    
    if (!formData.email || !formData.password) {
      console.log('❌ Missing fields');
      toast.error(t('auth.fillAllFields'));
      return;
    }

    setIsLoading(true);
    console.log('🔄 Starting login process...');
    
    try {
      const result = await login(formData.email, formData.password);
      console.log('📊 Login result:', result);
      
      if (result.success) {
        console.log('✅ Login successful, navigating to dashboard');
        toast.success(t('auth.welcomeBack'));
        
        // Show affiliate opportunity after successful login
        setTimeout(() => {
          toast.success(t('auth.affiliateOpportunity'), {
            duration: 6000
          });
        }, 2000);
        
        navigate('/dashboard');
      } else {
        console.log('❌ Login failed:', result.error);
        toast.error(result.error || t('auth.loginFailed'));
      }
    } catch (error) {
      console.error('💥 Login error caught:', error);
      toast.error(error.message || t('auth.loginFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    t('home.benefits.courses'),
    t('home.benefits.earn'),
    t('home.benefits.affiliate'),
    t('home.benefits.experts'),
    t('home.benefits.payments')
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-20 w-20 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center mb-4">
              <User className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {t('auth.welcomeBack')}
            </h2>
            <p className="text-lg text-gray-600">
              {t('auth.continueJourney')}
            </p>
            <div className="inline-flex items-center px-4 py-2 bg-accent-500 text-white rounded-full text-sm font-semibold mt-3">
              🇨🇩 Congolese Diaspora United
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('auth.email')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white text-gray-900 placeholder-gray-500 font-medium"
                    placeholder={t('auth.emailPlaceholder')}
                    required
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('auth.password')}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white text-gray-900 placeholder-gray-500 font-medium"
                      placeholder={t('auth.passwordPlaceholder')}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="remember"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-primary-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:ring-offset-0"
                    />
                    <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
                      {t('auth.rememberMe')}
                    </label>
                  </div>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    {t('auth.forgotPassword')}
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Signing In...
                    </div>
                  ) : (
                    t('common.login')
                  )}
                </button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">{t('auth.noAccount')}</span>
                  </div>
                </div>

                {/* Register Link */}
                <Link
                  to="/register"
                  className="w-full bg-white border-2 border-primary-600 text-primary-600 py-3 px-4 rounded-lg font-semibold hover:bg-primary-50 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors text-center block"
                >
                  {t('auth.createAccount')}
                </Link>
              </form>

            {/* Affiliate Marketing Notice */}
            <div className="bg-gradient-to-r from-accent-50 to-primary-50 p-4 rounded-lg border border-accent-200">
              <div className="flex items-start">
                <DollarSign className="w-5 h-5 text-accent-600 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-accent-800 mb-1">
                    {t('auth.earnWhileLearn')}
                  </h4>
                  <p className="text-xs text-accent-700">
                    {t('auth.earnWhileLearnDesc')}
                  </p>
                </div>
              </div>
            </div>

            {/* Security Notice */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-start">
              <Shield className="w-5 h-5 text-gray-600 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-1">
                  {t('auth.dataSecure')}
                </h4>
                <p className="text-xs text-gray-600">
                  {t('auth.dataSecureDesc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Image & Benefits */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary-600 to-secondary-600 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center text-white text-center px-12">
          {/* DRC Flag Woman Image */}
          <div className="w-64 h-64 mb-8 overflow-hidden rounded-full border-4 border-white/30 shadow-2xl">
            <img 
              src="/drc-woman.jpg" 
              alt="DRC Flag Woman" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="w-full h-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-6xl" style={{display: 'none'}}>
              🇨🇩
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-4">
            {t('common.welcome')} - We Are The Congolese of Tomorrow
          </h2>
          <p className="text-xl mb-8 opacity-90">
            The better fitted head ones. Join us and build our country with brains.
          </p>

          {/* Benefits List */}
          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-semibold mb-4">Why Choose Maiko EDU?</h3>
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center text-left">
                <CheckCircle className="w-5 h-5 text-accent-300 mr-3 flex-shrink-0" />
                <span className="text-sm opacity-90">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 border border-white/30">
            <h4 className="text-lg font-semibold mb-2">Ready to Start Learning?</h4>
            <p className="text-sm opacity-90 mb-4">
              Join thousands of students advancing their careers
            </p>
            <Link
              to="/register"
              className="inline-flex items-center bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>

          {/* Footer */}
          <div className="absolute bottom-8 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Heart className="w-4 h-4 text-red-300" />
              <span className="text-sm opacity-80">{t('auth.builtWithLove')}</span>
            </div>
            <p className="text-xs opacity-60">
              {t('auth.tagline')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
