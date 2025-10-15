import React, { useState } from 'react';
import { 
  BookOpen, 
  Target, 
  Clock, 
  Users, 
  CheckCircle, 
  AlertCircle,
  Info,
  Terminal,
  Network,
  Settings
} from 'lucide-react';

const LabInstructions = ({ template, labSession, selectedDevice }) => {
  const [activeTab, setActiveTab] = useState('instructions');

  const tabs = [
    { id: 'instructions', label: 'Instructions', icon: BookOpen },
    { id: 'objectives', label: 'Objectives', icon: Target },
    { id: 'devices', label: 'Devices', icon: Network },
    { id: 'tips', label: 'Tips', icon: Info }
  ];

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'running':
        return 'text-green-600 bg-green-100';
      case 'starting':
        return 'text-blue-600 bg-blue-100';
      case 'stopped':
        return 'text-gray-600 bg-gray-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const renderInstructions = () => (
    <div className="space-y-4">
      {template?.instructions ? (
        <div className="prose prose-sm max-w-none">
          <div dangerouslySetInnerHTML={{ 
            __html: template.instructions.replace(/\n/g, '<br>') 
          }} />
        </div>
      ) : (
        <div className="text-gray-500 italic">
          No specific instructions provided for this lab.
        </div>
      )}

      {labSession && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
            <Terminal className="w-4 h-4 mr-2" />
            Lab Status
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span>Status:</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(labSession.status)}`}>
                {labSession.status?.charAt(0).toUpperCase() + labSession.status?.slice(1)}
              </span>
            </div>
            {labSession.startedAt && (
              <div className="flex items-center justify-between">
                <span>Started:</span>
                <span className="text-gray-600">
                  {new Date(labSession.startedAt).toLocaleTimeString()}
                </span>
              </div>
            )}
            {labSession.lastActivity && (
              <div className="flex items-center justify-between">
                <span>Last Activity:</span>
                <span className="text-gray-600">
                  {new Date(labSession.lastActivity).toLocaleTimeString()}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {selectedDevice && labSession?.devices?.[selectedDevice] && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
          <h4 className="font-semibold text-green-900 mb-2 flex items-center">
            <Settings className="w-4 h-4 mr-2" />
            Current Device: {selectedDevice}
          </h4>
          <div className="text-sm text-green-800">
            <p>Type: {labSession.devices[selectedDevice].type}</p>
            {labSession.devices[selectedDevice].host && (
              <p>Host: {labSession.devices[selectedDevice].host}:{labSession.devices[selectedDevice].port}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderObjectives = () => (
    <div className="space-y-4">
      {template?.learningObjectives && template.learningObjectives.length > 0 ? (
        <ul className="space-y-2">
          {template.learningObjectives.map((objective, index) => (
            <li key={index} className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">{objective}</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-gray-500 italic">
          No learning objectives specified for this lab.
        </div>
      )}

      {template?.prerequisites && template.prerequisites.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2 text-yellow-500" />
            Prerequisites
          </h4>
          <ul className="space-y-1">
            {template.prerequisites.map((prereq, index) => (
              <li key={index} className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                <span className="text-sm text-gray-600">{prereq}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  const renderDevices = () => (
    <div className="space-y-4">
      {labSession?.devices ? (
        <div className="space-y-3">
          {Object.entries(labSession.devices).map(([deviceId, device]) => (
            <div 
              key={deviceId}
              className={`p-3 rounded-lg border ${
                selectedDevice === deviceId 
                  ? 'border-blue-300 bg-blue-50' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Network className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-sm">{deviceId}</span>
                </div>
                <span className="text-xs text-gray-500">{device.type}</span>
              </div>
              {device.host && (
                <div className="mt-1 text-xs text-gray-600">
                  {device.host}:{device.port}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500 italic text-center py-8">
          <Network className="w-8 h-8 mx-auto mb-2 text-gray-300" />
          <p>Start the lab to view available devices</p>
        </div>
      )}
    </div>
  );

  const renderTips = () => (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-1 flex items-center">
            <Terminal className="w-4 h-4 mr-2" />
            Terminal Usage
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Click on devices in the topology to connect to their console</li>
            <li>• Use standard networking commands (ping, traceroute, show, etc.)</li>
            <li>• Press Ctrl+C to interrupt long-running commands</li>
            <li>• Use Tab for command completion where available</li>
          </ul>
        </div>

        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <h4 className="font-semibold text-green-900 mb-1 flex items-center">
            <CheckCircle className="w-4 h-4 mr-2" />
            Best Practices
          </h4>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• Save your work frequently using the Save button</li>
            <li>• Document your configuration changes</li>
            <li>• Test connectivity between devices</li>
            <li>• Follow the lab instructions step by step</li>
          </ul>
        </div>

        <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <h4 className="font-semibold text-yellow-900 mb-1 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" />
            Troubleshooting
          </h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• If a device doesn't respond, try reconnecting</li>
            <li>• Check device status in the topology view</li>
            <li>• Restart the lab if you encounter persistent issues</li>
            <li>• Contact support if problems persist</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'instructions':
        return renderInstructions();
      case 'objectives':
        return renderObjectives();
      case 'devices':
        return renderDevices();
      case 'tips':
        return renderTips();
      default:
        return renderInstructions();
    }
  };

  if (!template) {
    return (
      <div className="text-center py-8 text-gray-500">
        <BookOpen className="w-8 h-8 mx-auto mb-2 text-gray-300" />
        <p>No lab template available</p>
      </div>
    );
  }

  return (
    <div className="h-full">
      {/* Lab Info Header */}
      <div className="mb-4 pb-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900">{template.name}</h3>
          <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(template.difficulty)}`}>
            {template.difficulty?.charAt(0).toUpperCase() + template.difficulty?.slice(1)}
          </span>
        </div>
        {template.description && (
          <p className="text-sm text-gray-600">{template.description}</p>
        )}
        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
          {template.estimatedDuration && (
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {template.estimatedDuration} min
            </div>
          )}
          {template.maxConcurrentUsers && (
            <div className="flex items-center">
              <Users className="w-3 h-3 mr-1" />
              Max {template.maxConcurrentUsers} users
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-1 px-3 py-2 rounded text-xs font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="h-64 overflow-y-auto">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default LabInstructions;

