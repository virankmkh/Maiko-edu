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
  Download
} from 'lucide-react';

const AnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('last30');

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

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

  const formatPercentage = (num) => {
    return `${Math.round(num || 0)}%`;
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Track your course performance and student engagement</p>
        </div>
        
        <div className="flex space-x-2">
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
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Visitors */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Visitors</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(analyticsData?.visitors?.nb_visits || 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Page Views */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Eye className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Page Views</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(analyticsData?.visitors?.nb_actions || 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Course Enrollments */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Course Enrollments</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(analyticsData?.courseEnrollments?.length || 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Lesson Completions */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Award className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Lesson Completions</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(analyticsData?.lessonCompletions?.length || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Performance */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Performance</h3>
          
          {analyticsData?.courseEnrollments ? (
            <div className="space-y-4">
              {analyticsData.courseEnrollments.slice(0, 5).map((course, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{course.label || 'Course'}</p>
                    <p className="text-sm text-gray-600">{course.nb_events} enrollments</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{course.nb_events}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No course data available</p>
          )}
        </div>

        {/* Learning Analytics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Analytics</h3>
          
          <div className="space-y-4">
            {/* Lesson Completions */}
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

            {/* H5P Interactions */}
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

            {/* Forum Activity */}
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
      </div>

      {/* Engagement Metrics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Metrics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Average Session Duration */}
          <div className="text-center">
            <div className="p-3 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-sm font-medium text-gray-600">Avg. Session Duration</p>
            <p className="text-2xl font-bold text-gray-900">
              {Math.round(analyticsData?.visitors?.avg_time_on_site || 0)}s
            </p>
          </div>

          {/* Bounce Rate */}
          <div className="text-center">
            <div className="p-3 bg-red-100 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-red-600" />
            </div>
            <p className="text-sm font-medium text-gray-600">Bounce Rate</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatPercentage(analyticsData?.visitors?.bounce_rate || 0)}
            </p>
          </div>

          {/* New vs Returning */}
          <div className="text-center">
            <div className="p-3 bg-green-100 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-sm font-medium text-gray-600">Returning Visitors</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatPercentage(analyticsData?.visitors?.returning_visits_percentage || 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        
        <div className="flex flex-wrap gap-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </button>
          
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors flex items-center">
            <BarChart3 className="h-4 w-4 mr-2" />
            Generate Report
          </button>
          
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
