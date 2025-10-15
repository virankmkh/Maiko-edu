import React, { useState } from 'react';
import { Calendar, FileText, Upload, CheckCircle, AlertCircle } from 'lucide-react';

const AssignmentComponent = ({ assignmentData }) => {
  const [submission, setSubmission] = useState({
    text: '',
    files: [],
    links: []
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleTextChange = (e) => {
    setSubmission(prev => ({
      ...prev,
      text: e.target.value
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setSubmission(prev => ({
      ...prev,
      files: [...prev.files, ...files]
    }));
  };

  const addLink = () => {
    const link = prompt('Enter link URL:');
    if (link) {
      setSubmission(prev => ({
        ...prev,
        links: [...prev.links, link]
      }));
    }
  };

  const submitAssignment = () => {
    // In a real app, this would submit to the server
    console.log('Submitting assignment:', submission);
    setIsSubmitted(true);
    alert('Assignment submitted successfully! (This is a demo)');
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isOverdue = new Date(assignmentData.dueDate) < new Date();

  return (
    <div className="space-y-6">
      {/* Assignment Header */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h4 className="text-xl font-semibold text-gray-900 mb-2">
              {assignmentData.title}
            </h4>
            <p className="text-gray-700">{assignmentData.description}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <Calendar className="w-4 h-4 mr-1" />
              Due: {formatDate(assignmentData.dueDate)}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <FileText className="w-4 h-4 mr-1" />
              {assignmentData.maxPoints} points
            </div>
            {isOverdue && (
              <div className="flex items-center text-sm text-red-600 mt-1">
                <AlertCircle className="w-4 h-4 mr-1" />
                Overdue
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h5 className="text-lg font-semibold text-blue-900 mb-3">Instructions</h5>
        <ol className="list-decimal list-inside space-y-2 text-blue-800">
          {assignmentData.instructions.map((instruction, index) => (
            <li key={index}>{instruction}</li>
          ))}
        </ol>
      </div>

      {/* Deliverables */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h5 className="text-lg font-semibold text-green-900 mb-3">Deliverables</h5>
        <ul className="list-disc list-inside space-y-1 text-green-800">
          {assignmentData.deliverables.map((deliverable, index) => (
            <li key={index}>{deliverable}</li>
          ))}
        </ul>
      </div>

      {!isSubmitted ? (
        /* Submission Form */
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h5 className="text-lg font-semibold text-gray-900 mb-4">Submit Your Assignment</h5>
          
          {/* Text Submission */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Written Response (Optional)
            </label>
            <textarea
              value={submission.text}
              onChange={handleTextChange}
              rows={6}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Write your response here..."
            />
          </div>

          {/* File Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Files
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer text-blue-600 hover:text-blue-700"
              >
                Click to upload files
              </label>
              <p className="text-sm text-gray-500 mt-1">
                PDF, DOC, images, or code files
              </p>
            </div>
            {submission.files.length > 0 && (
              <div className="mt-3">
                <h6 className="text-sm font-medium text-gray-700 mb-2">Uploaded Files:</h6>
                <ul className="space-y-1">
                  {submission.files.map((file, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      📎 {file.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Links */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Links (GitHub, Live Demo, etc.)
            </label>
            <div className="flex space-x-2">
              <input
                type="url"
                placeholder="https://github.com/username/repo"
                className="flex-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addLink();
                    e.target.value = '';
                  }
                }}
              />
              <button
                onClick={addLink}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Add Link
              </button>
            </div>
            {submission.links.length > 0 && (
              <div className="mt-3">
                <h6 className="text-sm font-medium text-gray-700 mb-2">Added Links:</h6>
                <ul className="space-y-1">
                  {submission.links.map((link, index) => (
                    <li key={index} className="text-sm">
                      <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                        🔗 {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              onClick={submitAssignment}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Submit Assignment
            </button>
          </div>
        </div>
      ) : (
        /* Submission Confirmation */
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h5 className="text-lg font-semibold text-green-900 mb-2">
            Assignment Submitted Successfully!
          </h5>
          <p className="text-green-700">
            Your assignment has been submitted and is under review.
          </p>
          <div className="mt-4 text-sm text-green-600">
            Submitted on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentComponent;
