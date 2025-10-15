import React, { useState, useEffect } from 'react';

const SimpleStudentList = ({ isOpen, onClose, course }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && course) {
      loadStudents();
    }
  }, [isOpen, course]);

  const loadStudents = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      
      if (course.id === 'all') {
        // For "all courses", we'll show a simple message for now
        setStudents([]);
        setError('All courses view - to be implemented');
        return;
      }

      // Single course - fetch students using simple endpoint
      const response = await fetch(`http://localhost:5001/api/simple-students/${course.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('API Response:', data);
        
        // Simple mapping - just get the basic student info
        const studentList = data.students?.total || [];
        setStudents(studentList);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(`Failed to load students: ${response.status} ${response.statusText}`);
        console.error('Error details:', errorData);
      }
    } catch (error) {
      console.error('Error loading students:', error);
      setError(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">
            Students - {course?.title || 'All Courses'}
          </h2>
          <button 
            onClick={onClose} 
            className="text-white hover:text-gray-200 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading && (
            <div className="text-center py-8">
              <div className="text-blue-600 text-lg">Loading students...</div>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <div className="text-red-600 text-lg mb-4">{error}</div>
              <button 
                onClick={loadStudents}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && students.length === 0 && (
            <div className="text-center py-8">
              <div className="text-gray-600 text-lg">No students found</div>
            </div>
          )}

          {!loading && !error && students.length > 0 && (
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Found {students.length} student{students.length !== 1 ? 's' : ''}
                </h3>
              </div>

              <div className="space-y-3">
                {students.map((student, index) => (
                  <div 
                    key={student.id || index}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {student.name || `${student.firstName || ''} ${student.lastName || ''}`.trim() || 'Unknown Student'}
                        </h4>
                        <p className="text-sm text-gray-600">{student.email}</p>
                        {student.progress !== undefined && (
                          <p className="text-sm text-blue-600">
                            Progress: {student.progress}%
                          </p>
                        )}
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        {student.enrolledAt && (
                          <div>
                            Enrolled: {new Date(student.enrolledAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Debug Info */}
          <div className="mt-6 p-4 bg-gray-100 rounded text-sm">
            <details>
              <summary className="cursor-pointer font-medium">Debug Info</summary>
              <pre className="mt-2 text-xs overflow-auto">
                {JSON.stringify({ course, studentsCount: students.length, loading, error }, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleStudentList;
