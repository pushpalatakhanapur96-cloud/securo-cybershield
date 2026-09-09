const express = require('express');
const securityAlerts = require('../services/securityAlerts');
const router = express.Router();

/**
 * GET /api/alerts
 * Get all security alerts
 */
router.get('/', (req, res) => {
  try {
    const alerts = securityAlerts.getAllAlerts();
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/alerts/security-score
 * Get overall security score
 */
router.get('/security-score', (req, res) => {
  try {
    const score = securityAlerts.getSecurityScore();
    res.json(score);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/alerts/by-severity/:severity
 * Get alerts by severity
 */
router.get('/by-severity/:severity', (req, res) => {
  try {
    const { severity } = req.params;
    const alerts = securityAlerts.getAlertsBySeverity(severity);
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/alerts/:alertId/acknowledge
 * Acknowledge an alert
 */
router.put('/:alertId/acknowledge', (req, res) => {
  try {
    const { alertId } = req.params;
    const alert = securityAlerts.acknowledgeAlert(alertId);
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    res.json(alert);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/alerts/clear
 * Clear alerts
 */
router.delete('/clear', (req, res) => {
  try {
    const { severity } = req.query;
    securityAlerts.clearAlerts(severity || null);
    res.json({ message: 'Alerts cleared successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
