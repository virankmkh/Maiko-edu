const os = require('os');
const fs = require('fs').promises;

class MonitoringService {
  constructor() {
    this.metrics = {
      labSessions: {
        active: 0,
        total: 0,
        completed: 0,
        failed: 0
      },
      system: {
        cpu: 0,
        memory: 0,
        disk: 0,
        uptime: 0
      },
      eveNg: {
        connected: false,
        lastCheck: null,
        responseTime: 0
      },
      errors: {
        total: 0,
        last24h: 0,
        byType: {}
      }
    };
    
    this.startTime = Date.now();
    this.updateInterval = null;
  }

  /**
   * Start monitoring service
   */
  start() {
    if (this.updateInterval) {
      return; // Already running
    }

    console.log('📊 Starting monitoring service...');
    
    // Update metrics every 30 seconds
    this.updateInterval = setInterval(() => {
      this.updateSystemMetrics();
      this.updateEveNgStatus();
    }, 30000);

    // Initial update
    this.updateSystemMetrics();
    this.updateEveNgStatus();
  }

  /**
   * Stop monitoring service
   */
  stop() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
      console.log('📊 Monitoring service stopped');
    }
  }

  /**
   * Update system metrics
   */
  async updateSystemMetrics() {
    try {
      // CPU usage
      const cpus = os.cpus();
      let totalIdle = 0;
      let totalTick = 0;
      
      cpus.forEach(cpu => {
        for (let type in cpu.times) {
          totalTick += cpu.times[type];
        }
        totalIdle += cpu.times.idle;
      });
      
      const cpuUsage = 100 - ~~(100 * totalIdle / totalTick);
      
      // Memory usage
      const totalMem = os.totalmem();
      const freeMem = os.freemem();
      const memoryUsage = ((totalMem - freeMem) / totalMem) * 100;
      
      // Disk usage
      const diskUsage = await this.getDiskUsage();
      
      // Uptime
      const uptime = os.uptime();

      this.metrics.system = {
        cpu: Math.round(cpuUsage * 100) / 100,
        memory: Math.round(memoryUsage * 100) / 100,
        disk: diskUsage,
        uptime: Math.round(uptime),
        loadAverage: os.loadavg(),
        totalMemory: totalMem,
        freeMemory: freeMem
      };

    } catch (error) {
      console.error('Error updating system metrics:', error);
    }
  }

  /**
   * Get disk usage
   */
  async getDiskUsage() {
    try {
      const stats = await fs.statfs('/');
      const total = stats.bavail + stats.bfree;
      const used = total - stats.bavail;
      return Math.round((used / total) * 100 * 100) / 100;
    } catch (error) {
      // Fallback for Windows or if statfs fails
      return 0;
    }
  }

  /**
   * Update EVE-NG status
   */
  async updateEveNgStatus() {
    try {
      const eveNgService = require('./eveNgService');
      const startTime = Date.now();
      
      const isConnected = await eveNgService.healthCheck();
      const responseTime = Date.now() - startTime;
      
      this.metrics.eveNg = {
        connected: isConnected,
        lastCheck: new Date().toISOString(),
        responseTime: responseTime
      };

    } catch (error) {
      this.metrics.eveNg = {
        connected: false,
        lastCheck: new Date().toISOString(),
        responseTime: -1,
        error: error.message
      };
    }
  }

  /**
   * Update lab session metrics
   */
  updateLabSessionMetrics(sessionData) {
    this.metrics.labSessions = {
      ...this.metrics.labSessions,
      ...sessionData
    };
  }

  /**
   * Record error
   */
  recordError(errorType, errorMessage) {
    this.metrics.errors.total++;
    this.metrics.errors.last24h++;
    
    if (!this.metrics.errors.byType[errorType]) {
      this.metrics.errors.byType[errorType] = 0;
    }
    this.metrics.errors.byType[errorType]++;
    
    console.error(`🚨 Error recorded: ${errorType} - ${errorMessage}`);
  }

  /**
   * Get current metrics
   */
  getMetrics() {
    return {
      ...this.metrics,
      timestamp: new Date().toISOString(),
      uptime: Date.now() - this.startTime
    };
  }

  /**
   * Get health status
   */
  getHealthStatus() {
    const { system, eveNg, labSessions } = this.metrics;
    
    const status = {
      overall: 'healthy',
      checks: {
        system: 'healthy',
        eveNg: 'healthy',
        labSessions: 'healthy'
      },
      issues: []
    };

    // Check system resources
    if (system.cpu > 80) {
      status.checks.system = 'warning';
      status.issues.push(`High CPU usage: ${system.cpu}%`);
    }
    
    if (system.memory > 90) {
      status.checks.system = 'critical';
      status.issues.push(`High memory usage: ${system.memory}%`);
    }
    
    if (system.disk > 90) {
      status.checks.system = 'warning';
      status.issues.push(`High disk usage: ${system.disk}%`);
    }

    // Check EVE-NG connectivity
    if (!eveNg.connected) {
      status.checks.eveNg = 'critical';
      status.issues.push('EVE-NG server is not accessible');
    } else if (eveNg.responseTime > 5000) {
      status.checks.eveNg = 'warning';
      status.issues.push(`EVE-NG slow response: ${eveNg.responseTime}ms`);
    }

    // Check lab sessions
    if (labSessions.active > 45) {
      status.checks.labSessions = 'warning';
      status.issues.push(`High number of active lab sessions: ${labSessions.active}`);
    }

    // Determine overall status
    if (status.checks.system === 'critical' || status.checks.eveNg === 'critical') {
      status.overall = 'critical';
    } else if (Object.values(status.checks).some(check => check === 'warning')) {
      status.overall = 'warning';
    }

    return status;
  }

  /**
   * Get performance recommendations
   */
  getRecommendations() {
    const { system, labSessions } = this.metrics;
    const recommendations = [];

    if (system.cpu > 70) {
      recommendations.push({
        type: 'performance',
        priority: 'high',
        message: 'Consider upgrading CPU or reducing concurrent lab sessions',
        current: `CPU usage: ${system.cpu}%`
      });
    }

    if (system.memory > 80) {
      recommendations.push({
        type: 'performance',
        priority: 'high',
        message: 'Consider adding more RAM or implementing session limits',
        current: `Memory usage: ${system.memory}%`
      });
    }

    if (system.disk > 85) {
      recommendations.push({
        type: 'storage',
        priority: 'medium',
        message: 'Consider cleaning up old lab sessions or expanding storage',
        current: `Disk usage: ${system.disk}%`
      });
    }

    if (labSessions.active > 40) {
      recommendations.push({
        type: 'scalability',
        priority: 'medium',
        message: 'Consider load balancing or adding more EVE-NG servers',
        current: `Active sessions: ${labSessions.active}`
      });
    }

    return recommendations;
  }

  /**
   * Export metrics for external monitoring
   */
  exportMetrics() {
    const metrics = this.getMetrics();
    const health = this.getHealthStatus();
    const recommendations = this.getRecommendations();

    return {
      metrics,
      health,
      recommendations,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = new MonitoringService();

