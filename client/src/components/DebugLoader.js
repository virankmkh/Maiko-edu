import { useEffect } from 'react';

// This component loads debug utilities in development mode
const DebugLoader = () => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Dynamically import debug utilities
      import('../utils/debugUser').then(module => {
        console.log('🔧 Debug utilities loaded');
      }).catch(error => {
        console.log('⚠️ Could not load debug utilities:', error.message);
      });
    }
  }, []);

  return null; // This component doesn't render anything
};

export default DebugLoader;
