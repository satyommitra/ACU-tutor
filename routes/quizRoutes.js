// quizRoutes.js (or similar)
import express from 'express';
import Question from '/path/to/QuestionModel.js';  // Assuming you have a Question model

const router = express.Router();

// Route to get quiz questions based on topic and difficulty
router.get('/quiz', async (req, res) => {
  try {
    const { topic, difficulty } = req.query;

    if (!topic || !difficulty) {
      return res.status(400).json({ message: 'Topic and difficulty are required' });
    }

    // Fetch questions from database based on topic and difficulty
    const questions = await Question.find({ topic, difficulty });

    if (!questions || questions.length === 0) {
      return res.status(404).json({ message: 'No questions found for this topic and difficulty' });
    }

    res.status(200).json(questions);
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

export default router;
