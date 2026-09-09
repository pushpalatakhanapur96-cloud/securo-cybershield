// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    loadDashboard();
    setupFormListeners();
});

// Navigation
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = item.getAttribute('data-section');
            showSection(sectionId);

            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        });
    });
}

function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));

    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');

        // Load section-specific data
        if (sectionId === 'education') {
            loadEducationContent();
        } else if (sectionId === 'alerts') {
            loadAllAlerts();
        }
    }
}

function scrollToSection(sectionId) {
    const navItem = document.querySelector(`[data-section="${sectionId}"]`);
    if (navItem) {
        navItem.click();
    }
}

// Dashboard
async function loadDashboard() {
    try {
        // Load security score
        const scoreResponse = await fetch(`${API_BASE_URL}/alerts/security-score`);
        const scoreData = await scoreResponse.json();

        document.getElementById('scoreValue').textContent = scoreData.score;
        document.getElementById('scoreLabel').textContent = scoreData.level;

        // Update score details
        const scoreDetails = document.getElementById('scoreDetails');
        scoreDetails.innerHTML = `
            <div class="score-detail-item">
                <span>Status:</span>
                <strong>${scoreData.message}</strong>
            </div>
        `;

        // Update alert counts
        if (scoreData.alertSummary) {
            document.getElementById('criticalCount').textContent = scoreData.alertSummary.critical;
            document.getElementById('highCount').textContent = scoreData.alertSummary.high;
            document.getElementById('mediumCount').textContent = scoreData.alertSummary.medium;
            document.getElementById('lowCount').textContent = scoreData.alertSummary.low;
        }

        // Load recent alerts
        loadRecentAlerts();
    } catch (error) {
        console.error('Error loading dashboard:', error);
        showNotification('Error loading dashboard', 'error');
    }
}

async function loadRecentAlerts() {
    try {
        const response = await fetch(`${API_BASE_URL}/alerts`);
        const alerts = await response.json();

        const alertsList = document.getElementById('alertsList');

        if (alerts.length === 0) {
            alertsList.innerHTML = '<p class="empty-state">No alerts at this time. Your system is secure! ✅</p>';
            return;
        }

        // Show only last 5 alerts
        const recentAlerts = alerts.slice(0, 5);
        alertsList.innerHTML = recentAlerts.map(alert => `
            <div class="alert-item ${alert.severity}">
                <div class="alert-content">
                    <div class="alert-title">
                        ${getSeverityIcon(alert.severity)} ${alert.type.toUpperCase()}
                    </div>
                    <div class="alert-message">${alert.message}</div>
                    <div class="alert-details" style="font-size: 12px; color: var(--text-secondary);">
                        Risk Score: ${alert.riskScore}/100 | ${formatDate(alert.timestamp)}
                    </div>
                </div>
                <div class="alert-actions">
                    <button onclick="acknowledgeAlert('${alert.id}')">Acknowledge</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading alerts:', error);
    }
}

// Phishing Detection
async function analyzeURL(event) {
    event.preventDefault();
    const url = document.getElementById('urlInput').value;

    if (!url) {
        showNotification('Please enter a URL', 'warning');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/phishing/analyze-url`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url })
        });

        const result = await response.json();
        displayURLResult(result);
    } catch (error) {
        console.error('Error analyzing URL:', error);
        showNotification('Error analyzing URL', 'error');
    }
}

