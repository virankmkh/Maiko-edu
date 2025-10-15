import React, { useState, useRef, useEffect } from 'react';
import { Video, Square, Play } from 'lucide-react';
import { createRoom, setUserInfo } from '../config/jitsi';

const JitsiTest = () => {
  const [isInCall, setIsInCall] = useState(false);
  const [jitsiApi, setJitsiApi] = useState(null);
  const [roomName, setRoomName] = useState('');
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');
  const jitsiContainerRef = useRef(null);

  useEffect(() => {
    // Set default values
    setUserName(localStorage.getItem('userName') || 'Test User');
    setRoomName(`maiko-test-${Date.now()}`);
  }, []);

  const startJitsiCall = async () => {
    try {
      setError('');
      
      if (!roomName.trim()) {
        setError('Please enter a room name');
        return;
      }

      if (!userName.trim()) {
        setError('Please enter your name');
        return;
      }

      // Load Jitsi Meet API dynamically
      if (!window.JitsiMeetExternalAPI) {
        const script = document.createElement('script');
        script.src = 'https://meet.jit.si/external_api.js';
        script.onload = () => initializeJitsi();
        script.onerror = () => setError('Failed to load Jitsi Meet API');
        document.head.appendChild(script);
      } else {
        initializeJitsi();
      }
    } catch (error) {
      console.error('Error starting Jitsi call:', error);
      setError('Failed to start video call: ' + error.message);
    }
  };

  const initializeJitsi = () => {
    // Clear any previous error
    setError('');
    
    // Use direct DOM element lookup instead of useRef
    let container = document.getElementById('jitsi-container');
    
    if (!container) {
      // Try to create the container if it doesn't exist
      console.log('Container not found, attempting to create it...');
      const containerDiv = document.createElement('div');
      containerDiv.id = 'jitsi-container';
      containerDiv.className = 'w-full h-96 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300';
      containerDiv.style.minHeight = '400px';
      
      // Try to find a suitable parent element
      const parentElement = document.querySelector('.bg-white.rounded-lg.shadow-lg');
      if (parentElement) {
        parentElement.appendChild(containerDiv);
        container = containerDiv;
        console.log('✅ Created container element');
      } else {
        setError('Jitsi container not found and could not create one. Please refresh the page.');
        console.error('Container element not found in DOM and no suitable parent found');
        return;
      }
    }

    console.log('✅ Container found, initializing Jitsi...');
    
    try {
      const userInfo = setUserInfo(userName, '');
      const config = createRoom(roomName);
      config.options.userInfo = userInfo;
      config.options.parentNode = container;

      // Clear the container content first
      container.innerHTML = '';

      const api = new window.JitsiMeetExternalAPI(config.domain, config.options);
      setJitsiApi(api);

      // Event listeners
      api.addEventListeners({
        videoConferenceJoined: () => {
          console.log('✅ Joined video conference');
          setIsInCall(true);
          setError('');
        },
        videoConferenceLeft: () => {
          console.log('❌ Left video conference');
          setIsInCall(false);
          setJitsiApi(null);
        },
        readyToClose: () => {
          console.log('🔚 Ready to close');
          setIsInCall(false);
          setJitsiApi(null);
        },
        participantJoined: () => {
          console.log('👥 Participant joined');
        },
        participantLeft: () => {
          console.log('👋 Participant left');
        },
        errorOccurred: (error) => {
          console.error('❌ Jitsi error:', error);
          setError('Jitsi error: ' + error.message);
        }
      });
    } catch (error) {
      console.error('Error initializing Jitsi:', error);
      setError('Failed to initialize Jitsi: ' + error.message);
    }
  };

  const endJitsiCall = () => {
    if (jitsiApi) {
      jitsiApi.dispose();
      setJitsiApi(null);
      setIsInCall(false);
    }
  };

  const testAPI = async () => {
    try {
      setError(''); // Clear previous errors
      console.log('Testing API connection...');
      
      const response = await fetch('/api/jitsi/config', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('API Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('API Response data:', data);
      
      if (data.success) {
        console.log('✅ Jitsi API test successful:', data.config);
        setError('✅ API test successful! Backend is running.');
      } else {
        setError('API test failed: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('API test error:', error);
      setError('API test failed: ' + error.message + ' (Make sure backend server is running on port 5001)');
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (jitsiApi) {
        jitsiApi.dispose();
      }
    };
  }, [jitsiApi]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Video className="w-8 h-8 mr-3 text-blue-600" />
            Jitsi Meet Integration Test
          </h1>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isInCall ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className="text-sm text-gray-600">
              {isInCall ? 'Live' : 'Offline'}
            </span>
          </div>
        </div>

        {!isInCall ? (
          <div className="space-y-6">
            {/* Test Configuration */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-3">Test Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Name
                  </label>
                  <input
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
                    placeholder="Enter room name (e.g., maiko-test-room)"
                    style={{ fontSize: '16px' }}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    💡 Try: "maiko-test-room" or "my-test-call"
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
                    placeholder="Enter your name (e.g., John Doe)"
                    style={{ fontSize: '16px' }}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    💡 This will be displayed to other participants
                  </p>
                </div>
              </div>
            </div>

            {/* API Test */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">API Test</h3>
              <p className="text-sm text-gray-600 mb-3">
                Test the backend Jitsi API endpoints
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={testAPI}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Test API Connection
                </button>
                <button
                  onClick={() => {
                    const containerById = document.getElementById('jitsi-container');
                    const containerRef = jitsiContainerRef.current;
                    
                    console.log('=== CONTAINER DEBUG INFO ===');
                    console.log('Container by ID:', containerById);
                    console.log('Container ref:', containerRef);
                    console.log('Container exists in DOM:', !!containerById);
                    console.log('Container visible:', containerById ? containerById.offsetHeight > 0 : false);
                    console.log('Container parent:', containerById ? containerById.parentElement : null);
                    console.log('All elements with jitsi-container ID:', document.querySelectorAll('#jitsi-container'));
                    
                    if (containerById) {
                      setError('✅ Container found! Check console for details.');
                    } else {
                      setError('❌ Container not found in DOM. Check console for details.');
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Debug Container
                </button>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            )}

            {/* Start Call Button */}
            <div className="text-center">
              <button
                onClick={startJitsiCall}
                disabled={!roomName.trim() || !userName.trim()}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
              >
                <Play className="w-5 h-5" />
                <span>Start Test Call</span>
              </button>
            </div>
          </div>
        ) : (
          /* Jitsi Meet Video Call Interface */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">Live Call</span>
                </div>
                <span className="text-sm text-gray-500">Room: {roomName}</span>
              </div>
              <button
                onClick={endJitsiCall}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <Square className="w-4 h-4" />
                <span>End Call</span>
              </button>
            </div>
            
            {/* Jitsi Meet Container */}
            <div 
              ref={jitsiContainerRef}
              className="w-full h-96 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center"
              style={{ minHeight: '400px' }}
              id="jitsi-container"
            >
              <div className="text-center">
                <Video className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Loading Jitsi Meet...</p>
                <p className="text-xs text-gray-400 mt-2">
                  Container Status: {jitsiContainerRef.current ? '✅ Ready' : '⏳ Loading...'}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Element ID: jitsi-container
                </p>
              </div>
            </div>

            {/* Call Info */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Call Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Room:</span>
                  <span className="ml-2 text-gray-600">{roomName}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">User:</span>
                  <span className="ml-2 text-gray-600">{userName}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Status:</span>
                  <span className="ml-2 text-green-600">Connected</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-medium text-yellow-800 mb-2">Testing Instructions</h3>
          <ul className="text-sm text-yellow-700 space-y-2">
            <li><strong>1. Room Name:</strong> Enter any name like "maiko-test-room" or "my-test-call"</li>
            <li><strong>2. Your Name:</strong> Enter your display name like "John Doe" or "Test User"</li>
            <li><strong>3. Test API:</strong> Click "Test API Connection" to verify backend is working</li>
            <li><strong>4. Start Call:</strong> Click "Start Test Call" to join the video call</li>
            <li><strong>5. Test Features:</strong> Try video, audio, and screen sharing</li>
            <li><strong>6. Multi-user Test:</strong> Open another browser tab with the same room name</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default JitsiTest;
