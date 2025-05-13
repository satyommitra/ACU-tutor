// models/Question.js
import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
    enum: ['Algebra', 'Geometry', 'Probability', 'Statistics', 
           'Trigonometry', 'Calculus', 'Number Theory', 
           'Logic & Reasoning', 'Data Interpretation']
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard']
  },
  questionText: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: options => options.length === 4,
      message: 'There must be exactly 4 options'
    }
  },
  correctAnswer: {
    type: String,
    required: true
  },
  explanation: {
    type: String,
    required: true
  }
}, { timestamps: true });

// Change this line from default export to named export
export const Question = mongoose.model('Question', questionSchema);