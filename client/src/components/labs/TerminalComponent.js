import React, { useEffect, useRef, useState } from 'react';
import { Terminal } from '@xterm/xterm';
import { AttachAddon } from '@xterm/addon-attach';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
// Add xterm styles inline
const xtermStyles = `
  .xterm {
    font-feature-settings: "liga" 0;
    position: relative;
    user-select: none;
    -ms-user-select: none;
    -webkit-user-select: none;
  }
  .xterm.focus,
  .xterm:focus {
    outline: none;
  }
  .xterm .xterm-helpers {
    position: absolute;
    top: 0;
    z-index: 5;
  }
  .xterm .xterm-helper-textarea {
    position: absolute;
    opacity: 0;
    left: -9999em;
    top: 0;
    width: 0;
    height: 0;
    z-index: -5;
    white-space: nowrap;
    overflow: hidden;
    resize: none;
  }
  .xterm .composition-view {
    background: #000;
    color: #FFF;
    display: none;
    position: absolute;
    white-space: nowrap;
    z-index: 1;
  }
  .xterm .composition-view.active {
    display: block;
  }
  .xterm .xterm-viewport {
    background-color: #000;
    overflow-y: scroll;
    cursor: default;
    position: absolute;
    right: 0;
    left: 0;
    top: 0;
    bottom: 0;
  }
  .xterm .xterm-screen {
    position: relative;
  }
  .xterm .xterm-screen canvas {
    position: absolute;
    left: 0;
    top: 0;
  }
  .xterm .xterm-scroll-area {
    visibility: hidden;
  }
  .xterm-char-measure-element {
    display: inline-block;
    visibility: hidden;
    position: absolute;
    top: 0;
    left: -9999em;
    line-height: normal;
  }
  .xterm .xterm-cursor-pointer {
    cursor: pointer;
  }
  .xterm .xterm-cursor-block {
    cursor: text;
  }
  .xterm .xterm-cursor-bar {
    cursor: text;
  }
  .xterm .xterm-cursor-line {
    cursor: text;
  }
  .xterm .xterm-cursor-none {
    cursor: none;
  }
  .xterm .xterm-cursor-blink {
    animation: xterm-cursor-blink 1s infinite;
  }
  @keyframes xterm-cursor-blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }
`;

