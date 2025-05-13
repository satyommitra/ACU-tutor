import express from 'express';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Local response database
const RESPONSE_DATABASE = {
  greetings: ["Hello! 👋", "Hi there!", "Greetings!"],
  questions: [
    "That's an interesting question. Let me think...",
    "I'd be happy to help with that.",
    "Could you tell me more about what you're looking for?"
  ],
  fallbacks: [
    "I'm still learning!",
    "Let me connect you with a human expert.",
    "Try asking me something else!"
  ]
};

// Smart local response generator
function generateResponse(message) {
  const lowerMsg = message.toLowerCase();
  
  // Greeting detection
  if (/hello|hi|hey|greetings/.test(lowerMsg)) {
    return RESPONSE_DATABASE.greetings[
      Math.floor(Math.random() * RESPONSE_DATABASE.greetings.length)
    ];
  }
  
  // Question detection
  if (/\?|what|how|why|who/.test(lowerMsg)) {
    return RESPONSE_DATABASE.questions[
      Math.floor(Math.random() * RESPONSE_DATABASE.questions.length)
    ];
  }
  
  // Default fallback
  return RESPONSE_DATABASE.fallbacks[
    Math.floor(Math.random() * RESPONSE_DATABASE.fallbacks.length)
  ];
}

router.post('/chatbot', protect, async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  try {
    // Generate local response
    const response = generateResponse(message);
    
    return res.json({ 
      response,
      notice: "This is a local response while our AI systems are being upgraded"
    });
    
  } catch (error) {
    console.log('Local response failed:', error.message);
    res.json({
      response: "Thanks for your message! Our team will get back to you shortly.",
      contact: "support@example.com"
    });
  }
});

export default router;





