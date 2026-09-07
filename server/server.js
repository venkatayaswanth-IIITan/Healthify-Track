const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: '*', // Allow all origins for seamless development & cross-deployment
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);

// Health check endpoint (for Render / uptime monitors)
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'HealthTrack Backend API',
    version: '1.0.0',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

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

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 HealthTrack Server is listening on port ${PORT}`);
  console.log(`📍 API Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
