const axios = require('axios');
const URLParse = require('url-parse');
const validator = require('validator');

// Phishing Detection Service
class PhishingDetectionService {
  constructor() {
    this.suspiciousPatterns = [
      /login.*verify/i,
      /confirm.*password/i,
      /update.*security/i,
      /urgent.*action.*required/i,
      /click.*here.*now/i,
      /verify.*account/i,
      /suspicious.*activity/i
    ];
    this.suspiciousDomains = [
      'bit.ly', 'tinyurl.com', 'short.link', // URL shorteners
      'goog1e.com', 'amaz0n.com', 'paypa1.com' // Typosquatted domains
    ];
  }

  /**
   * Analyze a URL for phishing indicators
   * @param {string} url - URL to analyze
   * @returns {object} - Analysis result with risk score
   */
  analyzeURL(url) {
    const result = {
      url,
      riskScore: 0,
      threats: [],
      safe: true
    };

    // Validate URL format
    if (!validator.isURL(url)) {
      result.threats.push('Invalid URL format');
      result.riskScore += 25;
      result.safe = false;
    }

    try {
      const parsedUrl = new URLParse(url, true);
      const hostname = parsedUrl.hostname || '';
      const pathname = parsedUrl.pathname || '';

      // Check for HTTPS
      if (parsedUrl.protocol !== 'https:') {
        result.threats.push('No HTTPS encryption - Unsafe connection');
        result.riskScore += 30;
      }

      // Check for suspicious domains
      if (this.suspiciousDomains.some(domain => hostname.includes(domain))) {
        result.threats.push('Known suspicious domain');
        result.riskScore += 40;
      }

      // Check for URL shorteners
      if (this.isShortenedURL(hostname)) {
        result.threats.push('URL shortener detected - destination unknown');
        result.riskScore += 35;
      }

      // Check for typosquatting
      if (this.detectTyposquatting(hostname)) {
        result.threats.push('Possible typosquatted domain (mimics legitimate service)');
        result.riskScore += 45;
      }

      // Check for suspicious keywords in URL
      if (this.containsSuspiciousKeywords(pathname)) {
        result.threats.push('Suspicious keywords detected in URL path');
        result.riskScore += 25;
      }

      // Check for excessive subdomains
      const subdomainCount = (hostname.match(/\./g) || []).length;
      if (subdomainCount > 3) {
        result.threats.push('Excessive subdomains - possible DNS spoofing');
        result.riskScore += 20;
      }

      // Normalize risk score to 0-100
      result.riskScore = Math.min(100, result.riskScore);
      result.safe = result.riskScore < 50;
    } catch (error) {
      result.threats.push('Error analyzing URL');
      result.safe = false;
    }

    return result;
  }

  /**
   * Analyze email content for phishing indicators
   * @param {string} emailContent - Email body text
   * @returns {object} - Analysis result
   */
  analyzeEmailContent(emailContent) {
    const result = {
      riskScore: 0,
      threats: [],
      suspiciousElements: []
    };

    // Check for phishing patterns
    this.suspiciousPatterns.forEach(pattern => {
      if (pattern.test(emailContent)) {
        const match = emailContent.match(pattern);
        result.suspiciousElements.push(match[0]);
        result.riskScore += 15;
      }
    });

    // Check for urgency language
    const urgencyKeywords = ['urgent', 'immediate', 'act now', 'expire', 'limited time', 'confirm immediately'];
    urgencyKeywords.forEach(keyword => {
      if (emailContent.toLowerCase().includes(keyword)) {
        result.threats.push(`Urgency language detected: "${keyword}"`);
        result.riskScore += 10;
      }
    });

    // Check for request for sensitive information
    const sensitiveKeywords = ['password', 'ssn', 'credit card', 'bank account', 'pin', 'security code'];
    sensitiveKeywords.forEach(keyword => {
      if (emailContent.toLowerCase().includes(keyword)) {
        result.threats.push(`Suspicious request for: "${keyword}"`);
        result.riskScore += 20;
      }
    });

    // Check for poor grammar/spelling (common in phishing)
    const grammarErrors = this.detectGrammarErrors(emailContent);
    if (grammarErrors > 3) {
      result.threats.push(`Multiple grammar/spelling errors detected (${grammarErrors})`);
      result.riskScore += 15;
    }

    result.riskScore = Math.min(100, result.riskScore);
    result.safe = result.riskScore < 50;

    return result;
  }

  /**
   * Detect if URL is a shortener
   * @private
   */
  isShortenedURL(hostname) {
    const shortenerDomains = [
      'bit.ly', 'tinyurl.com', 'ow.ly', 'buff.ly', 'is.gd',
      'short.link', 'link.short', 'goo.gl', 'cutt.ly'
    ];
    return shortenerDomains.some(domain => hostname.includes(domain));
  }

  /**
   * Detect typosquatting attempts
   * @private
   */
  detectTyposquatting(hostname) {
    const commonTypos = {
      'goog1e.com': 'google.com',
      'amaz0n.com': 'amazon.com',
      'paypa1.com': 'paypal.com',
      'facebookk.com': 'facebook.com',
      'instag ram.com': 'instagram.com',
      'tw1tter.com': 'twitter.com'
    };
    return Object.keys(commonTypos).some(typo => hostname.includes(typo));
  }

  /**
   * Check for suspicious keywords in URL
   * @private
   */
  containsSuspiciousKeywords(pathname) {
    const keywords = ['login', 'verify', 'confirm', 'update', 'urgent', 'secure', 'admin'];
    return keywords.some(keyword => pathname.toLowerCase().includes(keyword));
  }

  /**
   * Detect grammar errors (simple implementation)
   * @private
   */
  detectGrammarErrors(text) {
    // Very basic grammar error detection
    const commonErrors = [
      /\b(their|there)\b.*\b(their|there)\b/gi,
      /\b(your|you're)\b.*\b(your|you're)\b/gi,
      /\brecieve\b/gi,
      /\boccured\b/gi,
      /\bachive\b/gi
    ];
    let errorCount = 0;
    commonErrors.forEach(pattern => {
      if (pattern.test(text)) errorCount++;
    });
    return errorCount;
  }
}

module.exports = new PhishingDetectionService();
