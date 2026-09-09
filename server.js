const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const phishingRoutes = require('./routes/phishing');
const passwordRoutes = require('./routes/password');
const educationRoutes = require('./routes/education');
const alertRoutes = require('./routes/alerts');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/phishing', phishingRoutes);
app.use('/api/password', passwordRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/alerts', alertRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'Securo Cybershield is running' });
});

// Serve index.html for all other routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║   🛡️  SECURO CYBERSHIELD SERVER RUNNING   ║
╠════════════════════════════════════════════╣
║  Server: http://localhost:${PORT}           ║
║  Dashboard: http://localhost:${PORT}        ║
║  API: http://localhost:${PORT}/api          ║
╚════════════════════════════════════════════╝
  `);
});
