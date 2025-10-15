import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const TestError = () => {
  const { t } = useLanguage();
  const [shouldError, setShouldError] = useState(false);

  // This will trigger an error when shouldError is true
  if (shouldError) {
    throw new Error('This is a test error to demonstrate ErrorBoundary functionality!');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="text-yellow-500 text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Error Boundary Test
        </h1>
        <p className="text-gray-600 mb-6">
          Click the button below to trigger a test error and see how the ErrorBoundary component handles it.
        </p>
        
        <button
          onClick={() => setShouldError(true)}
          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
        >
          Trigger Test Error
        </button>
        
        <div className="mt-4 text-sm text-gray-500">
          <p>This component is only for testing purposes.</p>
          <p>In production, errors would be caught automatically.</p>
        </div>
      </div>
    </div>
  );
};

export default TestError;
