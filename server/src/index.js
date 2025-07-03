const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const convertRoutes = require('./routes/convert');
const cryptoRoutes = require('./routes/crypto');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration for deployment
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'https://swiftchain.vercel.app',
  'https://swiftchain-client.vercel.app',
  'https://swiftchain.netlify.app',
  process.env.FRONTEND_URL
].filter(Boolean);

// Middleware
app.use(helmet());
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    
    // Allow any localhost origin for development
    if (origin.startsWith('http://localhost:') || origin.startsWith('https://localhost:')) {
      return callback(null, true);
    }
    
    // Allow Vercel preview deployments
    if (origin.includes('.vercel.app')) {
      return callback(null, true);
    }
    
    // Allow Netlify deployments
    if (origin.includes('.netlify.app')) {
      return callback(null, true);
    }
    
    // In development mode, be more permissive
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode: allowing origin:', origin);
      return callback(null, true);
    }
    
    console.log('CORS blocked origin:', origin);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/convert', convertRoutes);
app.use('/api/crypto', cryptoRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'SwiftChain API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 SwiftChain Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Allowed origins:`, allowedOrigins);
});