function displayURLResult(result) {
    const resultBox = document.getElementById('urlResult');
    const riskLevel = result.riskScore >= 80 ? 'danger' : result.riskScore >= 60 ? 'warning' : 'safe';

    resultBox.className = `result-box show ${riskLevel}`;
    resultBox.innerHTML = `
        <div class="result-item">
            <strong>Risk Score: ${result.riskScore}/100</strong>
        </div>
        <div class="result-item">
            <strong>Status: ${result.safe ? '✅ SAFE' : '⚠️ SUSPICIOUS'}</strong>
        </div>
        ${result.threats.length > 0 ? `
            <div class="result-item" style="margin-top: 12px;">
                <strong>Threats Detected:</strong>
                <ul style="margin-left: 16px; margin-top: 8px;">
                    ${result.threats.map(threat => `<li style="color: #f87171; font-size: 13px;">• ${threat}</li>`).join('')}
                </ul>
            </div>
        ` : ''}
    `;

    showNotification(`URL analyzed: ${result.safe ? 'Safe' : 'Suspicious'}`, result.safe ? 'success' : 'error');
}

async function analyzeEmail(event) {
    event.preventDefault();
    const emailContent = document.getElementById('emailContent').value;
    const senderEmail = document.getElementById('emailSender').value;

    if (!emailContent) {
        showNotification('Please enter email content', 'warning');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/phishing/analyze-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ emailContent, senderEmail })
        });

        const result = await response.json();
        displayEmailResult(result);
    } catch (error) {
        console.error('Error analyzing email:', error);
        showNotification('Error analyzing email', 'error');
    }
}

function displayEmailResult(result) {
    const resultBox = document.getElementById('emailResult');
    const riskLevel = result.riskScore >= 50 ? 'danger' : 'safe';

    resultBox.className = `result-box show ${riskLevel}`;
    resultBox.innerHTML = `
        <div class="result-item">
            <strong>Risk Score: ${result.riskScore}/100</strong>
        </div>
        <div class="result-item">
            <strong>Status: ${result.safe ? '✅ SAFE' : '⚠️ SUSPICIOUS'}</strong>
        </div>
        ${result.threats.length > 0 ? `
            <div class="result-item" style="margin-top: 12px;">
                <strong>Threats Detected:</strong>
                <ul style="margin-left: 16px; margin-top: 8px;">
                    ${result.threats.map(threat => `<li style="color: #f87171; font-size: 13px;">• ${threat}</li>`).join('')}
                </ul>
            </div>
        ` : ''}
    `;

    showNotification(`Email analyzed: ${result.safe ? 'Safe' : 'Suspicious'}`, result.safe ? 'success' : 'error');
}

// Password Security
async function evaluatePassword(event) {
    event.preventDefault();
    const password = document.getElementById('passwordInput').value;

    if (!password) {
        showNotification('Please enter a password', 'warning');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/password/evaluate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });

        const result = await response.json();
        displayPasswordResult(result);
    } catch (error) {
        console.error('Error evaluating password:', error);
        showNotification('Error evaluating password', 'error');
    }
}

function displayPasswordResult(result) {
    const resultBox = document.getElementById('passwordResult');
    const strengthColor = result.score >= 80 ? '#10b981' : result.score >= 60 ? '#f59e0b' : '#ef4444';

    resultBox.className = 'result-box show';
    resultBox.style.borderColor = strengthColor;
    resultBox.innerHTML = `
        <div class="result-item">
            <strong>Strength: ${result.strength}</strong>
            <div style="margin-top: 8px; background: rgba(0,0,0,0.2); height: 6px; border-radius: 3px; overflow: hidden;">
                <div style="width: ${result.score}%; height: 100%; background: ${strengthColor}; transition: width 0.3s;"></div>
            </div>
            <div style="margin-top: 4px; font-size: 12px; color: #cbd5e1;">Score: ${result.score}/100</div>
        </div>
        ${result.recommendations.length > 0 ? `
            <div class="result-item" style="margin-top: 12px;">
                <strong>Recommendations:</strong>
                <ul style="margin-left: 16px; margin-top: 8px;">
                    ${result.recommendations.map(rec => `<li style="color: #fbbf24; font-size: 13px;">• ${rec}</li>`).join('')}
                </ul>
            </div>
        ` : ''}
    `;
}

