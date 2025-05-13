// routes/quizRoutes.js
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Question } from '../models/Question.js'; 
import authenticate from '../middleware/authenticate.js';

const router = express.Router();

router.post('/create', authenticate, async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ 
      success: false,
      message: 'Database not connected',
      dbState: mongoose.connection.readyState 
    });
  }
});
// Create new quiz
router.post('/create', authenticate, async (req, res) => {
  try {
    const { topic, difficulty, questionCount = 10, timeLimit = 30 } = req.body;

    // Validate input
    if (!topic || !difficulty) {
      return res.status(400).json({ 
        success: false,
        message: 'Topic and difficulty are required' 
      });
    }

    // Get random questions
    const questions = await Question.aggregate([
      { $match: { topic, difficulty } },
      { $sample: { size: parseInt(questionCount) } },
      { $project: { 
        _id: 0,
        id: '$_id',
        questionText: 1,
        options: 1,
        explanation: 1
      }}
    ]);

    if (questions.length < parseInt(questionCount)) {
      return res.status(404).json({ 
        success: false,
        message: `Only ${questions.length} questions available`,
        available: questions.length,
        required: questionCount
      });
    }

    // Create quiz response
    const quiz = {
      quizId: uuidv4(),
      userId: req.user.id,
      topic,
      difficulty,
      questions,
      settings: {
        timeLimit: parseInt(timeLimit),
        totalQuestions: parseInt(questionCount)
      },
      createdAt: new Date()
    };

    res.status(201).json({
      success: true,
      quiz
    });

  } catch (err) {
    console.error('Quiz creation error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to create quiz',
      error: err.message 
    });
  }
});

// Add more endpoints as needed
export { router as quizRoutes }; // Named export