const TerminalComponent = ({ 
  sessionId, 
  deviceId, 
  onConnect, 
  onDisconnect 
}) => {
  const terminalRef = useRef(null);
  const terminalInstance = useRef(null);
  const websocketRef = useRef(null);
  const fitAddonRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Inject xterm styles
    const styleElement = document.createElement('style');
    styleElement.textContent = xtermStyles;
    document.head.appendChild(styleElement);
    
    initializeTerminal();
    return () => {
      cleanup();
      // Remove styles when component unmounts
      if (styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
      }
    };
  }, []);

  useEffect(() => {
    if (sessionId && deviceId && !isConnected && !isConnecting) {
      connectToDevice();
    }
  }, [sessionId, deviceId]);

  const initializeTerminal = () => {
    if (terminalRef.current && !terminalInstance.current) {
      // Create terminal instance
      const terminal = new Terminal({
        theme: {
          background: '#1E1E1E',
          foreground: '#D4D4D4',
          cursor: '#AEAFAD',
          selection: '#264F78',
          black: '#000000',
          red: '#CD3131',
          green: '#0DBC79',
          yellow: '#E5E510',
          blue: '#2472C8',
          magenta: '#BC3FBC',
          cyan: '#11A8CD',
          white: '#E5E5E5',
          brightBlack: '#666666',
          brightRed: '#F14C4C',
          brightGreen: '#23D18B',
          brightYellow: '#F5F543',
          brightBlue: '#3B8EEA',
          brightMagenta: '#D670D6',
          brightCyan: '#29B8DB',
          brightWhite: '#E5E5E5',
        },
        fontSize: 14,
        fontFamily: 'Consolas, "Courier New", monospace',
        cursorBlink: true,
        cursorStyle: 'block',
        scrollback: 1000,
        tabStopWidth: 4,
        bellStyle: 'none',
        allowTransparency: false,
        convertEol: true,
        disableStdin: false,
        macOptionIsMeta: false,
        rightClickSelectsWord: false,
        wordSeparator: ' ()[]{}\'"`<>|&;:',
      });

      // Add addons
      const fitAddon = new FitAddon();
      const webLinksAddon = new WebLinksAddon();
      
      terminal.loadAddon(fitAddon);
      terminal.loadAddon(webLinksAddon);
      
      terminalInstance.current = terminal;
      fitAddonRef.current = fitAddon;

      // Mount terminal
      terminal.open(terminalRef.current);
      fitAddon.fit();

      // Handle terminal events
      terminal.onData((data) => {
        if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
          websocketRef.current.send(JSON.stringify({
            type: 'command',
            sessionId,
            deviceId,
            command: data
          }));
        }
      });

      // Handle resize
      const handleResize = () => {
        if (fitAddonRef.current) {
          fitAddonRef.current.fit();
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  };

  const connectToDevice = async () => {
    if (!sessionId || !deviceId || isConnected || isConnecting) return;

    try {
      setIsConnecting(true);
      setError(null);

      // Create WebSocket connection
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws/terminal`;
      
      const ws = new WebSocket(wsUrl);
      websocketRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        
        // Send connect message
        ws.send(JSON.stringify({
          type: 'connect',
          sessionId,
          deviceId
        }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleWebSocketMessage(data);
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        setIsConnecting(false);
        onDisconnect?.();
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('Connection failed');
        setIsConnecting(false);
        onDisconnect?.();
      };

    } catch (err) {
      console.error('Error connecting to device:', err);
      setError(err.message);
      setIsConnecting(false);
    }
  };

  const handleWebSocketMessage = (data) => {
    switch (data.type) {
      case 'connected':
        console.log('Connected to device:', data.device);
        setIsConnected(true);
        setIsConnecting(false);
        onConnect?.();
        break;
        
      case 'output':
        if (terminalInstance.current) {
          terminalInstance.current.write(data.data);
        }
        break;
        
      case 'error':
        console.error('Device error:', data.message);
        setError(data.message);
        setIsConnected(false);
        setIsConnecting(false);
        onDisconnect?.();
        break;
        
      case 'disconnected':
        console.log('Disconnected from device');
        setIsConnected(false);
        setIsConnecting(false);
        onDisconnect?.();
        break;
        
      default:
        console.log('Unknown message type:', data.type);
    }
  };

  const disconnect = () => {
    if (websocketRef.current) {
      websocketRef.current.close();
    }
    cleanup();
  };

  const cleanup = () => {
    if (websocketRef.current) {
      websocketRef.current.close();
      websocketRef.current = null;
    }
    
    if (terminalInstance.current) {
      terminalInstance.current.dispose();
      terminalInstance.current = null;
    }
    
    setIsConnected(false);
    setIsConnecting(false);
  };

  const reconnect = () => {
    disconnect();
    setTimeout(() => {
      connectToDevice();
    }, 1000);
  };

  return (
    <div className="h-80 bg-gray-900 rounded-lg overflow-hidden">
      {/* Terminal Header */}
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            isConnected ? 'bg-green-500' : isConnecting ? 'bg-yellow-500' : 'bg-red-500'
          }`}></div>
          <span className="text-sm text-gray-300">
            {isConnected ? 'Connected' : isConnecting ? 'Connecting...' : 'Disconnected'}
          </span>
          {deviceId && (
            <span className="text-xs text-gray-500">to {deviceId}</span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {error && (
            <span className="text-xs text-red-400">{error}</span>
          )}
          {!isConnected && !isConnecting && (
            <button
              onClick={reconnect}
              className="text-xs text-blue-400 hover:text-blue-300"
            >
              Reconnect
            </button>
          )}
        </div>
      </div>

      {/* Terminal Container */}
      <div 
        ref={terminalRef} 
        className="h-full w-full"
        style={{ minHeight: '300px' }}
      />

      {/* Connection Status Overlay */}
      {!isConnected && !isConnecting && (
        <div className="absolute inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center">
          <div className="text-center text-gray-300">
            <div className="text-4xl mb-4">🔌</div>
            <p className="text-lg mb-2">Not Connected</p>
            <p className="text-sm text-gray-400 mb-4">
              Click "Reconnect" to establish connection
            </p>
            <button
              onClick={reconnect}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Connect
            </button>
          </div>
        </div>
      )}

      {isConnecting && (
        <div className="absolute inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center">
          <div className="text-center text-gray-300">
            <div className="animate-spin text-4xl mb-4">⏳</div>
            <p className="text-lg">Connecting to {deviceId}...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TerminalComponent;
