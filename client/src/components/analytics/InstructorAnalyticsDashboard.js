import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  BookOpen, 
  PlayCircle, 
  MessageSquare, 
  TrendingUp,
  Calendar,
  Clock,
  Award,
  Eye,
  MousePointer,
  Download,
  DollarSign,
  Target,
  PieChart,
  ExternalLink,
  RefreshCw,
  Settings,
  Filter
} from 'lucide-react';

const InstructorAnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('last30');
  const [matomoUrl, setMatomoUrl] = useState('');

  useEffect(() => {
    loadAnalyticsData();
    loadMatomoConfig();
  }, [timeRange]);

  const loadMatomoConfig = async () => {
    try {
      const response = await fetch('/api/matomo/config');
      const data = await response.json();
      
      if (data.success) {
        setMatomoUrl(data.config.matomoUrl);
      }
    } catch (error) {
      console.error('Error loading Matomo config:', error);
    }
  };

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/matomo/dashboard?period=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setAnalyticsData(data.data);
      } else {
        setError(data.message || 'Failed to load analytics data');
      }
    } catch (err) {
      setError('Error loading analytics data');
      console.error('Analytics error:', err);
    } finally {
      setLoading(false);
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

  const formatPercentage = (num) => {
    return `${Math.round(num || 0)}%`;
  };

  const openMatomoDashboard = () => {
    if (matomoUrl) {
      window.open(matomoUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <div className="text-red-600 mr-3">
            <BarChart3 className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-red-800 font-medium">Analytics Error</h3>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Matomo Access */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Instructor Analytics Dashboard</h1>
          <p className="text-gray-600">Track your course performance, revenue, and student engagement</p>
        </div>
        
        <div className="flex space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="last7">Last 7 days</option>
            <option value="last30">Last 30 days</option>
            <option value="last90">Last 90 days</option>
            <option value="last365">Last year</option>
          </select>
          
          <button
            onClick={loadAnalyticsData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
          
          {matomoUrl && (
            <button
              onClick={openMatomoDashboard}
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors flex items-center"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Matomo
            </button>
          )}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(analyticsData?.revenue?.reduce((sum, item) => sum + (item.nb_events * (item.avg_event_value || 0)), 0) || 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Course Enrollments */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Course Enrollments</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(analyticsData?.courseEnrollments?.length || 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Total Students */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(analyticsData?.visitors?.nb_visits || 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Award className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPercentage(analyticsData?.visitors?.conversion_rate || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Breakdown</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Course Sales</p>
                  <p className="text-sm text-gray-600">Direct course purchases</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-600">
                  {formatCurrency(analyticsData?.revenue?.filter(r => r.label === 'Purchase').reduce((sum, item) => sum + (item.nb_events * (item.avg_event_value || 0)), 0) || 0)}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <Target className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Affiliate Commissions</p>
                  <p className="text-sm text-gray-600">Revenue from affiliates</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-blue-600">
                  {formatCurrency(analyticsData?.affiliateCommissions?.reduce((sum, item) => sum + (item.nb_events * (item.avg_event_value || 0)), 0) || 0)}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 text-purple-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Marketing ROI</p>
                  <p className="text-sm text-gray-600">Return on marketing investment</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-purple-600">
                  {formatPercentage(analyticsData?.marketingCampaigns?.reduce((sum, item) => sum + (item.avg_event_value || 0), 0) || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performing Courses */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Courses</h3>
          
          {analyticsData?.courseEnrollments ? (
            <div className="space-y-4">
              {analyticsData.courseEnrollments.slice(0, 5).map((course, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{course.label || 'Course'}</p>
                      <p className="text-sm text-gray-600">{course.nb_events} enrollments</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{course.nb_events}</p>
                    <p className="text-xs text-gray-500">enrollments</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No course data available</p>
          )}
        </div>
      </div>

      {/* Learning Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Engagement */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Engagement</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <BookOpen className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Lesson Completions</p>
                  <p className="text-sm text-gray-600">Students completing lessons</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-blue-600">
                  {formatNumber(analyticsData?.lessonCompletions?.length || 0)}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <PlayCircle className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">H5P Interactions</p>
                  <p className="text-sm text-gray-600">Interactive content engagement</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-600">
                  {formatNumber(analyticsData?.h5pInteractions?.length || 0)}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center">
                <MessageSquare className="h-5 w-5 text-purple-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Forum Activity</p>
                  <p className="text-sm text-gray-600">Student discussions</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-purple-600">
                  {formatNumber(analyticsData?.forumActivity?.length || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
          
          <div className="space-y-4">
            <div className="text-center">
              <div className="p-3 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-gray-600">Avg. Session Duration</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(analyticsData?.visitors?.avg_time_on_site || 0)}s
              </p>
            </div>

            <div className="text-center">
              <div className="p-3 bg-red-100 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-red-600" />
              </div>
              <p className="text-sm font-medium text-gray-600">Bounce Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPercentage(analyticsData?.visitors?.bounce_rate || 0)}
              </p>
            </div>

            <div className="text-center">
              <div className="p-3 bg-green-100 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-sm font-medium text-gray-600">Returning Students</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPercentage(analyticsData?.visitors?.returning_visits_percentage || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="bg-blue-600 text-white px-4 py-3 rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center justify-center">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </button>
          
          <button className="bg-green-600 text-white px-4 py-3 rounded-lg text-sm hover:bg-green-700 transition-colors flex items-center justify-center">
            <BarChart3 className="h-4 w-4 mr-2" />
            Generate Report
          </button>
          
          <button className="bg-purple-600 text-white px-4 py-3 rounded-lg text-sm hover:bg-purple-700 transition-colors flex items-center justify-center">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Report
          </button>
          
          <button className="bg-orange-600 text-white px-4 py-3 rounded-lg text-sm hover:bg-orange-700 transition-colors flex items-center justify-center">
            <Settings className="h-4 w-4 mr-2" />
            Configure Alerts
          </button>
        </div>
      </div>

      {/* Matomo Integration Info */}
      {matomoUrl && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced Analytics with Matomo</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Real-time Analytics</h4>
              <p className="text-sm text-gray-600">
                Access live visitor tracking, heatmaps, and detailed user behavior analysis in Matomo.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Custom Reports</h4>
              <p className="text-sm text-gray-600">
                Create custom dashboards, reports, and automated insights tailored to your courses.
              </p>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <button
              onClick={openMatomoDashboard}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center mx-auto"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Full Matomo Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorAnalyticsDashboard;
