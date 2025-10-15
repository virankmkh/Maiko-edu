import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const CourseCreationTest = () => {
  const { user } = useAuth();
  const [testResult, setTestResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const testCourseCreation = async () => {
    setIsLoading(true);
    setTestResult(null);

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setTestResult({
          success: false,
          error: 'No authentication token found. Please log in first.'
        });
        return;
      }

      if (!user) {
        setTestResult({
          success: false,
          error: 'No user data found. Please refresh the page and log in again.'
        });
        return;
      }

      if (user.role !== 'instructor' && user.role !== 'organization_admin') {
        setTestResult({
          success: false,
          error: `Access denied. Your role is '${user.role}'. Only instructors or organization admins can create courses.`
        });
        return;
      }

      const testCourseData = {
        title: 'Debug Test Course',
        category: 'technology',
        shortDescription: 'A test course for debugging course creation',
        fullDescription: 'This is a test course created for debugging purposes. It should be deleted after testing.',
        difficulty: 'beginner',
        language: 'english',
        price: 10,
        duration: '1 hour'
      };

      console.log('🧪 Testing course creation with data:', testCourseData);
      console.log('🔑 Using token:', token.substring(0, 20) + '...');

      const response = await fetch('http://localhost:5001/api/courses', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testCourseData)
      });

      const result = await response.json();

      if (response.ok) {
        setTestResult({
          success: true,
          message: 'Course creation test successful!',
          course: result
        });
        
        // Clean up the test course
        setTimeout(async () => {
          try {
            await fetch(`http://localhost:5001/api/courses/${result.id}`, {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            console.log('🧹 Test course cleaned up');
          } catch (error) {
            console.log('⚠️ Could not clean up test course:', error.message);
          }
        }, 5000);
        
      } else {
        setTestResult({
          success: false,
          error: `API Error (${response.status}): ${result.message || 'Unknown error'}`,
          details: result
        });
      }

    } catch (error) {
      setTestResult({
        success: false,
        error: `Network Error: ${error.message}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Course Creation Debug Tool</h1>
          
          {/* User Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Current User Status</h2>
            {user ? (
              <div className="space-y-2">
                <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> <span className={`px-2 py-1 rounded text-sm ${
                  user.role === 'instructor' || user.role === 'organization_admin' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>{user.role}</span></p>
                <p><strong>Can Create Courses:</strong> {
                  user.role === 'instructor' || user.role === 'organization_admin' 
                    ? '✅ Yes' 
                    : '❌ No'
                }</p>
              </div>
            ) : (
              <p className="text-red-600">❌ No user data found. Please log in.</p>
            )}
          </div>

          {/* Test Button */}
          <div className="mb-6">
            <button
              onClick={testCourseCreation}
              disabled={isLoading || !user}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              {isLoading ? 'Testing...' : 'Test Course Creation'}
            </button>
          </div>

          {/* Test Results */}
          {testResult && (
            <div className={`p-4 rounded-lg ${
              testResult.success 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <h3 className={`text-lg font-semibold mb-2 ${
                testResult.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {testResult.success ? '✅ Test Successful' : '❌ Test Failed'}
              </h3>
              
              {testResult.success ? (
                <div>
                  <p className="text-green-700 mb-2">{testResult.message}</p>
                  {testResult.course && (
                    <div className="text-sm text-green-600">
                      <p><strong>Course ID:</strong> {testResult.course.id}</p>
                      <p><strong>Title:</strong> {testResult.course.title}</p>
                      <p><strong>Price:</strong> ${testResult.course.price}</p>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Note: Test course will be automatically deleted in 5 seconds.
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-red-700 mb-2">{testResult.error}</p>
                  {testResult.details && (
                    <pre className="text-xs text-red-600 bg-red-100 p-2 rounded mt-2 overflow-auto">
                      {JSON.stringify(testResult.details, null, 2)}
                    </pre>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Instructions */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">How to Use This Tool</h3>
            <ol className="list-decimal list-inside space-y-1 text-blue-800 text-sm">
              <li>Make sure you're logged in as an instructor or organization admin</li>
              <li>Click "Test Course Creation" to test the API</li>
              <li>Check the results to see what's preventing course creation</li>
              <li>If successful, the test course will be automatically deleted</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCreationTest;
