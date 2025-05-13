import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { quizRoutes } from './routes/quizRoutes.js'; // New quiz routes

// ✅ Load environment variables
dotenv.config();

// Environment Validation
const validateEnv = () => {
  const requiredEnvVars = [
    'HUGGINGFACE_API_KEY',
    'MONGO_URI',
    'JWT_SECRET'
  ];

  let isValid = true;
  requiredEnvVars.forEach(envVar => {
    if (!process.env[envVar]) {
      console.error(`❌ Missing ${envVar} in environment variables`);
      isValid = false;
    }
  });

  if (!isValid) process.exit(1);

  // Log partial keys for verification
  console.log('🔑 HF Key:', process.env.HUGGINGFACE_API_KEY?.slice(0, 6) + '...');
  console.log('🔑 JWT Secret:', process.env.JWT_SECRET?.slice(0, 6) + '...');
  console.log('✅ Environment variables validated');
};

validateEnv();

const app = express();

// ✅ Enhanced Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5174',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/quiz', quizRoutes); // New quiz endpoint

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    dbState: mongoose.connection.readyState,
    timestamp: new Date()
  });
});

// Home Route
app.get('/', (req, res) => {
  res.json({
    message: '✅ API is running',
    endpoints: {
      auth: '/api/auth',
      user: '/api/user',
      ai: '/api/ai',
      quiz: '/api/quiz'
    },
    version: process.env.npm_package_version
  });
});

// ✅ MongoDB Connection with enhanced options
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4, // Use IPv4, skip IPv6
  retryWrites: true,
  w: 'majority'
};

mongoose.connect(process.env.MONGO_URI, mongoOptions)
  .then(() => {
    console.log('✅ MongoDB connected successfully!');
    console.log(`📊 Database: ${mongoose.connection.name}`);
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// Connection event listeners
mongoose.connection.on('connected', () => {
  console.log('📚 Mongoose default connection open');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose default connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ Mongoose default connection disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('⏏️ MongoDB connection disconnected through app termination');
  process.exit(0);
});

// ✅ Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('🔥 Error:', err.stack);
  res.status(500).json({
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

// ✅ 404 Fallback
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    suggestion: 'Check / endpoint for available routes' 
  });
});

// ✅ Start Server
const PORT = process.env.PORT || 5050;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`🌐 Listening at http://localhost:${PORT}`);
});

// Handle server errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
  } else {
    console.error('❌ Server error:', err);
  }
  process.exit(1);
});






