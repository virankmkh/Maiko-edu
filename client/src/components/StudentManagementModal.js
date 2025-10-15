import React, { useState, useEffect } from 'react';

const StudentManagementModal = ({ isOpen, onClose, course }) => {
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [currentStudents, setCurrentStudents] = useState([]);
  const [completedStudents, setCompletedStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentProgress, setStudentProgress] = useState(null);
  const [studentActivity, setStudentActivity] = useState([]);
  const [showStudentDetail, setShowStudentDetail] = useState(false);
  const [filter, setFilter] = useState('all'); // all, studying, completed, inactive

  useEffect(() => {
    if (isOpen && course) {
      loadStudents();
    }
  }, [isOpen, course]);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // If course.id is 'all', we need to fetch students from all courses
      if (course.id === 'all') {
        // For now, let's fetch from all courses individually and combine
        // This is a simplified approach - in production you'd want a dedicated endpoint
        const allStudentsData = [];
        const allCurrentStudents = [];
        const allCompletedStudents = [];
        
        // Get all courses for this instructor
        const coursesResponse = await fetch('http://localhost:5001/api/courses/instructor', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (coursesResponse.ok) {
          const coursesData = await coursesResponse.json();
          const courses = coursesData.courses || [];
          
          // Fetch students from each course
          for (const courseItem of courses) {
            try {
              const studentsResponse = await fetch(`http://localhost:5001/api/courses/${courseItem.id}/students`, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              });
              
              if (studentsResponse.ok) {
                const studentsData = await studentsResponse.json();
                console.log(`API Response for course ${courseItem.id}:`, studentsData);
                const students = studentsData.students?.total || [];
                const current = studentsData.students?.current || [];
                const completed = studentsData.students?.completed || [];
                
                // Add course info to each student and ensure all required properties exist
                const studentsWithCourse = students.map(student => ({
                  ...student,
                  firstName: student.firstName || student.name?.split(' ')[0] || 'Unknown',
                  lastName: student.lastName || student.name?.split(' ').slice(1).join(' ') || 'Student',
                  name: student.name || `${student.firstName || 'Unknown'} ${student.lastName || 'Student'}`,
                  progressPercentage: student.progress || 0,
                  lessonsCompleted: Math.floor((student.progress || 0) / 10), // Estimate
                  totalLessons: 10, // Default estimate
                  lastActivityAt: student.lastAccessedAt || student.enrolledAt,
                  isActive: student.isActive !== undefined ? student.isActive : true,
                  courseTitle: courseItem.title,
                  courseId: courseItem.id
                }));
                const currentWithCourse = current.map(student => ({
                  ...student,
                  firstName: student.firstName || student.name?.split(' ')[0] || 'Unknown',
                  lastName: student.lastName || student.name?.split(' ').slice(1).join(' ') || 'Student',
                  name: student.name || `${student.firstName || 'Unknown'} ${student.lastName || 'Student'}`,
                  progressPercentage: student.progress || 0,
                  lessonsCompleted: Math.floor((student.progress || 0) / 10),
                  totalLessons: 10,
                  lastActivityAt: student.lastAccessedAt || student.enrolledAt,
                  isActive: student.isActive !== undefined ? student.isActive : true,
                  courseTitle: courseItem.title,
                  courseId: courseItem.id
                }));
                const completedWithCourse = completed.map(student => ({
                  ...student,
                  firstName: student.firstName || student.name?.split(' ')[0] || 'Unknown',
                  lastName: student.lastName || student.name?.split(' ').slice(1).join(' ') || 'Student',
                  name: student.name || `${student.firstName || 'Unknown'} ${student.lastName || 'Student'}`,
                  progressPercentage: student.progress || 100,
                  lessonsCompleted: 10, // Completed course
                  totalLessons: 10,
                  lastActivityAt: student.lastAccessedAt || student.enrolledAt,
                  isActive: student.isActive !== undefined ? student.isActive : false,
                  courseTitle: courseItem.title,
                  courseId: courseItem.id
                }));
                
                allStudentsData.push(...studentsWithCourse);
                allCurrentStudents.push(...currentWithCourse);
                allCompletedStudents.push(...completedWithCourse);
              }
            } catch (err) {
              console.error(`Error loading students for course ${courseItem.id}:`, err);
            }
          }
        }
        
        setAllStudents(allStudentsData);
        setCurrentStudents(allCurrentStudents);
        setCompletedStudents(allCompletedStudents);
        setStudents(allStudentsData); // Show all by default
        console.log('Loaded students from all courses:', {
          total: allStudentsData.length,
          current: allCurrentStudents.length,
          completed: allCompletedStudents.length
        });
      } else {
        // Single course
        const response = await fetch(`http://localhost:5001/api/courses/${course.id}/students`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          console.log('API Response for single course:', data);
          // The API returns { statistics: {...}, students: { total: [...], current: [...], completed: [...] } }
          
          // Map students to ensure all required properties exist
          const mapStudentData = (studentList) => {
            return studentList.map(student => ({
              ...student,
              firstName: student.firstName || student.name?.split(' ')[0] || 'Unknown',
              lastName: student.lastName || student.name?.split(' ').slice(1).join(' ') || 'Student',
              name: student.name || `${student.firstName || 'Unknown'} ${student.lastName || 'Student'}`,
              progressPercentage: student.progress || 0,
              lessonsCompleted: Math.floor((student.progress || 0) / 10),
              totalLessons: 10,
              lastActivityAt: student.lastAccessedAt || student.enrolledAt,
              isActive: student.isActive !== undefined ? student.isActive : true
            }));
          };
          
          const allStudents = mapStudentData(data.students?.total || []);
          const currentStudents = mapStudentData(data.students?.current || []);
          const completedStudents = mapStudentData(data.students?.completed || []);
          
          setAllStudents(allStudents);
          setCurrentStudents(currentStudents);
          setCompletedStudents(completedStudents);
          setStudents(allStudents); // Show all by default
          console.log('Loaded students:', {
            total: data.students?.total?.length || 0,
            current: data.students?.current?.length || 0,
            completed: data.students?.completed?.length || 0
          });
        } else {
          console.error('Failed to load students');
          setStudents([]);
          setAllStudents([]);
          setCurrentStudents([]);
          setCompletedStudents([]);
        }
      }
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStudentProgress = async (studentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/students/${studentId}/progress/${course.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStudentProgress(data);
      }
    } catch (error) {
      console.error('Error loading student progress:', error);
    }
  };

  const loadStudentActivity = async (studentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/students/${studentId}/activity/${course.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStudentActivity(data);
      }
    } catch (error) {
      console.error('Error loading student activity:', error);
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    switch (newFilter) {
      case 'all':
        setStudents(allStudents);
        break;
      case 'studying':
        setStudents(currentStudents);
        break;
      case 'completed':
        setStudents(completedStudents);
        break;
      case 'inactive':
        // Students who are enrolled but not active (progress = 0 and last accessed long ago)
        const inactiveStudents = allStudents.filter(student => 
          student.progress === 0 && 
          (!student.lastAccessedAt || new Date(student.lastAccessedAt) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
        );
        setStudents(inactiveStudents);
        break;
      default:
        setStudents(allStudents);
    }
  };

  const handleStudentClick = async (student) => {
    setSelectedStudent(student);
    setShowStudentDetail(true);
    await Promise.all([
      loadStudentProgress(student.id),
      loadStudentActivity(student.id)
    ]);
  };

  const getStudentStatus = (student) => {
    if (student.isActive) {
      return { status: 'active', color: 'bg-green-100 text-green-800', text: 'Studying' };
    } else if (student.progressPercentage === 100) {
      return { status: 'completed', color: 'bg-blue-100 text-blue-800', text: 'Completed' };
    } else if (student.lastActivityAt) {
      const daysSinceActivity = Math.floor((new Date() - new Date(student.lastActivityAt)) / (1000 * 60 * 60 * 24));
      if (daysSinceActivity > 7) {
        return { status: 'inactive', color: 'bg-red-100 text-red-800', text: 'Inactive' };
      }
      return { status: 'paused', color: 'bg-yellow-100 text-yellow-800', text: 'Paused' };
    }
    return { status: 'not-started', color: 'bg-gray-100 text-gray-800', text: 'Not Started' };
  };

  const filteredStudents = students.filter(student => {
    const studentStatus = getStudentStatus(student);
    switch (filter) {
      case 'active':
        return studentStatus.status === 'active';
      case 'completed':
        return studentStatus.status === 'completed';
      case 'inactive':
        return studentStatus.status === 'inactive';
      default:
        return true;
    }
  });

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    if (percentage >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Student Management - {course?.title}</h2>
          <button 
            onClick={onClose} 
            className="text-white hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Students List */}
          <div className="w-1/3 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Enrolled Students ({students.length})
                </h3>
                <button
                  onClick={loadStudents}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  🔄 Refresh
                </button>
              </div>

              {/* Filter Buttons */}
              <div className="flex space-x-2 mb-4">
                <button
                  onClick={() => handleFilterChange('all')}
                  className={`px-3 py-1 rounded text-sm ${
                    filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  All ({allStudents.length})
                </button>
                <button
                  onClick={() => handleFilterChange('studying')}
                  className={`px-3 py-1 rounded text-sm ${
                    filter === 'studying' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Studying ({currentStudents.length})
                </button>
                <button
                  onClick={() => handleFilterChange('completed')}
                  className={`px-3 py-1 rounded text-sm ${
                    filter === 'completed' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Completed ({completedStudents.length})
                </button>
                <button
                  onClick={() => handleFilterChange('inactive')}
                  className={`px-3 py-1 rounded text-sm ${
                    filter === 'inactive' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Inactive
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-gray-500">Loading students...</div>
              ) : (
                <div className="space-y-2 p-2">
                  {filteredStudents.map(student => {
                    const status = getStudentStatus(student);
                    return (
                      <div
                        key={student.id}
                        className={`p-3 rounded cursor-pointer border ${
                          selectedStudent?.id === student.id
                            ? 'bg-blue-100 border-blue-300'
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => handleStudentClick(student)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 text-sm">
                              {student.firstName} {student.lastName}
                            </h4>
                            <p className="text-xs text-gray-600 mt-1">
                              {student.email}
                            </p>
                            <div className="flex items-center space-x-2 mt-2">
                              <span className={`text-xs px-2 py-1 rounded ${status.color}`}>
                                {status.text}
                              </span>
                              <span className="text-xs text-gray-500">
                                {student.progressPercentage || 0}% complete
                              </span>
                            </div>
                            {student.lastActivityAt && (
                              <p className="text-xs text-gray-500 mt-1">
                                Last active: {new Date(student.lastActivityAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="w-16 h-2 bg-gray-200 rounded-full mb-1">
                              <div
                                className={`h-2 rounded-full ${getProgressColor(student.progressPercentage || 0)}`}
                                style={{ width: `${student.progressPercentage || 0}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500">
                              {student.lessonsCompleted || 0}/{student.totalLessons || 0} lessons
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Student Detail View */}
          <div className="flex-1 flex flex-col">
            {selectedStudent ? (
              <>
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedStudent.firstName} {selectedStudent.lastName}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedStudent.email}
                  </p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <span>Enrolled: {new Date(selectedStudent.enrolledAt).toLocaleDateString()}</span>
                    <span>Progress: {selectedStudent.progressPercentage || 0}%</span>
                    <span>Lessons: {selectedStudent.lessonsCompleted || 0}/{selectedStudent.totalLessons || 0}</span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  {/* Progress Overview */}
                  {studentProgress && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Progress Overview</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h5 className="font-medium text-gray-700 mb-2">Overall Progress</h5>
                          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                            <div
                              className={`h-3 rounded-full ${getProgressColor(studentProgress.overallProgress || 0)}`}
                              style={{ width: `${studentProgress.overallProgress || 0}%` }}
                            ></div>
                          </div>
                          <p className="text-sm text-gray-600">{studentProgress.overallProgress || 0}% Complete</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h5 className="font-medium text-gray-700 mb-2">Time Spent</h5>
                          <p className="text-2xl font-bold text-blue-600">
                            {Math.floor((studentProgress.totalTimeSpent || 0) / 60)}h {Math.floor((studentProgress.totalTimeSpent || 0) % 60)}m
                          </p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h5 className="font-medium text-gray-700 mb-2">Last Activity</h5>
                          <p className="text-sm text-gray-600">
                            {studentProgress.lastActivityAt ? 
                              new Date(studentProgress.lastActivityAt).toLocaleString() : 
                              'No activity'
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Lesson Progress */}
                  {studentProgress?.lessons && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Lesson Progress</h4>
                      <div className="space-y-3">
                        {studentProgress.lessons.map((lesson, index) => (
                          <div key={lesson.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium text-gray-900">
                                {index + 1}. {lesson.title}
                              </h5>
                              <span className={`text-sm px-2 py-1 rounded ${
                                lesson.status === 'completed' ? 'bg-green-100 text-green-800' :
                                lesson.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {lesson.status || 'Not Started'}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                              <div
                                className={`h-2 rounded-full ${getProgressColor(lesson.progressPercentage || 0)}`}
                                style={{ width: `${lesson.progressPercentage || 0}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                              <span>{lesson.progressPercentage || 0}% Complete</span>
                              <span>Time: {Math.floor((lesson.timeSpent || 0) / 60)}m {Math.floor((lesson.timeSpent || 0) % 60)}s</span>
                            </div>
                            {lesson.lastActivityAt && (
                              <p className="text-xs text-gray-500 mt-1">
                                Last activity: {new Date(lesson.lastActivityAt).toLocaleString()}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Activity Timeline */}
                  {studentActivity.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Recent Activity</h4>
                      <div className="space-y-3">
                        {studentActivity.slice(0, 10).map((activity, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 text-sm">
                                  {activity.activityType === 'lesson_started' ? '▶️' :
                                   activity.activityType === 'lesson_completed' ? '✅' :
                                   activity.activityType === 'lesson_in_progress' ? '⏳' :
                                   activity.activityType === 'quiz_attempted' ? '📝' :
                                   activity.activityType === 'assignment_submitted' ? '📄' :
                                   '💬'}
                                </span>
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-900">
                                {activity.activityDescription}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(activity.timestamp).toLocaleString()}
                              </p>
                              {activity.metadata && (
                                <div className="mt-2 text-xs text-gray-600">
                                  {Object.entries(activity.metadata).map(([key, value]) => (
                                    <span key={key} className="mr-3">
                                      {key}: {value}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <div className="text-4xl mb-4">👥</div>
                  <h3 className="text-lg font-medium mb-2">Select a Student</h3>
                  <p>Choose a student from the list to view their detailed progress and activity.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentManagementModal;
