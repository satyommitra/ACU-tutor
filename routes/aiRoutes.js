// aiRoutes.js

import express from 'express';
import axios from 'axios';
import { protect } from '../middleware/authMiddleware.js';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

const router = express.Router();

// Load the Hugging Face API key from environment variables
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
const HF_MODEL = 'google/flan-t5-small'; // Free-tier friendly model

// POST endpoint for chatbot interaction
router.post('/chatbot', protect, async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  if (!HUGGINGFACE_API_KEY) {
    console.error('❌ Missing Hugging Face API key. Please set HUGGINGFACE_API_KEY in your .env file.');
    return res.status(500).json({ error: 'Server configuration error. API key missing.' });
  }

  // Log the API key prefix in development only
  if (process.env.NODE_ENV === 'development') {
    console.log('🔑 Loaded Hugging Face Key:', HUGGINGFACE_API_KEY.slice(0, 10) + '...');
  }

  // Construct the prompt for Hugging Face
  const prompt = `
You are TutorBot 🤖 — a helpful, creative, and fun AI tutor. Always use emojis, keep answers friendly, and ask engaging follow-up questions.

User: ${message}
TutorBot:
`.trim();

  try {
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${HF_MODEL}`,
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Log the response (optional for debugging)
    console.log('🧠 Hugging Face Response:', response.data);

    // Extract and clean the response
    const rawText = response.data?.[0]?.generated_text || '';
    const botReply = rawText.replace(prompt, '').trim();

    res.json({ response: botReply || "🤔 Hmm, I didn't catch that. Can you try rephrasing?" });
  } catch (error) {
    console.error('❌ Hugging Face API error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get response from TutorBot.' });
  }
});

export default router;








