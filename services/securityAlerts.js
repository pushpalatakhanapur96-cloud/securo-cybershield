const { v4: uuidv4 } = require('uuid');

/**
 * Security Alerts Service
 * Generates AI-based security alerts and recommendations
 */
class SecurityAlertsService {
  constructor() {
    this.alerts = [];
    this.alertThresholds = {
      critical: 80,
      high: 60,
      medium: 40,
      low: 20
    };
  }

  /**
   * Create security alert
   * @param {string} type - Alert type (phishing, malware, weak-password, etc.)
   * @param {string} severity - Severity level (critical, high, medium, low)
   * @param {string} message - Alert message
   * @param {number} riskScore - Risk score (0-100)
   * @param {object} details - Additional details
   * @returns {object} - Created alert
   */
  createAlert(type, severity, message, riskScore, details = {}) {
    const alert = {
      id: uuidv4(),
      type,
      severity,
      message,
      riskScore,
      details,
      timestamp: new Date(),
      acknowledged: false,
      recommendations: this.generateRecommendations(type, riskScore)
    };

    this.alerts.push(alert);
    return alert;
  }

  /**
   * Generate AI-based recommendations
   * @private
   */
  generateRecommendations(type, riskScore) {
    const recommendations = [];

    switch (type) {
      case 'phishing':
        recommendations.push('Do not click any links or download attachments from this email');
        recommendations.push('Verify the sender\'s email address carefully');
        recommendations.push('Contact the company directly using their official website/phone number');
        if (riskScore >= 70) {
          recommendations.push('Report this email as phishing to your email provider');
        }
        break;

      case 'malware':
        recommendations.push('Disconnect from the internet immediately');
        recommendations.push('Run a full antivirus scan on your device');
        recommendations.push('Do not open suspicious files or attachments');
        recommendations.push('Update your antivirus software to the latest version');
        break;

      case 'weak-password':
        recommendations.push('Create a password with at least 12 characters');
        recommendations.push('Use a mix of uppercase, lowercase, numbers, and special characters');
        recommendations.push('Avoid personal information, dictionary words, and sequential numbers');
        recommendations.push('Use a password manager to generate and store strong passwords');
        break;

      case 'suspicious-activity':
        recommendations.push('Review your recent account activity');
        recommendations.push('Change your password immediately');
        recommendations.push('Enable two-factor authentication (2FA)');
        recommendations.push('Review and revoke access to third-party applications');
        break;

      case 'unencrypted-connection':
        recommendations.push('Only visit the HTTPS version of websites');
        recommendations.push('Avoid entering sensitive information on unencrypted connections');
        recommendations.push('Use a VPN for additional protection on public WiFi');
        break;

      default:
        recommendations.push('Review your security settings');
        recommendations.push('Keep your software and security tools updated');
        break;
    }

    return recommendations;
  }

  /**
   * Get security score based on recent alerts
   * @returns {object} - Overall security score
   */
  getSecurityScore() {
    if (this.alerts.length === 0) {
      return {
        score: 95,
        level: 'Excellent',
        message: 'No security alerts detected'
      };
    }

    const criticalAlerts = this.alerts.filter(a => a.severity === 'critical').length;
    const highAlerts = this.alerts.filter(a => a.severity === 'high').length;
    const mediumAlerts = this.alerts.filter(a => a.severity === 'medium').length;
    const lowAlerts = this.alerts.filter(a => a.severity === 'low').length;

    let score = 100;
    score -= criticalAlerts * 20;
    score -= highAlerts * 10;
    score -= mediumAlerts * 5;
    score -= lowAlerts * 2;

    score = Math.max(0, score);

    let level;
    if (score >= 90) level = 'Excellent';
    else if (score >= 75) level = 'Good';
    else if (score >= 50) level = 'Fair';
    else if (score >= 25) level = 'Poor';
    else level = 'Critical';

    return {
      score: Math.round(score),
      level,
      alertSummary: {
        critical: criticalAlerts,
        high: highAlerts,
        medium: mediumAlerts,
        low: lowAlerts,
        total: this.alerts.length
      },
      message: `Your security level is ${level}. ${this.alerts.length} alert(s) require attention.`
    };
  }

  /**
   * Get all alerts
   * @returns {array} - All alerts
   */
  getAllAlerts() {
    return this.alerts.sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * Get alerts by severity
   * @param {string} severity - Severity level
   * @returns {array} - Filtered alerts
   */
  getAlertsBySeverity(severity) {
    return this.alerts.filter(a => a.severity === severity);
  }

  /**
   * Acknowledge alert
   * @param {string} alertId - Alert ID
   * @returns {object} - Updated alert
   */
  acknowledgeAlert(alertId) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      alert.acknowledgedAt = new Date();
    }
    return alert;
  }

  /**
   * Clear alerts
   * @param {string} severity - Optional severity to filter
   */
  clearAlerts(severity = null) {
    if (severity) {
      this.alerts = this.alerts.filter(a => a.severity !== severity);
    } else {
      this.alerts = [];
    }
  }
}

module.exports = new SecurityAlertsService();
