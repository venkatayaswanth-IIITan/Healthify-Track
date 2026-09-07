const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Database Connection with graceful fallback
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/healthtracker';

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 3000
})
.then(() => {
  console.log('✅ MongoDB connected successfully');
})
.catch((err) => {
  console.warn('⚠️ MongoDB connection warning (running in standalone mode):', err.message);
});

// ----------------------------------------------------
// AWS EC2 / Single Server All-in-One Deployment Support:
// Serve built static frontend from client/dist if present
// ----------------------------------------------------
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  // If request is not an API call, serve client index.html (SPA support)
  if (!req.path.startsWith('/api')) {
    return res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
      if (err) {
        res.json({
          status: 'online',
          service: 'HealthTrack Backend API',
          version: '1.0.0',
          message: 'Frontend dist not found. Run "npm run client:build" to build client.'
        });
      }
    });
  }
  next();
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 HealthTrack Server is listening on port ${PORT}`);
  console.log(`📍 API Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
