const express = require('express');
const cors = require('cors');
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

// Routes
app.use('/api/phishing', phishingRoutes);
app.use('/api/password', passwordRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/alerts', alertRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'Securo Cybershield is running' });
});

app.listen(PORT, () => {
  console.log(`Securo Cybershield server running on port ${PORT}`);
});
