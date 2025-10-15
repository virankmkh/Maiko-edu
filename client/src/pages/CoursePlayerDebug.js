import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const CoursePlayerDebug = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCourseData();
  }, [id]);

  const loadCourseData = async () => {
    try {
      setLoading(true);
      console.log('🔍 Loading course data for ID:', id);
      
      // Load course details
      const courseResponse = await fetch(`http://localhost:5001/api/courses/${id}`);
      console.log('📊 Course response status:', courseResponse.status);
      
      if (!courseResponse.ok) {
        throw new Error(`Course API error: ${courseResponse.status}`);
      }
      const courseData = await courseResponse.json();
      console.log('📚 Course data:', courseData);
      setCourse(courseData);

      // Load lessons
      const lessonsResponse = await fetch(`http://localhost:5001/api/lessons/course/${id}`);
      console.log('📊 Lessons response status:', lessonsResponse.status);
      
      if (!lessonsResponse.ok) {
        throw new Error(`Lessons API error: ${lessonsResponse.status}`);
      }
      const lessonsData = await lessonsResponse.json();
      console.log('📖 Lessons data:', lessonsData);
      setLessons(lessonsData.lessons || lessonsData || []);

    } catch (error) {
      console.error('❌ Error loading course data:', error);
      setError(`Failed to load course data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={loadCourseData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Course Player Debug</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Course Information</h2>
          {course ? (
            <div className="space-y-2">
              <p><strong>ID:</strong> {course.id}</p>
              <p><strong>Title:</strong> {course.title}</p>
              <p><strong>Description:</strong> {course.description}</p>
              <p><strong>Status:</strong> {course.status}</p>
              <p><strong>Price:</strong> ${course.price}</p>
              <p><strong>Lessons Count:</strong> {course.lessonsCount}</p>
            </div>
          ) : (
            <p className="text-red-600">No course data loaded</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Lessons Information</h2>
          {lessons && lessons.length > 0 ? (
            <div className="space-y-4">
              <p><strong>Total Lessons:</strong> {lessons.length}</p>
              {lessons.map((lesson, index) => (
                <div key={lesson.id} className="border border-gray-200 rounded p-4">
                  <h3 className="font-semibold text-gray-900">{index + 1}. {lesson.title}</h3>
                  <p className="text-gray-600 text-sm">{lesson.description}</p>
                  <p className="text-gray-500 text-xs">Type: {lesson.lessonType || 'N/A'}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-red-600">No lessons found</p>
          )}
        </div>

        <div className="mt-6 text-center">
          <button 
            onClick={loadCourseData}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Refresh Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoursePlayerDebug;
