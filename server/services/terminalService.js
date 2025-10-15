const { NodeSSH } = require('node-ssh');
const WebSocket = require('ws');

class TerminalService {
  constructor() {
    this.activeConnections = new Map();
    this.sshConnections = new Map();
  }

  /**
   * Create a WebSocket server for terminal connections
   */
  createWebSocketServer(server) {
    const wss = new WebSocket.Server({ 
      server,
      path: '/ws/terminal'
    });

    wss.on('connection', (ws, req) => {
      console.log('New terminal WebSocket connection');
      
      ws.on('message', async (message) => {
        try {
          const data = JSON.parse(message);
          await this.handleMessage(ws, data);
        } catch (error) {
          console.error('Error handling terminal message:', error);
          ws.send(JSON.stringify({
            type: 'error',
            message: 'Invalid message format'
          }));
        }
      });

      ws.on('close', () => {
        console.log('Terminal WebSocket connection closed');
        this.cleanupConnection(ws);
      });

      ws.on('error', (error) => {
        console.error('Terminal WebSocket error:', error);
        this.cleanupConnection(ws);
      });
    });

    return wss;
  }

  /**
   * Handle incoming WebSocket messages
   */
  async handleMessage(ws, data) {
    const { type, sessionId, deviceId, command } = data;

    switch (type) {
      case 'connect':
        await this.connectToDevice(ws, sessionId, deviceId);
        break;
      case 'command':
        await this.sendCommand(ws, sessionId, deviceId, command);
        break;
      case 'disconnect':
        await this.disconnectFromDevice(ws, sessionId, deviceId);
        break;
      default:
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Unknown message type'
        }));
    }
  }

  /**
   * Connect to a device in the lab
   */
  async connectToDevice(ws, sessionId, deviceId) {
    try {
      const connectionKey = `${sessionId}_${deviceId}`;
      
      // Check if connection already exists
      if (this.activeConnections.has(connectionKey)) {
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Already connected to this device'
        }));
        return;
      }

      // Get device connection details from database
      const { LabSession } = require('../models');
      const labSession = await LabSession.findByPk(sessionId);
      
      if (!labSession || !labSession.deviceConnections) {
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Lab session or device not found'
        }));
        return;
      }

      const device = labSession.deviceConnections[deviceId];
      if (!device) {
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Device not found in lab session'
        }));
        return;
      }

      // Create SSH connection to device
      const ssh = new NodeSSH();
      const connectionConfig = {
        host: device.host || 'localhost',
        port: device.port || 22,
        username: device.username || 'admin',
        password: device.password || 'admin',
        readyTimeout: 20000,
        keepaliveInterval: 1000
      };

      await ssh.connect(connectionConfig);

      // Store connection
      this.activeConnections.set(connectionKey, {
        ws,
        ssh,
        sessionId,
        deviceId,
        connectedAt: new Date()
      });
      this.sshConnections.set(ws, ssh);

      // Set up SSH event handlers
      ssh.connection.on('data', (data) => {
        ws.send(JSON.stringify({
          type: 'output',
          data: data.toString()
        }));
      });

      ssh.connection.on('close', () => {
        ws.send(JSON.stringify({
          type: 'disconnected',
          message: 'SSH connection closed'
        }));
        this.cleanupConnection(ws);
      });

      ws.send(JSON.stringify({
        type: 'connected',
        message: `Connected to ${deviceId}`,
        device: {
          id: deviceId,
          name: device.name,
          type: device.type
        }
      }));

    } catch (error) {
      console.error('Error connecting to device:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: `Failed to connect to device: ${error.message}`
      }));
    }
  }

  /**
   * Send command to device
   */
  async sendCommand(ws, sessionId, deviceId, command) {
    try {
      const connectionKey = `${sessionId}_${deviceId}`;
      const connection = this.activeConnections.get(connectionKey);

      if (!connection) {
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Not connected to device'
        }));
        return;
      }

      const { ssh } = connection;
      
      // Send command to SSH connection
      await ssh.execCommand(command, {
        onStdout: (chunk) => {
          ws.send(JSON.stringify({
            type: 'output',
            data: chunk.toString()
          }));
        },
        onStderr: (chunk) => {
          ws.send(JSON.stringify({
            type: 'error',
            data: chunk.toString()
          }));
        }
      });

    } catch (error) {
      console.error('Error sending command:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: `Command failed: ${error.message}`
      }));
    }
  }

  /**
   * Disconnect from device
   */
  async disconnectFromDevice(ws, sessionId, deviceId) {
    const connectionKey = `${sessionId}_${deviceId}`;
    const connection = this.activeConnections.get(connectionKey);

    if (connection) {
      try {
        await connection.ssh.dispose();
      } catch (error) {
        console.error('Error disposing SSH connection:', error);
      }
      
      this.activeConnections.delete(connectionKey);
    }

    ws.send(JSON.stringify({
      type: 'disconnected',
      message: `Disconnected from ${deviceId}`
    }));
  }

  /**
   * Cleanup connection
   */
  cleanupConnection(ws) {
    // Find and remove all connections for this WebSocket
    for (const [key, connection] of this.activeConnections.entries()) {
      if (connection.ws === ws) {
        try {
          connection.ssh.dispose();
        } catch (error) {
          console.error('Error disposing SSH connection during cleanup:', error);
        }
        this.activeConnections.delete(key);
      }
    }

    // Remove SSH connection
    const ssh = this.sshConnections.get(ws);
    if (ssh) {
      try {
        ssh.dispose();
      } catch (error) {
        console.error('Error disposing SSH connection during cleanup:', error);
      }
      this.sshConnections.delete(ws);
    }
  }

  /**
   * Get active connections count
   */
  getActiveConnectionsCount() {
    return this.activeConnections.size;
  }

  /**
   * Get connection info
   */
  getConnectionInfo(sessionId, deviceId) {
    const connectionKey = `${sessionId}_${deviceId}`;
    return this.activeConnections.get(connectionKey);
  }

  /**
   * Broadcast message to all connections for a session
   */
  broadcastToSession(sessionId, message) {
    for (const [key, connection] of this.activeConnections.entries()) {
      if (connection.sessionId === sessionId) {
        try {
          connection.ws.send(JSON.stringify(message));
        } catch (error) {
          console.error('Error broadcasting to session:', error);
        }
      }
    }
  }

  /**
   * Cleanup all connections
   */
  cleanupAll() {
    for (const [key, connection] of this.activeConnections.entries()) {
      try {
        connection.ssh.dispose();
      } catch (error) {
        console.error('Error disposing SSH connection during cleanup:', error);
      }
    }
    this.activeConnections.clear();
    this.sshConnections.clear();
  }
}

module.exports = new TerminalService();
