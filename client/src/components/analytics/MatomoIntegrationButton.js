import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  ExternalLink, 
  Settings, 
  Download, 
  RefreshCw,
  TrendingUp,
  DollarSign,
  Users,
  BookOpen,
  PlayCircle,
  MessageSquare
} from 'lucide-react';

const MatomoIntegrationButton = ({ onAnalyticsClick }) => {
  const [matomoConfig, setMatomoConfig] = useState(null);
  const [analyticsSummary, setAnalyticsSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMatomoConfig();
    loadAnalyticsSummary();
  }, []);

  const loadMatomoConfig = async () => {
    try {
      const response = await fetch('/api/matomo/config');
      const data = await response.json();
      
      if (data.success) {
        setMatomoConfig(data.config);
      }
    } catch (error) {
      console.error('Error loading Matomo config:', error);
    }
  };

  const loadAnalyticsSummary = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/matomo/dashboard?period=last7', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setAnalyticsSummary(data.data);
      }
    } catch (error) {
      console.error('Error loading analytics summary:', error);
    } finally {
      setLoading(false);
    }
  };

  const openMatomoDashboard = () => {
    if (matomoConfig?.matomoUrl) {
      window.open(matomoConfig.matomoUrl, '_blank');
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num?.toString() || '0';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  if (!matomoConfig?.enabled) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center">
          <BarChart3 className="h-5 w-5 text-yellow-600 mr-3" />
          <div>
            <h3 className="text-yellow-800 font-medium">Analytics Not Configured</h3>
            <p className="text-yellow-600 text-sm">Matomo analytics is not enabled. Contact your administrator to set up analytics.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <BarChart3 className="h-6 w-6 text-white mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-white">Analytics Dashboard</h3>
              <p className="text-blue-100 text-sm">Track your course performance and revenue</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={loadAnalyticsSummary}
              disabled={loading}
              className="bg-white bg-opacity-20 text-white px-3 py-2 rounded-lg text-sm hover:bg-opacity-30 transition-colors flex items-center"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            
            {matomoConfig?.matomoUrl && (
              <button
                onClick={openMatomoDashboard}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-100 transition-colors flex items-center"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Matomo
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      {analyticsSummary && (
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {/* Revenue */}
            <div className="text-center">
              <div className="p-3 bg-green-100 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="text-lg font-bold text-gray-900">
                {formatCurrency(analyticsSummary.revenue?.reduce((sum, item) => sum + (item.nb_events * (item.avg_event_value || 0)), 0) || 0)}
              </p>
            </div>

            {/* Students */}
            <div className="text-center">
              <div className="p-3 bg-blue-100 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-gray-600">Students</p>
              <p className="text-lg font-bold text-gray-900">
                {formatNumber(analyticsSummary.visitors?.nb_visits || 0)}
              </p>
            </div>

            {/* Enrollments */}
            <div className="text-center">
              <div className="p-3 bg-purple-100 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
              <p className="text-sm font-medium text-gray-600">Enrollments</p>
              <p className="text-lg font-bold text-gray-900">
                {formatNumber(analyticsSummary.courseEnrollments?.length || 0)}
              </p>
            </div>

            {/* Interactions */}
            <div className="text-center">
              <div className="p-3 bg-orange-100 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                <PlayCircle className="h-6 w-6 text-orange-600" />
              </div>
              <p className="text-sm font-medium text-gray-600">Interactions</p>
              <p className="text-lg font-bold text-gray-900">
                {formatNumber(analyticsSummary.h5pInteractions?.length || 0)}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={() => onAnalyticsClick && onAnalyticsClick('dashboard')}
              className="bg-blue-600 text-white px-4 py-3 rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              View Full Dashboard
            </button>
            
            <button
              onClick={() => onAnalyticsClick && onAnalyticsClick('revenue')}
              className="bg-green-600 text-white px-4 py-3 rounded-lg text-sm hover:bg-green-700 transition-colors flex items-center justify-center"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Revenue Analytics
            </button>
            
            <button
              onClick={() => onAnalyticsClick && onAnalyticsClick('students')}
              className="bg-purple-600 text-white px-4 py-3 rounded-lg text-sm hover:bg-purple-700 transition-colors flex items-center justify-center"
            >
              <Users className="h-4 w-4 mr-2" />
              Student Analytics
            </button>
          </div>
        </div>
      )}

      {/* Matomo Features */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Available in Matomo:</h4>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-600">
          <div className="flex items-center">
            <TrendingUp className="h-3 w-3 mr-2 text-blue-500" />
            Real-time Analytics
          </div>
          <div className="flex items-center">
            <DollarSign className="h-3 w-3 mr-2 text-green-500" />
            Revenue Tracking
          </div>
          <div className="flex items-center">
            <Users className="h-3 w-3 mr-2 text-purple-500" />
            User Behavior
          </div>
          <div className="flex items-center">
            <MessageSquare className="h-3 w-3 mr-2 text-orange-500" />
            Engagement Metrics
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatomoIntegrationButton;
