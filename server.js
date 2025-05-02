// server.js

import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js'; // ✅ correct relative path and extension
import aiRoutes from './routes/aiRoutes.js';

dotenv.config();
const app = express();

// ✅ Middleware to parse JSON bodies
app.use(express.json());

// ✅ Proper CORS config
app.use(cors({
  origin: 'http://localhost:5174', // Allow Vite dev server
  credentials: true,
}));

// ✅ Routes
app.use('/api/ai', aiRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('✅ API is running...');
});

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully!'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// ✅ Test route (useful for debugging)
app.post('/test', (req, res) => {
  console.log('BODY:', req.body); // Log incoming request body
  res.json({ received: req.body });
});

// ✅ 404 handler for non-existent routes
app.use((req, res) => {
  res.status(404).json({ message: '❌ Route not found' });
});

// ✅ Server listening
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});






