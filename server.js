import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import userRoutes from './routes/userRoutes.js';

// ✅ Load environment variables
dotenv.config();

// ✅ Verify env loading (Check if Hugging Face API key is loaded)
if (!process.env.HUGGINGFACE_API_KEY) {
  console.error('❌ Missing Hugging Face API Key. Please ensure it is defined in your .env file.');
  process.exit(1); // Exit the app if the API key is missing
} else {
  console.log('🔑 HF Key (start):', process.env.HUGGINGFACE_API_KEY?.slice(0, 10) + '...');
}

// ✅ Ensure MongoDB URI is loaded properly
if (!process.env.MONGO_URI) {
  console.error('❌ Missing MongoDB URI. Please ensure it is defined in your .env file.');
  process.exit(1); // Exit if MongoDB URI is not set
} else {
  console.log('✅ MongoDB URI is loaded');
}

const app = express();

// ✅ Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5174', // Adjust if deployed elsewhere
  credentials: true,
}));

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/ai', aiRoutes); // Includes TutorBot via /chatbot

app.get('/', (req, res) => {
  res.send('✅ API is running...');
});

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true, // Ensure this doesn't show warnings in the future
  useUnifiedTopology: true // Same as above
})
  .then(() => console.log('✅ MongoDB connected successfully!'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1); // Exit if MongoDB connection fails
  });

// ✅ Test Route
app.post('/test', (req, res) => {
  console.log('BODY:', req.body);
  res.json({ received: req.body });
});

// ✅ 404 Fallback
app.use((req, res) => {
  res.status(404).json({ message: '❌ Route not found' });
});

// ✅ Start Server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});




