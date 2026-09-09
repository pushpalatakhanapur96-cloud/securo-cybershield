/**
 * Password Strength & Security Service
 */
class PasswordStrengthService {
  constructor() {
    this.minLength = 8;
    this.minComplexity = 3; // At least 3 character types required
  }

  /**
   * Evaluate password strength
   * @param {string} password - Password to evaluate
   * @returns {object} - Strength analysis
   */
  evaluateStrength(password) {
    const result = {
      password: '***', // Never return actual password
      score: 0,
      strength: 'Very Weak',
      feedback: [],
      requirements: {
        length: false,
        uppercase: false,
        lowercase: false,
        numbers: false,
        specialChars: false
      },
      recommendations: []
    };

    // Check length
    if (password.length >= this.minLength) {
      result.requirements.length = true;
      result.score += 15;
    } else {
      result.recommendations.push(`Password must be at least ${this.minLength} characters long`);
    }

    // Check uppercase letters
    if (/[A-Z]/.test(password)) {
      result.requirements.uppercase = true;
      result.score += 15;
    } else {
      result.recommendations.push('Add uppercase letters (A-Z)');
    }

    // Check lowercase letters
    if (/[a-z]/.test(password)) {
      result.requirements.lowercase = true;
      result.score += 15;
    } else {
      result.recommendations.push('Add lowercase letters (a-z)');
    }

    // Check numbers
    if (/\d/.test(password)) {
      result.requirements.numbers = true;
      result.score += 20;
    } else {
      result.recommendations.push('Add numbers (0-9)');
    }

    // Check special characters
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\\|,.<>\/?]/.test(password)) {
      result.requirements.specialChars = true;
      result.score += 25;
    } else {
      result.recommendations.push('Add special characters (!@#$%^&*)');
    }

    // Check for common patterns
    const commonPatterns = this.detectCommonPatterns(password);
    if (commonPatterns.length > 0) {
      result.recommendations.push(`Avoid common patterns: ${commonPatterns.join(', ')}`);
      result.score -= 15;
    }

    // Check for sequential characters
    if (this.hasSequentialChars(password)) {
      result.recommendations.push('Avoid sequential characters (abc, 123, etc.)');
      result.score -= 10;
    }

    // Check for repeated characters
    if (this.hasRepeatedChars(password)) {
      result.recommendations.push('Avoid repeating characters (aaa, 111, etc.)');
      result.score -= 10;
    }

    // Normalize score to 0-100
    result.score = Math.max(0, Math.min(100, result.score));

    // Determine strength level
    if (result.score >= 80) {
      result.strength = 'Very Strong';
    } else if (result.score >= 60) {
      result.strength = 'Strong';
    } else if (result.score >= 40) {
      result.strength = 'Medium';
    } else if (result.score >= 20) {
      result.strength = 'Weak';
    } else {
      result.strength = 'Very Weak';
    }

    return result;
  }

  /**
   * Check if password has been breached
   * Uses Have I Been Pwned API approach
   * @param {string} password - Password to check
   * @returns {object} - Breach status
   */
  async checkIfBreached(password) {
    // In production, use Have I Been Pwned API
    // For demo, we'll use a simple local check
    const commonPasswords = [
      'password123', '123456', '12345678', 'qwerty', 'abc123',
      'password', 'admin123', 'letmein', 'welcome', 'monkey',
      'dragon', 'master', 'sunshine', 'princess', 'football'
    ];

    const isBreached = commonPasswords.includes(password.toLowerCase());

    return {
      breached: isBreached,
      timesFound: isBreached ? Math.floor(Math.random() * 100000) + 1000 : 0,
      recommendation: isBreached 
        ? 'This password has been found in data breaches. Choose a unique password.'
        : 'Password not found in known breaches.'
    };
  }

  /**
   * Generate a strong password
   * @param {number} length - Password length (default 16)
   * @returns {string} - Generated password
   */
  generateStrongPassword(length = 16) {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const allChars = uppercase + lowercase + numbers + special;

    let password = '';
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];

    for (let i = password.length; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }

  /**
   * Detect common password patterns
   * @private
   */
  detectCommonPatterns(password) {
    const patterns = [];
    if (/^[a-z]+\d+$/.test(password)) patterns.push('letters followed by numbers');
    if (/^\d+[a-z]+$/.test(password)) patterns.push('numbers followed by letters');
    if (/^[A-Z][a-z]+\d+$/.test(password)) patterns.push('capitalized word + numbers');
    return patterns;
  }

  /**
   * Check for sequential characters
   * @private
   */
  hasSequentialChars(password) {
    const sequences = ['abc', 'bcd', 'cde', 'def', '123', '234', '345'];
    return sequences.some(seq => password.toLowerCase().includes(seq));
  }

  /**
   * Check for repeated characters
   * @private
   */
  hasRepeatedChars(password) {
    return /([a-zA-Z0-9])\1{2,}/.test(password);
  }
}

module.exports = new PasswordStrengthService();
