const axios = require('axios');

class EveNgService {
  constructor() {
    this.baseUrl = process.env.EVE_NG_URL || 'http://localhost:8080';
    this.username = process.env.EVE_NG_USERNAME || 'admin';
    this.password = process.env.EVE_NG_PASSWORD || 'eve';
    this.apiKey = process.env.EVE_NG_API_KEY || null;
    this.sessionCookie = null;
  }

  /**
   * Authenticate with EVE-NG and get session cookie
   */
  async authenticate() {
    try {
      const response = await axios.post(`${this.baseUrl}/api/auth/login`, {
        username: this.username,
        password: this.password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.token) {
        this.apiKey = response.data.token;
        return true;
      }

      // Fallback to cookie-based auth
      const setCookieHeader = response.headers['set-cookie'];
      if (setCookieHeader) {
        this.sessionCookie = setCookieHeader[0];
        return true;
      }

      throw new Error('Authentication failed');
    } catch (error) {
      console.error('EVE-NG authentication error:', error.message);
      throw new Error(`Failed to authenticate with EVE-NG: ${error.message}`);
    }
  }

  /**
   * Get authentication headers
   */
  getAuthHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    } else if (this.sessionCookie) {
      headers['Cookie'] = this.sessionCookie;
    }

    return headers;
  }

  /**
   * List all lab templates
   */
  async listTemplates() {
    try {
      const response = await axios.get(`${this.baseUrl}/api/labs`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error listing EVE-NG templates:', error.message);
      throw new Error(`Failed to list templates: ${error.message}`);
    }
  }

  /**
   * Get specific lab template details
   */
  async getTemplate(templateId) {
    try {
      const response = await axios.get(`${this.baseUrl}/api/labs/${templateId}`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error getting EVE-NG template:', error.message);
      throw new Error(`Failed to get template: ${error.message}`);
    }
  }

  /**
   * Create a new lab instance from template
   */
  async createLabInstance(templateId, labName, userId) {
    try {
      const response = await axios.post(`${this.baseUrl}/api/labs/${templateId}/create`, {
        name: labName,
        user: userId,
        description: `Lab session for user ${userId}`
      }, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error creating EVE-NG lab instance:', error.message);
      throw new Error(`Failed to create lab instance: ${error.message}`);
    }
  }

  /**
   * Start a lab instance
   */
  async startLab(labId) {
    try {
      const response = await axios.post(`${this.baseUrl}/api/labs/${labId}/start`, {}, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error starting EVE-NG lab:', error.message);
      throw new Error(`Failed to start lab: ${error.message}`);
    }
  }

  /**
   * Stop a lab instance
   */
  async stopLab(labId) {
    try {
      const response = await axios.post(`${this.baseUrl}/api/labs/${labId}/stop`, {}, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error stopping EVE-NG lab:', error.message);
      throw new Error(`Failed to stop lab: ${error.message}`);
    }
  }

  /**
   * Get lab status
   */
  async getLabStatus(labId) {
    try {
      const response = await axios.get(`${this.baseUrl}/api/labs/${labId}/status`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error getting EVE-NG lab status:', error.message);
      throw new Error(`Failed to get lab status: ${error.message}`);
    }
  }

  /**
   * Get device console information
   */
  async getDeviceConsole(labId, deviceId) {
    try {
      const response = await axios.get(`${this.baseUrl}/api/labs/${labId}/devices/${deviceId}/console`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error getting device console:', error.message);
      throw new Error(`Failed to get device console: ${error.message}`);
    }
  }

  /**
   * Save lab state
   */
  async saveLab(labId) {
    try {
      const response = await axios.post(`${this.baseUrl}/api/labs/${labId}/save`, {}, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error saving EVE-NG lab:', error.message);
      throw new Error(`Failed to save lab: ${error.message}`);
    }
  }

  /**
   * Delete lab instance
   */
  async deleteLab(labId) {
    try {
      const response = await axios.delete(`${this.baseUrl}/api/labs/${labId}`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting EVE-NG lab:', error.message);
      throw new Error(`Failed to delete lab: ${error.message}`);
    }
  }

  /**
   * Get lab topology
   */
  async getLabTopology(labId) {
    try {
      const response = await axios.get(`${this.baseUrl}/api/labs/${labId}/topology`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error getting lab topology:', error.message);
      throw new Error(`Failed to get lab topology: ${error.message}`);
    }
  }

  /**
   * Get system resources
   */
  async getSystemResources() {
    try {
      const response = await axios.get(`${this.baseUrl}/api/system/resources`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error getting system resources:', error.message);
      throw new Error(`Failed to get system resources: ${error.message}`);
    }
  }

  /**
   * Check if EVE-NG is available
   */
  async healthCheck() {
    try {
      const response = await axios.get(`${this.baseUrl}/api/health`, {
        timeout: 5000
      });
      return response.status === 200;
    } catch (error) {
      console.error('EVE-NG health check failed:', error.message);
      return false;
    }
  }
}

module.exports = new EveNgService();
