/**
 * Cybersecurity Education Service
 * Provides educational content and training modules
 */
class CyberEducationService {
  constructor() {
    this.courses = [
      {
        id: 'phishing-101',
        title: 'Phishing Detection Basics',
        description: 'Learn how to identify and avoid phishing attacks',
        difficulty: 'Beginner',
        duration: '15 minutes',
        lessons: [
          {
            id: 'l1',
            title: 'What is Phishing?',
            content: 'Phishing is a social engineering attack where cybercriminals impersonate legitimate organizations to deceive users into revealing sensitive information.'
          },
          {
            id: 'l2',
            title: 'Common Phishing Tactics',
            content: 'Phishing emails often contain urgent language, suspicious links, and requests for personal information. They may appear to come from trusted sources like banks or social media platforms.'
          },
          {
            id: 'l3',
            title: 'How to Protect Yourself',
            content: 'Never click links from unknown senders, verify sender email addresses, check for HTTPS in URLs, and never share passwords or personal information via email.'
          }
        ]
      },
      {
        id: 'password-security',
        title: 'Strong Password Practices',
        description: 'Master the art of creating and managing secure passwords',
        difficulty: 'Beginner',
        duration: '20 minutes',
        lessons: [
          {
            id: 'l1',
            title: 'Password Basics',
            content: 'A strong password is your first line of defense. It should be long, complex, and unique for each account.'
          },
          {
            id: 'l2',
            title: 'Creating Strong Passwords',
            content: 'Use at least 12 characters with a mix of uppercase, lowercase, numbers, and special characters. Avoid birthdays, names, or dictionary words.'
          },
          {
            id: 'l3',
            title: 'Password Management',
            content: 'Use a password manager to generate and securely store complex passwords. This way you only need to remember one master password.'
          }
        ]
      },
      {
        id: 'mfa-guide',
        title: 'Multi-Factor Authentication (MFA)',
        description: 'Understand and implement MFA for enhanced security',
        difficulty: 'Intermediate',
        duration: '25 minutes',
        lessons: [
          {
            id: 'l1',
            title: 'What is MFA?',
            content: 'Multi-Factor Authentication requires two or more verification methods: something you know (password), something you have (phone), or something you are (fingerprint).'
          },
          {
            id: 'l2',
            title: 'Types of MFA',
            content: 'SMS codes, authenticator apps, hardware tokens, and biometric authentication are common MFA methods. Authenticator apps are generally more secure than SMS.'
          },
          {
            id: 'l3',
            title: 'Implementing MFA',
            content: 'Enable MFA on all your important accounts: email, banking, social media, and work systems. Backup codes should be stored securely.'
          }
        ]
      },
      {
        id: 'social-engineering',
        title: 'Recognizing Social Engineering',
        description: 'Identify manipulation tactics used by cybercriminals',
        difficulty: 'Intermediate',
        duration: '30 minutes',
        lessons: [
          {
            id: 'l1',
            title: 'Social Engineering Tactics',
            content: 'Attackers use psychological manipulation like urgency, fear, authority, and trust to trick people. They may impersonate IT staff, executives, or customers.'
          },
          {
            id: 'l2',
            title: 'Common Scenarios',
            content: 'Pretexting (false scenarios), baiting (tempting offers), tailgating (following into secure areas), and quid pro quo (promising favors) are common tactics.'
          },
          {
            id: 'l3',
            title: 'Defense Strategies',
            content: 'Always verify identities through official channels, never share credentials, trust your instincts, and report suspicious behavior.'
          }
        ]
      }
    ];

    this.threatArticles = [
      {
        id: 'article-1',
        title: 'Rising Threat: AI-Powered Phishing',
        category: 'Phishing',
        date: '2024-01-15',
        content: 'Artificial intelligence is being used to create more convincing phishing emails that can bypass traditional filters.'
      },
      {
        id: 'article-2',
        title: 'Ransomware Attacks on Small Businesses',
        category: 'Malware',
        date: '2024-01-10',
        content: 'Small businesses are increasingly targeted by ransomware. Implementing regular backups and employee training is crucial.'
      },
      {
        id: 'article-3',
        title: 'Data Breach Incidents Summary 2024',
        category: 'Data Breach',
        date: '2024-01-08',
        content: 'Analysis of major data breaches shows that weak passwords and phishing remain the primary attack vectors.'
      }
    ];
  }

  /**
   * Get all courses
   * @returns {array} - List of courses
   */
  getCourses() {
    return this.courses.map(course => ({
      id: course.id,
      title: course.title,
      description: course.description,
      difficulty: course.difficulty,
      duration: course.duration,
      lessonCount: course.lessons.length
    }));
  }

  /**
   * Get course details
   * @param {string} courseId - Course ID
   * @returns {object} - Course details with lessons
   */
  getCourseDetails(courseId) {
    return this.courses.find(c => c.id === courseId);
  }

  /**
   * Get all threat articles
   * @returns {array} - All articles
   */
  getThreatArticles() {
    return this.threatArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  /**
   * Get articles by category
   * @param {string} category - Category name
   * @returns {array} - Filtered articles
   */
  getArticlesByCategory(category) {
    return this.threatArticles.filter(a => a.category === category);
  }

  /**
   * Get security tips
   * @returns {array} - Daily security tips
   */
  getSecurityTips() {
    const tips = [
      'Change your passwords every 90 days for better security',
      'Enable two-factor authentication on all important accounts',
      'Be suspicious of urgent requests for personal information',
      'Verify email addresses carefully - attackers often use similar-looking addresses',
      'Use unique passwords for each account to minimize breach impact',
      'Keep your software and operating system updated with latest patches',
      'Use antivirus and firewall software on all devices',
      'Never connect to public WiFi without a VPN',
      'Back up important data regularly',
      'Think before you click - hover over links to see the actual URL'
    ];
    return tips.sort(() => Math.random() - 0.5).slice(0, 3);
  }

  /**
   * Get quiz on a course
   * @param {string} courseId - Course ID
   * @returns {array} - Quiz questions
   */
  getQuiz(courseId) {
    const quizzes = {
      'phishing-101': [
        {
          id: 'q1',
          question: 'What is a common sign of a phishing email?',
          options: [
            'Urgent language demanding immediate action',
            'Request for passwords or personal information',
            'Suspicious links or attachments',
            'All of the above'
          ],
          correctAnswer: 3,
          explanation: 'Phishing emails often use urgency, request sensitive information, and contain malicious links or attachments.'
        },
        {
          id: 'q2',
          question: 'What should you do if you receive a suspicious email?',
          options: [
            'Click the link to see what it is',
            'Report it and delete it without clicking anything',
            'Reply with your information to verify',
            'Forward it to all your contacts'
          ],
          correctAnswer: 1,
          explanation: 'Always report suspicious emails to your IT department and delete them without clicking any links.'
        }
      ],
      'password-security': [
        {
          id: 'q1',
          question: 'What is the minimum recommended password length?',
          options: ['6 characters', '8 characters', '12 characters', '16 characters'],
          correctAnswer: 2,
          explanation: 'A password of at least 12 characters with mixed character types is recommended for strong security.'
        }
      ]
    };
    return quizzes[courseId] || [];
  }
}

module.exports = new CyberEducationService();