async function generatePassword(event) {
    event.preventDefault();
    const length = document.getElementById('passwordLength').value;

    try {
        const response = await fetch(`${API_BASE_URL}/password/generate?length=${length}`);
        const result = await response.json();
        displayGeneratedPassword(result.password);
    } catch (error) {
        console.error('Error generating password:', error);
        showNotification('Error generating password', 'error');
    }
}

function displayGeneratedPassword(password) {
    const resultBox = document.getElementById('generatedPassword');
    resultBox.className = 'result-box show safe';
    resultBox.innerHTML = `
        <div class="result-item">
            <strong>Generated Password:</strong>
            <div style="margin-top: 8px; padding: 12px; background: rgba(0,0,0,0.3); border-radius: 6px; word-break: break-all; font-family: monospace; font-weight: 600;">
                ${password}
            </div>
            <button onclick="copyToClipboard('${password}')" style="margin-top: 8px; padding: 8px 16px; background: #6366f1; color: white; border: none; border-radius: 4px; cursor: pointer;">
                📋 Copy to Clipboard
            </button>
        </div>
    `;
    showNotification('✅ Strong password generated successfully!', 'success');
}

async function checkPasswordBreach(event) {
    event.preventDefault();
    const password = document.getElementById('breachCheckInput').value;

    if (!password) {
        showNotification('Please enter a password', 'warning');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/password/check-breach`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });

        const result = await response.json();
        displayBreachResult(result);
    } catch (error) {
        console.error('Error checking breach:', error);
        showNotification('Error checking password breach', 'error');
    }
}

function displayBreachResult(result) {
    const resultBox = document.getElementById('breachResult');
    const riskLevel = result.breached ? 'danger' : 'safe';

    resultBox.className = `result-box show ${riskLevel}`;
    resultBox.innerHTML = `
        <div class="result-item">
            <strong>${result.breached ? '⚠️ PASSWORD BREACHED!' : '✅ Password Not Found in Breaches'}</strong>
        </div>
        ${result.breached ? `
            <div class="result-item" style="margin-top: 8px; color: #f87171;">
                This password has been found <strong>${result.timesFound.toLocaleString()}</strong> times in known data breaches.
            </div>
        ` : ''}
        <div class="result-item" style="margin-top: 12px; font-size: 13px;">
            ${result.recommendation}
        </div>
    `;

    showNotification(result.breached ? '⚠️ Password found in breaches!' : '✅ Password not found in breaches', result.breached ? 'error' : 'success');
}

// Alerts Management
async function loadAllAlerts() {
    try {
        const response = await fetch(`${API_BASE_URL}/alerts`);
        const alerts = await response.json();
        displayAlerts(alerts);
    } catch (error) {
        console.error('Error loading alerts:', error);
        showNotification('Error loading alerts', 'error');
    }
}

function displayAlerts(alerts) {
    const container = document.getElementById('alertsContainer');

    if (alerts.length === 0) {
        container.innerHTML = '<p class="empty-state">No alerts at this time. Your system is secure! ✅</p>';
        return;
    }

    container.innerHTML = alerts.map(alert => `
        <div class="alert-item ${alert.severity}">
            <div class="alert-content">
                <div class="alert-title">
                    ${getSeverityIcon(alert.severity)} ${alert.type.toUpperCase()}
                </div>
                <div class="alert-message">${alert.message}</div>
                <div class="alert-meta" style="font-size: 12px; color: #cbd5e1; margin-top: 8px;">
                    Risk Score: ${alert.riskScore}/100 | ${formatDate(alert.timestamp)}
                </div>
                ${alert.recommendations && alert.recommendations.length > 0 ? `
                    <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.1);">
                        <strong style="font-size: 13px;">Recommendations:</strong>
                        <ul style="margin-left: 16px; margin-top: 8px; font-size: 12px;">
                            ${alert.recommendations.slice(0, 3).map(rec => `<li>• ${rec}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
            <div class="alert-actions">
                <button onclick="acknowledgeAlert('${alert.id}')">Acknowledge</button>
            </div>
        </div>
    `).join('');
}

function filterAlerts(severity) {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Reload with filter - for now just reload all
    loadAllAlerts();
}

async function acknowledgeAlert(alertId) {
    try {
        const response = await fetch(`${API_BASE_URL}/alerts/${alertId}/acknowledge`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            showNotification('Alert acknowledged', 'success');
            loadRecentAlerts();
            loadAllAlerts();
        }
    } catch (error) {
        console.error('Error acknowledging alert:', error);
        showNotification('Error acknowledging alert', 'error');
    }
}

async function clearAllAlerts() {
    if (confirm('Are you sure you want to clear all alerts?')) {
        try {
            const response = await fetch(`${API_BASE_URL}/alerts/clear`, {
                method: 'DELETE'
            });

            if (response.ok) {
                showNotification('All alerts cleared', 'success');
                loadDashboard();
            }
        } catch (error) {
            console.error('Error clearing alerts:', error);
            showNotification('Error clearing alerts', 'error');
        }
    }
}

// Education Content
async function loadEducationContent() {
    await loadCourses();
    await loadSecurityTips();
    await loadThreatArticles();
}

async function loadCourses() {
    try {
        const response = await fetch(`${API_BASE_URL}/education/courses`);
        const courses = await response.json();

        const coursesGrid = document.getElementById('coursesGrid');
        coursesGrid.innerHTML = courses.map(course => `
            <div class="course-card" onclick="loadCourseDetail('${course.id}')">
                <div class="course-title">${course.title}</div>
                <p style="font-size: 12px; color: #cbd5e1; margin-bottom: 12px;">${course.description}</p>
                <div class="course-meta">
                    <span>📚 ${course.lessonCount} lessons</span>
                    <span>⏱️ ${course.duration}</span>
                    <span>📊 ${course.difficulty}</span>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading courses:', error);
    }
}

async function loadSecurityTips() {
    try {
        const response = await fetch(`${API_BASE_URL}/education/tips`);
        const tips = await response.json();

        const tipsContainer = document.getElementById('tipsContainer');
        tipsContainer.innerHTML = tips.map(tip => `
            <div class="tip">
                💡 ${tip}
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading tips:', error);
    }
}

async function loadThreatArticles() {
    try {
        const response = await fetch(`${API_BASE_URL}/education/articles`);
        const articles = await response.json();

        const articlesList = document.getElementById('articlesList');
        articlesList.innerHTML = articles.map(article => `
            <div class="article-item">
                <div class="article-title">${article.title}</div>
                <div class="article-meta">
                    <span>📁 ${article.category}</span>
                    <span>📅 ${formatDate(article.date)}</span>
                </div>
                <div class="article-content">${article.content}</div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading articles:', error);
    }
}

function loadCourseDetail(courseId) {
    alert(`Course: ${courseId}\n\nFull course content feature coming soon!`);
}

// Helper Functions
function setupFormListeners() {
    document.getElementById('urlAnalysisForm')?.addEventListener('submit', analyzeURL);
    document.getElementById('emailAnalysisForm')?.addEventListener('submit', analyzeEmail);
    document.getElementById('passwordEvalForm')?.addEventListener('submit', evaluatePassword);
    document.getElementById('passwordGenForm')?.addEventListener('submit', generatePassword);
    document.getElementById('breachCheckForm')?.addEventListener('submit', checkPasswordBreach);
}

function getSeverityIcon(severity) {
    const icons = {
        'critical': '🔴',
        'high': '🟠',
        'medium': '🟡',
        'low': '🟢'
    };
    return icons[severity] || '⚪';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification show ${type}`;

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('✅ Copied to clipboard!', 'success');
    });
}

function refreshData() {
    showNotification('🔄 Refreshing data...', 'success');
    loadDashboard();
    loadEducationContent();
}
