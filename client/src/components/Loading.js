import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Loading = ({ 
  size = 'medium', 
  text = null, 
  fullScreen = false, 
  className = '' 
}) => {
  const { t } = useLanguage();

  const sizeClasses = {
    small: 'h-6 w-6',
    medium: 'h-12 w-12',
    large: 'h-16 w-16',
    xl: 'h-20 w-20'
  };

  const displayText = text || t('common.loading');

  const LoadingSpinner = () => (
    <div className={`animate-spin rounded-full border-b-2 border-primary-600 ${sizeClasses[size]}`}></div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner />
          <p className="text-gray-600 mt-4">{displayText}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="text-center">
        <LoadingSpinner />
        {displayText && (
          <p className="text-gray-600 mt-2 text-sm">{displayText}</p>
        )}
      </div>
    </div>
  );
};

export default Loading;
