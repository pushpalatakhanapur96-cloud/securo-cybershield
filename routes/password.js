const express = require('express');
const passwordStrength = require('../services/passwordStrength');
const securityAlerts = require('../services/securityAlerts');
const router = express.Router();

/**
 * POST /api/password/evaluate
 * Evaluate password strength
 */
router.post('/evaluate', (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    const evaluation = passwordStrength.evaluateStrength(password);

    // Create alert if password is weak
    if (evaluation.score < 50) {
      securityAlerts.createAlert(
        'weak-password',
        'medium',
        `Weak password detected. Strength: ${evaluation.strength}`,
        100 - evaluation.score,
        { strength: evaluation.strength, recommendations: evaluation.recommendations }
      );
    }

    res.json(evaluation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/password/check-breach
 * Check if password has been breached
 */
router.post('/check-breach', async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    const breachStatus = await passwordStrength.checkIfBreached(password);

    if (breachStatus.breached) {
      securityAlerts.createAlert(
        'weak-password',
        'critical',
        'Password found in known data breach',
        100,
        { timesFound: breachStatus.timesFound }
      );
    }

    res.json(breachStatus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/password/generate
 * Generate a strong password
 */
router.get('/generate', (req, res) => {
  try {
    const { length } = req.query;
    const passwordLength = parseInt(length) || 16;
    const password = passwordStrength.generateStrongPassword(passwordLength);
    res.json({ password });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
