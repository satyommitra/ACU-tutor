import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const Practice = () => {
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const topics = [
    'Algebra',
    'Geometry',
    'Probability',
    'Statistics',
    'Trigonometry',
    'Calculus',
    'Number Theory',
    'Logic & Reasoning',
    'Data Interpretation',
  ];

  const difficulties = ['Easy', 'Medium', 'Hard'];

  const handleStartQuiz = async () => {
    if (!selectedTopic || !selectedDifficulty) {
      alert('Please select both a topic and a difficulty level.');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get('/api/quiz', {
        params: {
          topic: selectedTopic,
          difficulty: selectedDifficulty,
        },
      });
      setQuestions(res.data);
      navigate('/dashboard/quiz', { state: { questions, selectedTopic, selectedDifficulty } }); // Assuming you have a quiz page for displaying questions
    } catch (err) {
      setError('Failed to load quiz questions.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 text-white font-poppins p-10">
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl font-bold mb-4">📚 Practice Quiz</h1>
        <p className="text-lg text-slate-300">Choose a topic and difficulty to start practicing!</p>
      </motion.div>

      {/* Topic Selector */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-xl font-semibold mb-4">Choose a Topic:</h2>
        <div className="flex flex-wrap justify-center gap-6">
          {topics.map((topic, index) => (
            <motion.button
              key={index}
              className={`bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition duration-300 ${
                selectedTopic === topic ? 'bg-blue-800' : ''
              }`}
              onClick={() => setSelectedTopic(topic)}
            >
              {topic}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Difficulty Selector */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-xl font-semibold mb-4">Select Difficulty:</h2>
        <div className="flex justify-center gap-6">
          {difficulties.map((level, index) => (
            <motion.button
              key={index}
              className={`bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg transition duration-300 ${
                selectedDifficulty === level ? 'bg-green-800' : ''
              }`}
              onClick={() => setSelectedDifficulty(level)}
            >
              {level}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Start Quiz Button */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <button
          onClick={handleStartQuiz}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xl py-3 px-8 rounded-full transition duration-300"
        >
          {loading ? 'Loading...' : 'Start Quiz'}
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </motion.div>
    </div>
  );
};

export default Practice;

