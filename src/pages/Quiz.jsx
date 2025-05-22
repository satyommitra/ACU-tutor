/** @jsxImportSource react */
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Quiz = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(state.settings.timeLimit * 60);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleQuizEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    // Check if correct
    if (answer === state.quiz.questions[currentQuestion].correctAnswer) {
      setScore(prev => prev + 1);
    }
    
    // Move to next question or end
    setTimeout(() => {
      if (currentQuestion < state.quiz.questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        handleQuizEnd();
      }
    }, 1000);
  };

  const handleQuizEnd = () => {
    navigate('/results', {
      state: {
        score,
        totalQuestions: state.quiz.questions.length,
        timeTaken: (state.settings.timeLimit * 60) - timeLeft
      }
    });
  };

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="quiz-container">
      {/* Quiz UI implementation */}
    </div>
  );
};

export default Quiz;