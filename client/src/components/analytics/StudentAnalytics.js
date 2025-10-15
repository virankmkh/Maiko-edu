import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Clock, 
  Award, 
  TrendingUp,
  Target,
  Calendar,
  BarChart3,
  PlayCircle,
  MessageSquare,
  CheckCircle
} from 'lucide-react';

const StudentAnalytics = ({ courseId, studentId }) => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStudentAnalytics();
  }, [courseId, studentId]);

  const loadStudentAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/matomo/analytics/VisitsSummary.get?period=last30&segment=userId==${studentId}`, {
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
      console.error('Student analytics error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
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
          <h2 className="text-xl font-bold text-gray-900">Your Learning Analytics</h2>
          <p className="text-gray-600">Track your progress and learning patterns</p>
        </div>
        
        <button
          onClick={loadStudentAnalytics}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Learning Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Study Time */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Study Time</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatTime(analyticsData?.avg_time_on_site || 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Lessons Completed */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Lessons Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData?.nb_actions || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Learning Streak */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Learning Streak</p>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData?.nb_visits || 0} days
              </p>
            </div>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPercentage(analyticsData?.conversion_rate || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Study Schedule */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Study Schedule</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Most Active Day</p>
                  <p className="text-sm text-gray-600">Monday</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-blue-600">2.5 hours</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Peak Study Time</p>
                  <p className="text-sm text-gray-600">2:00 PM - 4:00 PM</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-green-600">1.8 hours</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center">
                <Target className="h-5 w-5 text-purple-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Weekly Goal</p>
                  <p className="text-sm text-gray-600">10 hours study time</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-purple-600">8.5 hours</p>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Preferences */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Preferences</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <PlayCircle className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Video Content</p>
                  <p className="text-sm text-gray-600">Most engaging content type</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-blue-600">75%</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <BookOpen className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Reading Material</p>
                  <p className="text-sm text-gray-600">Text-based content</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-green-600">60%</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center">
                <MessageSquare className="h-5 w-5 text-purple-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Interactive Content</p>
                  <p className="text-sm text-gray-600">H5P and quizzes</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-purple-600">85%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Insights */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Insights</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Study Patterns */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Study Patterns</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Morning Study</span>
                <span className="text-sm font-medium">30%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Afternoon Study</span>
                <span className="text-sm font-medium">50%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '50%' }}></div>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Evening Study</span>
                <span className="text-sm font-medium">20%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '20%' }}></div>
              </div>
            </div>
          </div>

          {/* Learning Goals */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Learning Goals</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                <span className="text-sm text-gray-700">Complete 5 lessons this week</span>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              
              <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                <span className="text-sm text-gray-700">Study for 2 hours daily</span>
                <div className="w-4 h-4 border-2 border-yellow-600 rounded-full"></div>
              </div>
              
              <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                <span className="text-sm text-gray-700">Participate in 3 forum discussions</span>
                <div className="w-4 h-4 border-2 border-yellow-600 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Recommendations</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Study Time Optimization</h4>
            <p className="text-sm text-gray-600">
              You're most productive in the afternoon. Try to schedule your most challenging lessons during 2:00 PM - 4:00 PM.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Content Engagement</h4>
            <p className="text-sm text-gray-600">
              Interactive content works best for you. Focus on H5P exercises and quizzes to improve retention.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAnalytics;
