# Securo Cybershield 🛡️

**AI-powered Cybersecurity Platform** for phishing detection, user education, and threat monitoring.

## Features

### 🔍 Phishing Detection
- **URL Analysis**: Detect phishing URLs, shortened URLs, typosquatting attempts
- **Email Analysis**: Analyze email content for phishing indicators
- **Risk Scoring**: Comprehensive risk assessment (0-100 scale)
- **Real-time Threat Detection**: Instant alerts for suspicious content

### 🔐 Password Security
- **Strength Evaluation**: Analyze password strength with detailed feedback
- **Breach Detection**: Check if passwords have been in data breaches
- **Password Generator**: Create strong, random passwords
- **Security Recommendations**: Get actionable advice for improvement

### 🚨 Security Alerts
- **AI-based Alerts**: Intelligent threat detection and notification
- **Severity Levels**: Critical, High, Medium, Low classifications
- **Custom Recommendations**: Tailored advice for each threat
- **Security Scoring**: Overall account security assessment

### 📚 Cybersecurity Education
- **Interactive Courses**: Beginner to advanced level training
- **Threat Articles**: Latest news on cyber threats
- **Security Tips**: Daily best practices and recommendations
- **Quizzes**: Test your knowledge with interactive assessments

## Installation

```bash
# Clone the repository
git clone https://github.com/pushpalatakhanapur96-cloud/securo-cybershield.git
cd securo-cybershield

# Install dependencies
npm install

# Start the server
npm start
```

## API Endpoints

### Phishing Detection
```bash
# Analyze URL
POST /api/phishing/analyze-url
{
  "url": "https://suspicious-site.com"
}

# Analyze Email
POST /api/phishing/analyze-email
{
  "emailContent": "Click here to verify your account...",
  "senderEmail": "fake@site.com"
}
```

### Password Security
```bash
# Evaluate Password Strength
POST /api/password/evaluate
{
  "password": "MyP@ssw0rd!"
}

# Check if Password is Breached
POST /api/password/check-breach
{
  "password": "test123"
}

# Generate Strong Password
GET /api/password/generate?length=16
```

### Security Alerts
```bash
# Get All Alerts
GET /api/alerts

# Get Security Score
GET /api/alerts/security-score

# Get Alerts by Severity
GET /api/alerts/by-severity/high

# Acknowledge Alert
PUT /api/alerts/{alertId}/acknowledge

# Clear Alerts
DELETE /api/alerts/clear?severity=low
```

### Education
```bash
# Get All Courses
GET /api/education/courses

# Get Course Details
GET /api/education/courses/{courseId}

# Get Threat Articles
GET /api/education/articles?category=Phishing

# Get Daily Security Tips
GET /api/education/tips

# Get Course Quiz
GET /api/education/quiz/{courseId}
```

## Technology Stack

- **Backend**: Node.js, Express.js
- **Security**: bcryptjs, validator.js
- **Database**: MongoDB (optional)
- **API**: RESTful API

## Usage Examples

### Example 1: Check URL for Phishing
```javascript
const response = await fetch('/api/phishing/analyze-url', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ url: 'https://example.com' })
});
const result = await response.json();
console.log(`Risk Score: ${result.riskScore}/100`);
console.log(`Safe: ${result.safe}`);
```

### Example 2: Evaluate Password
```javascript
const response = await fetch('/api/password/evaluate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ password: 'MyP@ssw0rd!' })
});
const result = await response.json();
console.log(`Strength: ${result.strength}`);
console.log(`Score: ${result.score}/100`);
```

### Example 3: Get Security Score
```javascript
const response = await fetch('/api/alerts/security-score');
const score = await response.json();
console.log(`Security Level: ${score.level}`);
console.log(`Score: ${score.score}/100`);
```

## Security Best Practices Implemented

✅ **URL Analysis**
- HTTPS validation
- Shortened URL detection
- Typosquatting detection
- Suspicious keyword detection
- Subdomain validation

✅ **Password Security**
- Complexity requirements (uppercase, lowercase, numbers, special chars)
- Length validation
- Common pattern detection
- Breach database checking
- Strong password generation

✅ **Email Analysis**
- Urgent language detection
- Sensitive information requests identification
- Grammar error detection
- Phishing keyword matching

✅ **Threat Detection**
- Real-time alert generation
- Risk scoring algorithms
- Automated recommendations
- Severity classification

## License

MIT License

---

**Stay Secure. Stay Protected.** 🛡️
