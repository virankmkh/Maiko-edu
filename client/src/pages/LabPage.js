import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  Play, 
  Square, 
  Save, 
  RefreshCw, 
  Settings,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  Monitor,
  Server,
  Router,
  Wifi,
  WifiOff
} from 'lucide-react';

const LabPage = () => {
  const { courseId, templateId } = useParams();
  const navigate = useNavigate();
  
  const [labData, setLabData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState('');
  const [currentCommand, setCurrentCommand] = useState('');
  const [labStatus, setLabStatus] = useState('stopped'); // stopped, starting, running, error

  useEffect(() => {
    loadLabData();
  }, [courseId, templateId]);

  const loadLabData = async () => {
    try {
      setIsLoading(true);
      // Simulate loading lab data
      setTimeout(() => {
        setLabData({
          id: templateId,
          name: 'Networking Lab',
          description: 'Learn network configuration',
          devices: [
            { id: 1, name: 'Router1', type: 'router', status: 'offline' },
            { id: 2, name: 'Switch1', type: 'switch', status: 'offline' },
            { id: 3, name: 'PC1', type: 'pc', status: 'offline' }
          ]
        });
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading lab data:', error);
      toast.error('Failed to load lab data');
      setIsLoading(false);
    }
  };

  const startLab = () => {
    setLabStatus('starting');
    toast.success('Starting lab environment...');
    
    // Simulate lab startup
    setTimeout(() => {
      setLabStatus('running');
      setIsConnected(true);
      setTerminalOutput('Lab environment started successfully!\nAll devices are now online.\n');
      toast.success('Lab environment is running!');
    }, 2000);
  };

  const stopLab = () => {
    setLabStatus('stopped');
    setIsConnected(false);
    setTerminalOutput('');
    setCurrentCommand('');
    toast.success('Lab environment stopped');
  };

  const executeCommand = (command) => {
    if (!isConnected) {
      toast.error('Lab is not running. Please start the lab first.');
      return;
    }

    setCurrentCommand(command);
    const newOutput = terminalOutput + `$ ${command}\n`;
    setTerminalOutput(newOutput);
    
    // Simulate command execution
    setTimeout(() => {
      const response = `Command executed: ${command}\nOutput: Success\n`;
      setTerminalOutput(prev => prev + response);
    }, 500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lab environment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="text-gray-500 hover:text-gray-700"
              >
                ← Back
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {labData?.name || 'Networking Lab'}
                </h1>
                <p className="text-gray-600">
                  Course: {courseId} | Template: {templateId}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                labStatus === 'running' ? 'bg-green-100 text-green-800' :
                labStatus === 'starting' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  labStatus === 'running' ? 'bg-green-500' :
                  labStatus === 'starting' ? 'bg-yellow-500 animate-pulse' :
                  'bg-gray-500'
                }`}></div>
                <span className="capitalize">{labStatus}</span>
              </div>
              
              {labStatus === 'stopped' ? (
                <button
                  onClick={startLab}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <Play className="w-4 h-4" />
                  <span>Start Lab</span>
                </button>
              ) : (
                <button
                  onClick={stopLab}
                  className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  <Square className="w-4 h-4" />
                  <span>Stop Lab</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lab Topology */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Network Topology
              </h2>
              
              <div className="space-y-4">
                {labData?.devices?.map((device) => (
                  <div key={device.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className={`p-2 rounded ${
                      device.status === 'online' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {device.type === 'router' ? <Router className="w-6 h-6" /> :
                       device.type === 'switch' ? <Server className="w-6 h-6" /> :
                       <Monitor className="w-6 h-6" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{device.name}</h3>
                      <p className="text-sm text-gray-600 capitalize">{device.type}</p>
                    </div>
                    <div className={`flex items-center space-x-2 ${
                      device.status === 'online' ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      {device.status === 'online' ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                      <span className="text-sm capitalize">{device.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Terminal */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Terminal
              </h2>
              
              <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm h-64 overflow-y-auto">
                <pre className="whitespace-pre-wrap">{terminalOutput || 'Lab terminal ready...'}</pre>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={currentCommand}
                    onChange={(e) => setCurrentCommand(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && executeCommand(currentCommand)}
                    placeholder="Enter command..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    disabled={!isConnected}
                  />
                  <button
                    onClick={() => executeCommand(currentCommand)}
                    disabled={!isConnected || !currentCommand}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    Execute
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {['ping 8.8.8.8', 'show ip route', 'configure terminal', 'exit'].map((cmd) => (
                    <button
                      key={cmd}
                      onClick={() => executeCommand(cmd)}
                      disabled={!isConnected}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {cmd}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabPage;