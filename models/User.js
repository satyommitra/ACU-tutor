import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // Progress tracking fields
  xp: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  badges: {
    type: [String],
    default: []
  },
  streak: {
    type: Number,
    default: 0
  },
  weakTopics: {
    type: [String],
    default: []
  },
  activityLog: [
    {
      message: String,
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  completedQuizzes: {
    type: [String], // or an object/array of quiz objects if more detail needed
    default: []
  }
});

const User = mongoose.model('User', userSchema);

export default User;



