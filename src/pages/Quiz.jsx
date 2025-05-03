import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Quiz = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const res = await axios.get('/api/quiz'); // Fetch quiz questions
        setQuestions(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching quiz data:', error);
      }
    };

    fetchQuizData();
  }, []);

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer) {
      if (selectedAnswer.correct) {
        setScore(score + 1);
      }

      setSelectedAnswer(null);
      setCurrentQuestion(currentQuestion + 1);

      if (currentQuestion + 1 === questions.length) {
        setQuizCompleted(true);
      }
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setQuizCompleted(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white font-poppins">
        <p>Loading Quiz...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-700 text-white font-poppins overflow-hidden">
      {/* Quiz Progress Bar */}
      <motion.div
        className="absolute top-0 left-0 w-full h-2 bg-indigo-600"
        initial={{ width: '0%' }}
        animate={{ width: `${(currentQuestion / questions.length) * 100}%` }}
        transition={{ duration: 0.5 }}
      />

      {/* Quiz Content */}
      <div className="max-w-4xl mx-auto p-6 mt-10">
        {!quizCompleted ? (
          <div>
            <motion.div
              className="mb-6 p-6 bg-white bg-opacity-30 backdrop-blur-md rounded-xl shadow-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-3xl font-semibold mb-4">{questions[currentQuestion]?.question}</h2>

              <div className="space-y-4">
                {questions[currentQuestion]?.options.map((option, index) => (
                  <motion.button
                    key={index}
                    className={`w-full text-left p-4 rounded-lg border-2 ${
                      selectedAnswer === option
                        ? 'bg-indigo-500 text-white border-indigo-500'
                        : 'bg-gray-800 text-white border-gray-500'
                    } hover:bg-indigo-600 focus:outline-none`}
                    onClick={() => handleAnswerSelect(option)}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    {option.text}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Next Question Button */}
            <motion.button
              className="mt-6 w-full py-3 px-4 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-200"
              onClick={handleNextQuestion}
              whileHover={{ scale: 1.05 }}
            >
              {currentQuestion + 1 === questions.length ? 'Finish Quiz' : 'Next Question'}
            </motion.button>
          </div>
        ) : (
          <div className="text-center mt-16">
            <motion.div
              className="bg-white bg-opacity-30 backdrop-blur-md p-8 rounded-xl shadow-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl font-semibold mb-4">Quiz Completed! 🎉</h2>
              <p className="text-xl mb-6">Your Score: {score} / {questions.length}</p>
              <motion.button
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
                onClick={handleRestartQuiz}
                whileHover={{ scale: 1.05 }}
              >
                Retry Quiz
              </motion.button>
              <motion.button
                className="mt-4 w-full py-3 px-4 bg-gray-700 text-white rounded-lg shadow-md hover:bg-gray-800 transition duration-200"
                onClick={() => navigate('/dashboard')}
                whileHover={{ scale: 1.05 }}
              >
                Go to Dashboard
              </motion.button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;

