import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Play, 
  Clock, 
  Users, 
  Award,
  CheckCircle,
  AlertCircle,
  Lock,
  Unlock
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const CourseLabIntegration = ({ course, user }) => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const [labTemplates, setLabTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [enrollmentStatus, setEnrollmentStatus] = useState(null);

  useEffect(() => {
    if (course) {
      checkLabAccess();
      loadLabTemplates();
    }
  }, [course, user]);

  const checkLabAccess = async () => {
    try {
      // Check if user is enrolled in the course
      const enrollmentResponse = await fetch(`/api/enrollments/check/${courseId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (enrollmentResponse.ok) {
        const enrollmentData = await enrollmentResponse.json();
        setEnrollmentStatus(enrollmentData.data);
        setHasAccess(enrollmentData.data?.isEnrolled || false);
      } else {
        setHasAccess(false);
      }
    } catch (error) {
      console.error('Error checking lab access:', error);
      setHasAccess(false);
    }
  };

  const loadLabTemplates = async () => {
    try {
      setIsLoading(true);
      
      if (!course?.hasLabContent) {
        setLabTemplates([]);
        return;
      }

      const response = await fetch(`/api/labs/templates/${courseId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setLabTemplates(data.data || []);
      }
    } catch (error) {
      console.error('Error loading lab templates:', error);
      toast.error('Failed to load lab templates');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartLab = (templateId) => {
    if (!hasAccess) {
      toast.error('You must be enrolled in this course to access labs');
      return;
    }

    navigate(`/lab/${courseId}/${templateId}`);
  };

  const handleEnroll = async () => {
    try {
      const response = await fetch('/api/enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ courseId: parseInt(courseId) })
      });

      if (response.ok) {
        toast.success('Successfully enrolled in course!');
        checkLabAccess();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to enroll in course');
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
      toast.error('Failed to enroll in course');
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return 'text-green-600 bg-green-100';
      case 'intermediate':
        return 'text-yellow-600 bg-yellow-100';
      case 'advanced':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getAccessLevel = () => {
    if (!course?.hasLabContent) return 'none';
    if (!hasAccess) return 'locked';
    return course.labAccessLevel || 'basic';
  };

  const renderAccessMessage = () => {
    const accessLevel = getAccessLevel();

    if (accessLevel === 'none') {
      return (
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Lab Content</h3>
          <p className="text-gray-600">
            This course doesn't include hands-on networking labs.
          </p>
        </div>
      );
    }

    if (accessLevel === 'locked') {
      return (
        <div className="bg-yellow-50 rounded-lg p-6 text-center">
          <Lock className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Lab Access Required</h3>
          <p className="text-gray-600 mb-4">
            You need to be enrolled in this course to access the networking labs.
          </p>
          <button
            onClick={handleEnroll}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Enroll in Course
          </button>
        </div>
      );
    }

    return null;
  };

  const renderLabTemplates = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      );
    }

    if (labTemplates.length === 0) {
      return (
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Lab Templates</h3>
          <p className="text-gray-600">
            Lab templates haven't been created for this course yet.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {labTemplates.map((template) => (
          <div key={template.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {template.name}
                  </h3>
                  <p className="text-gray-600 mb-3">
                    {template.description}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {template.estimatedDuration} min
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      Max {template.maxConcurrentUsers} users
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(template.difficulty)}`}>
                      {template.difficulty}
                    </span>
                  </div>

                  {template.learningObjectives && template.learningObjectives.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Learning Objectives:</h4>
                      <ul className="space-y-1">
                        {template.learningObjectives.slice(0, 3).map((objective, index) => (
                          <li key={index} className="flex items-start text-sm text-gray-600">
                            <CheckCircle className="w-3 h-3 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{objective}</span>
                          </li>
                        ))}
                        {template.learningObjectives.length > 3 && (
                          <li className="text-xs text-gray-500">
                            +{template.learningObjectives.length - 3} more objectives
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <Unlock className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600 font-medium">Available</span>
                </div>
                
                <button
                  onClick={() => handleStartLab(template.id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Play className="w-4 h-4" />
                  <span>Start Lab</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const accessLevel = getAccessLevel();

  if (accessLevel === 'none' || accessLevel === 'locked') {
    return renderAccessMessage();
  }

  return (
    <div className="space-y-6">
      {/* Lab Access Header */}
      <div className="bg-blue-50 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-blue-900 mb-2">
              Hands-on Networking Labs
            </h2>
            <p className="text-blue-700">
              Practice networking concepts with real virtual devices in a safe environment.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Unlock className="w-6 h-6 text-blue-600" />
            <span className="text-blue-600 font-medium">Access Granted</span>
          </div>
        </div>
      </div>

      {/* Course Lab Information */}
      {course?.labInstructions && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Lab Instructions</h3>
          <div className="prose prose-sm max-w-none text-gray-700">
            <p>{course.labInstructions}</p>
          </div>
        </div>
      )}

      {/* Prerequisites */}
      {course?.labPrerequisites && course.labPrerequisites.length > 0 && (
        <div className="bg-yellow-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-900 mb-3 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            Lab Prerequisites
          </h3>
          <ul className="space-y-2">
            {course.labPrerequisites.map((prereq, index) => (
              <li key={index} className="flex items-start text-yellow-800">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>{prereq}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Lab Templates */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Labs</h3>
        {renderLabTemplates()}
      </div>

      {/* Lab Access Level Info */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Lab Access Level: <strong>{course?.labAccessLevel || 'Basic'}</strong></span>
          <span>Enrollment Status: <strong>{enrollmentStatus?.isEnrolled ? 'Enrolled' : 'Not Enrolled'}</strong></span>
        </div>
      </div>
    </div>
  );
};

export default CourseLabIntegration;

