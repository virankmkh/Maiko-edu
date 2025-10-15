import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Terminal } from '@xterm/xterm';
import { AttachAddon } from '@xterm/addon-attach';
import { toast } from 'react-hot-toast';
import { 
  Play, 
  Square, 
  Save, 
  RefreshCw, 
  Monitor, 
  Router, 
  Network, 
  Server,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import NetworkTopology from '../components/labs/NetworkTopology';
import TerminalComponent from '../components/labs/TerminalComponent';
import LabInstructions from '../components/labs/LabInstructions';
import LoadingSpinner from '../components/common/LoadingSpinner';

const LabPage = () => {
  const { courseId, templateId } = useParams();
  const navigate = useNavigate();
  
  const [labSession, setLabSession] = useState(null);
  const [labTemplate, setLabTemplate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [terminalConnected, setTerminalConnected] = useState(false);
  const [error, setError] = useState(null);

  // Load lab template and check for existing session
  useEffect(() => {
    loadLabData();
  }, [courseId, templateId]);

  const loadLabData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load lab template
      const templateResponse = await fetch(`/api/labs/templates/${templateId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!templateResponse.ok) {
        throw new Error('Failed to load lab template');
      }

      const templateData = await templateResponse.json();
      setLabTemplate(templateData.data);

      // Check for existing lab session
      const sessionResponse = await fetch(`/api/labs/my-sessions?courseId=${courseId}&status=running`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (sessionResponse.ok) {
        const sessionData = await sessionResponse.json();
        if (sessionData.data && sessionData.data.length > 0) {
          setLabSession(sessionData.data[0]);
        }
      }

    } catch (err) {
      console.error('Error loading lab data:', err);
      setError(err.message);
      toast.error('Failed to load lab data');
    } finally {
      setIsLoading(false);
    }
  };

  const startLab = async () => {
    try {
      setIsStarting(true);
      setError(null);

      const response = await fetch('/api/labs/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          templateId: parseInt(templateId),
          courseId: parseInt(courseId)
        })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to start lab');
      }

      setLabSession(data.data);
      toast.success('Lab started successfully!');
      
      // Auto-select first device if available
      if (data.data.devices && Object.keys(data.data.devices).length > 0) {
        const firstDevice = Object.keys(data.data.devices)[0];
        setSelectedDevice(firstDevice);
      }

    } catch (err) {
      console.error('Error starting lab:', err);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsStarting(false);
    }
  };

  const stopLab = async () => {
    try {
      setIsStopping(true);
      setError(null);

      const response = await fetch(`/api/labs/${labSession.id}/stop`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to stop lab');
      }

      setLabSession(null);
      setSelectedDevice(null);
      setTerminalConnected(false);
      toast.success('Lab stopped successfully!');

    } catch (err) {
      console.error('Error stopping lab:', err);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsStopping(false);
    }
  };

  const saveLab = async () => {
    try {
      setIsSaving(true);
      setError(null);

      const response = await fetch(`/api/labs/${labSession.id}/save`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to save lab');
      }

      toast.success('Lab saved successfully!');

    } catch (err) {
      console.error('Error saving lab:', err);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeviceSelect = (deviceId) => {
    setSelectedDevice(deviceId);
    setTerminalConnected(false);
  };

  const handleTerminalConnect = () => {
    setTerminalConnected(true);
  };

  const handleTerminalDisconnect = () => {
    setTerminalConnected(false);
  };

  const getStatusIcon = () => {
    if (!labSession) return <Clock className="w-5 h-5 text-gray-400" />;
    
    switch (labSession.status) {
      case 'running':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'starting':
        return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    if (!labSession) return 'Not Started';
    return labSession.status.charAt(0).toUpperCase() + labSession.status.slice(1);
  };

  const getDeviceIcon = (deviceType) => {
    switch (deviceType?.toLowerCase()) {
      case 'router':
      case 'ios':
        return <Router className="w-5 h-5" />;
      case 'switch':
      case 'iosv':
        return <Network className="w-5 h-5" />;
      case 'server':
        return <Server className="w-5 h-5" />;
      default:
        return <Monitor className="w-5 h-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error && !labTemplate) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Lab</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="text-gray-500 hover:text-gray-700"
              >
                ← Back
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {labTemplate?.name || 'Networking Lab'}
                </h1>
                <p className="text-sm text-gray-500">
                  {labTemplate?.description || 'Hands-on networking practice'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Status */}
              <div className="flex items-center space-x-2">
                {getStatusIcon()}
                <span className="text-sm font-medium text-gray-700">
                  {getStatusText()}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                {!labSession ? (
                  <button
                    onClick={startLab}
                    disabled={isStarting}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <Play className="w-4 h-4" />
                    <span>{isStarting ? 'Starting...' : 'Start Lab'}</span>
                  </button>
                ) : (
                  <>
                    {labSession.status === 'running' && (
                      <button
                        onClick={saveLab}
                        disabled={isSaving}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>{isSaving ? 'Saving...' : 'Save'}</span>
                      </button>
                    )}
                    <button
                      onClick={stopLab}
                      disabled={isStopping}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      <Square className="w-4 h-4" />
                      <span>{isStopping ? 'Stopping...' : 'Stop Lab'}</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Network Topology */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Network Topology</h2>
                <p className="text-sm text-gray-500">Click on devices to connect to their console</p>
              </div>
              <div className="p-4">
                {labSession && labSession.devices ? (
                  <NetworkTopology
                    devices={labSession.devices}
                    selectedDevice={selectedDevice}
                    onDeviceSelect={handleDeviceSelect}
                    getDeviceIcon={getDeviceIcon}
                  />
                ) : (
                  <div className="h-96 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <Monitor className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Start the lab to view network topology</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Terminal and Instructions */}
          <div className="space-y-6">
            {/* Terminal */}
            {labSession && labSession.status === 'running' && selectedDevice && (
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {getDeviceIcon(labSession.devices[selectedDevice]?.type)}
                      <span className="ml-2">{selectedDevice}</span>
                    </h3>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        terminalConnected ? 'bg-green-500' : 'bg-gray-400'
                      }`}></div>
                      <span className="text-sm text-gray-500">
                        {terminalConnected ? 'Connected' : 'Disconnected'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <TerminalComponent
                    sessionId={labSession.id}
                    deviceId={selectedDevice}
                    onConnect={handleTerminalConnect}
                    onDisconnect={handleTerminalDisconnect}
                  />
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Lab Instructions</h3>
              </div>
              <div className="p-4">
                <LabInstructions
                  template={labTemplate}
                  labSession={labSession}
                  selectedDevice={selectedDevice}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabPage;
