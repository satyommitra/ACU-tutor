// server.js

import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js'; // ✅ correct relative path and extension

dotenv.config();
const app = express();

// ✅ Proper CORS config
app.use(cors({
  origin: 'http://localhost:5174', // allow Vite dev server
  credentials: true
}));

app.use(express.json());
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('✅ API is running...');
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully!'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });


app.use((req, res) => {
  res.status(404).json({ message: '❌ Route not found' });
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});





