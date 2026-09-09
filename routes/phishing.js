const express = require('express');
const phishingDetection = require('../services/phishingDetection');
const securityAlerts = require('../services/securityAlerts');
const router = express.Router();

/**
 * POST /api/phishing/analyze-url
 * Analyze URL for phishing indicators
 */
router.post('/analyze-url', (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const analysis = phishingDetection.analyzeURL(url);

    // Create alert if risk is high
    if (analysis.riskScore >= 60) {
      const severity = analysis.riskScore >= 80 ? 'critical' : 'high';
      securityAlerts.createAlert(
        'phishing',
        severity,
        `Potential phishing URL detected: ${url}`,
        analysis.riskScore,
        { url, threats: analysis.threats }
      );
    }

    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/phishing/analyze-email
 * Analyze email content for phishing indicators
 */
router.post('/analyze-email', (req, res) => {
  try {
    const { emailContent, senderEmail } = req.body;

    if (!emailContent) {
      return res.status(400).json({ error: 'Email content is required' });
    }

    const analysis = phishingDetection.analyzeEmailContent(emailContent);

    // Create alert if risk is high
    if (analysis.riskScore >= 50) {
      securityAlerts.createAlert(
        'phishing',
        'high',
        `Suspicious email detected from ${senderEmail || 'unknown sender'}`,
        analysis.riskScore,
        { senderEmail, threats: analysis.threats }
      );
    }

    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
