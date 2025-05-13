/** @jsxImportSource react */
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const Practice = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [quizSettings, setQuizSettings] = useState({
    questionCount: 10,
    timeLimit: 30 // minutes
  });

  // Get topic from URL if coming from dashboard
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const topic = query.get('topic');
    if (topic) setSelectedTopic(topic);
  }, [location]);

  const topics = [
    'Algebra', 'Geometry', 'Probability', 
    'Statistics', 'Trigonometry', 'Calculus',
    'Number Theory', 'Logic & Reasoning', 'Data Interpretation'
  ];

  const difficulties = ['Easy', 'Medium', 'Hard'];

  const handleStartQuiz = async () => {
    if (!selectedTopic || !selectedDifficulty) {
      setError('Please select both a topic and difficulty level');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await axios.post('http://localhost:5000/api/quizzes/create', {
        topic: selectedTopic,
        difficulty: selectedDifficulty,
        questionCount: quizSettings.questionCount,
        timeLimit: quizSettings.timeLimit
      });

      navigate('/quiz', { 
        state: { 
          quiz: response.data,
          settings: quizSettings
        }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create quiz');
      console.error('Quiz creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 text-white p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-6 text-center">Quiz Creator</h1>
        
        {/* Topic Selection */}
        <div className="mb-8 bg-white/10 p-6 rounded-xl">
          <h2 className="text-2xl font-semibold mb-4">1. Select Topic</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {topics.map(topic => (
              <motion.button
                key={topic}
                className={`p-4 rounded-lg transition-all ${selectedTopic === topic ? 'bg-blue-600' : 'bg-blue-800 hover:bg-blue-700'}`}
                onClick={() => setSelectedTopic(topic)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                {topic}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Difficulty Selection */}
        <div className="mb-8 bg-white/10 p-6 rounded-xl">
          <h2 className="text-2xl font-semibold mb-4">2. Choose Difficulty</h2>
          <div className="flex gap-4">
            {difficulties.map(level => (
              <motion.button
                key={level}
                className={`flex-1 py-3 rounded-lg ${
                  selectedDifficulty === level 
                    ? level === 'Easy' ? 'bg-green-600' 
                      : level === 'Medium' ? 'bg-yellow-600' 
                      : 'bg-red-600'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
                onClick={() => setSelectedDifficulty(level)}
                whileHover={{ scale: 1.02 }}
              >
                {level}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Quiz Settings */}
        <div className="mb-8 bg-white/10 p-6 rounded-xl">
          <h2 className="text-2xl font-semibold mb-4">3. Quiz Settings</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2">Number of Questions: {quizSettings.questionCount}</label>
              <input
                type="range"
                min="5"
                max="20"
                value={quizSettings.questionCount}
                onChange={(e) => setQuizSettings({...quizSettings, questionCount: e.target.value})}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block mb-2">Time Limit: {quizSettings.timeLimit} minutes</label>
              <input
                type="range"
                min="5"
                max="60"
                step="5"
                value={quizSettings.timeLimit}
                onChange={(e) => setQuizSettings({...quizSettings, timeLimit: e.target.value})}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Start Button */}
        <div className="text-center">
          <motion.button
            onClick={handleStartQuiz}
            disabled={loading || !selectedTopic || !selectedDifficulty}
            className={`px-8 py-4 rounded-full text-xl font-bold ${
              loading ? 'bg-gray-600' : 'bg-indigo-600 hover:bg-indigo-500'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span> Creating Quiz...
              </span>
            ) : (
              'Start Quiz Now'
            )}
          </motion.button>
          
          {error && (
            <motion.p 
              className="mt-4 text-red-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Practice;

