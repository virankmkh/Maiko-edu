import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  User, 
  Building2, 
  GraduationCap, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Upload,
  ArrowLeft,
  CheckCircle,
  Mail,
  Phone,
  Calendar,
  Linkedin,
  FileText,
  Lock,
  DollarSign
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const Register = () => {
  const [userType, setUserType] = useState('student');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dateOfBirth: '',
    organizationName: '',
    linkedinProfile: '',
    cvFile: null,
    termsAccepted: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  const { register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const userTypes = [
    {
      id: 'student',
      title: 'Student',
      description: 'Learn from our comprehensive course library',
      icon: User,
      color: 'from-blue-500 to-cyan-500',
      features: [
        'Access to all courses',
        'Earn money through our affiliate program',
        'Affiliate marketing opportunities',
        'Personal dashboard',
        'Mobile money & PayPal payments'
      ]
    },
    {
      id: 'organization',
      title: 'School/Organization',
      description: 'Partner with us to offer courses',
      icon: Building2,
      color: 'from-green-500 to-emerald-500',
      features: [
        'Revenue sharing (40% per student)',
        'Course management tools',
        'Student analytics',
        'Affiliate marketing',
        'Multiple payment methods'
      ]
    },
    {
      id: 'lecturer',
      title: 'Independent Lecturer',
      description: 'Share your expertise and earn',
      icon: GraduationCap,
      color: 'from-purple-500 to-pink-500',
      features: [
        'Revenue sharing (40% per student)',
        'Course creation tools',
        'Personal branding',
        'Affiliate marketing',
        'Flexible scheduling'
      ]
    }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    let processedValue = value;
    
    // Auto-add https:// to LinkedIn URLs
    if (name === 'linkedinProfile' && value && !value.startsWith('http')) {
      processedValue = `https://${value}`;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : processedValue
    }));
  };

  const handleUserTypeSelect = (type) => {
    setUserType(type);
    setStep(2);
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      toast.error(t('auth.fillRequiredFields'));
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error(t('auth.passwordsDoNotMatch'));
      return false;
    }

    if (formData.password.length < 6) {
      toast.error(t('auth.passwordMinLength'));
      return false;
    }

    if (userType === 'student' && (!formData.phone || !formData.dateOfBirth)) {
      toast.error('Please fill in phone number and date of birth');
      return false;
    }

    if ((userType === 'organization' || userType === 'lecturer') && !formData.linkedinProfile) {
      toast.error('Please provide your LinkedIn profile');
      return false;
    }

    if (!formData.termsAccepted) {
      toast.error('Please accept the terms and conditions');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const registrationData = {
        ...formData,
        userType,
        phone: formData.phone || '',
        dateOfBirth: formData.dateOfBirth || '',
        organizationName: formData.organizationName || '',
        linkedinProfile: formData.linkedinProfile || ''
      };

      const result = await register(registrationData);
      
      if (result.success) {
        toast.success(t('auth.welcomeToMaiko'));
        
        // Show affiliate opportunity
        setTimeout(() => {
          toast.success(t('auth.affiliateInfo'), {
            duration: 6000
          });
        }, 2000);
        
        navigate('/dashboard');
      } else {
        toast.error(result.error || t('auth.registrationFailed'));
      }
    } catch (error) {
      toast.error(error.message || t('auth.registrationFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full space-y-8">
          <div className="text-center">
            {/* DRC Flag Man Image */}
            <div className="mx-auto w-32 h-32 mb-6 overflow-hidden rounded-full border-4 border-primary-200 shadow-lg">
              <img 
                src="/drc-man.jpg" 
                alt="DRC Flag Man" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-full h-full bg-gradient-to-r from-primary-600 to-secondary-600 flex items-center justify-center text-4xl" style={{display: 'none'}}>
                🇨🇩
              </div>
            </div>
            
            <div className="mx-auto h-20 w-20 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center mb-4">
              <User className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {t('auth.register')} - Join Maiko EDU
            </h2>
            <p className="text-lg text-gray-600">
              We are the Congolese of tomorrow, the better fitted head ones. 
              Join us and build our country with brains.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {userTypes.map((type) => (
              <div
                key={type.id}
                onClick={() => handleUserTypeSelect(type.id)}
                className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-primary-300 group`}
              >
                <div className={`bg-gradient-to-r ${type.color} p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                  <type.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
                  {type.title}
                </h3>
                
                <p className="text-gray-600 text-center mb-4">
                  {type.description}
                </p>

                <ul className="space-y-2 mb-4">
                  {type.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="text-center">
                  <div className="inline-flex items-center text-primary-600 font-semibold group-hover:text-primary-700 transition-colors">
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center mb-4">
            <User className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Registration
          </h2>
          <p className="text-gray-600">
            Join as a {userType === 'student' ? 'Student' : userType === 'organization' ? 'School/Organization' : 'Independent Lecturer'}
          </p>
          <button
            onClick={goBack}
            className="text-primary-600 hover:text-primary-700 text-sm mt-2"
          >
            ← Choose different account type
          </button>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="First Name"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="Last Name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="your@email.com"
                />
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                We'll send a confirmation email to verify your account
              </p>
            </div>

            {/* Student-specific fields */}
            {userType === 'student' && (
              <>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    WhatsApp Phone Number *
                  </label>
                  <div className="relative">
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                      placeholder="+1234567890"
                    />
                    <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth *
                  </label>
                  <div className="relative">
                    <input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      required
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                    />
                    <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </>
            )}

            {/* Organization/Lecturer-specific fields */}
            {(userType === 'organization' || userType === 'lecturer') && (
              <>
                {userType === 'organization' && (
                  <div>
                    <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 mb-1">
                      Organization Name *
                    </label>
                    <input
                      id="organizationName"
                      name="organizationName"
                      type="text"
                      required
                      value={formData.organizationName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                      placeholder="Your Organization Name"
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="linkedinProfile" className="block text-sm font-medium text-gray-700 mb-1">
                    LinkedIn Profile URL *
                  </label>
                  <div className="relative">
                    <input
                      id="linkedinProfile"
                      name="linkedinProfile"
                      type="url"
                      required
                      value={formData.linkedinProfile}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                      placeholder="linkedin.com/in/yourprofile (https:// will be added automatically)"
                    />
                    <Linkedin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    We'll review your profile and get back to you within 24 hours
                  </p>
                </div>

                <div>
                  <label htmlFor="cvFile" className="block text-sm font-medium text-gray-700 mb-1">
                    CV/Resume (PDF) *
                  </label>
                  <div className="relative">
                    <input
                      id="cvFile"
                      name="cvFile"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      required
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                    />
                    <FileText className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </>
            )}

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="Create a password"
                />
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="Confirm your password"
                />
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <input
                id="termsAccepted"
                name="termsAccepted"
                type="checkbox"
                required
                checked={formData.termsAccepted}
                onChange={(e) => setFormData(prev => ({ ...prev, termsAccepted: e.target.checked }))}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
              />
              <label htmlFor="termsAccepted" className="ml-2 block text-sm text-gray-700">
                I agree to the{' '}
                <Link to="/terms" className="text-primary-600 hover:text-primary-700">
                  Terms and Conditions
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-primary-600 hover:text-primary-700">
                  Privacy Policy
                </Link>
              </label>
            </div>
          </div>

          {/* Affiliate Marketing Notice */}
          <div className="bg-gradient-to-r from-accent-50 to-primary-50 p-4 rounded-lg border border-accent-200">
            <div className="flex items-start">
              <DollarSign className="w-5 h-5 text-accent-600 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-accent-800 mb-1">
                  💡 Earn While You Learn!
                </h4>
                <p className="text-xs text-accent-700">
                  {userType === 'student' 
                    ? 'Earn money by referring others through our affiliate program! Plus, access quality education from our comprehensive course library.'
                    : 'Earn 40% revenue share for each student who registers for your courses! Plus, boost your income with affiliate marketing.'
                  }
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating Account...
              </div>
            ) : (
              'Create Account'
            )}
          </button>

          <div className="text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
