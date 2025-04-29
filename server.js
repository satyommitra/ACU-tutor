// server.js

import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js'; // Import your auth routes

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON request bodies

// Root API Route
app.get('/', (req, res) => {
  res.send('✅ API is running...');
});

// MongoDB Connection (clean - no deprecated options)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully!'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1); // Stop server if DB fails
  });

// API Routes
app.use('/api/auth', authRoutes); // Prefix for all auth endpoints

// Handle undefined routes
app.use((req, res) => {
  res.status(404).json({ message: '❌ Route not found' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});


