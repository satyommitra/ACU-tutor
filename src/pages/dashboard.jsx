import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import AiChatbot from '../../src/pages/AiChatbot';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [xpPercentage, setXpPercentage] = useState(0);
  const [chatbotLoading, setChatbotLoading] = useState(false);

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

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login first!');
        navigate('/login');
        return;
      }

      try {
        const res = await axios.get('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(res.data);
        setXpPercentage((res.data.xp % 1000) / 10); // Calculate XP percentage for progress bar
      } catch (err) {
        setError('Failed to load user data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    alert('Logged out successfully!');
    navigate('/login');
  };

  const handleDailyGoalStart = () => {
    navigate('/dashboard/practice');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white font-poppins">
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-red-500 font-poppins">
        <p>{error || 'Something went wrong.'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 to-black text-white font-poppins overflow-hidden">
      {/* ACU Tutor and Logout at the top */}
      <div className="flex justify-between items-center p-6 bg-black bg-opacity-60">
        <motion.h2
          className="text-4xl font-bold text-indigo-400"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          ACU Tutor
        </motion.h2>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 py-2 px-4 rounded-lg font-semibold"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        {/* Top Row: XP, Level, Daily Goal */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <motion.div
            className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-xl shadow-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-lg font-semibold mb-2">🎮 Your Level</h3>
            <p className="text-2xl font-bold">Level {userData.level}</p>
            <div className="mt-2 h-2 bg-white bg-opacity-30 rounded-full">
              <motion.div
                className="h-2 bg-white rounded-full"
                style={{ width: `${xpPercentage}%` }}
                animate={{ width: `${xpPercentage}%` }}
                transition={{ duration: 1 }}
              ></motion.div>
            </div>
            <p className="text-sm text-right mt-1">{userData.xp} XP</p>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-xl shadow-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-2">🎯 Daily Goal</h3>
            <p className="text-sm">Complete 1 quiz and review 2 weak topics.</p>
            <button
              onClick={handleDailyGoalStart}
              className="mt-4 bg-white text-black px-4 py-2 rounded-lg hover:scale-105 transition"
            >
              Start Now
            </button>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-blue-500 to-cyan-600 p-6 rounded-xl shadow-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold mb-2">🏅 Badges</h3>
            <p className="text-sm">🏆 {userData.badges?.join(', ') || 'None yet'}</p>
            <p className="text-xs mt-2">+{userData.badges?.length || 0} earned</p>
          </motion.div>
        </div>

        {/* AI Assistant Panel */}
        <motion.div
          className="bg-white bg-opacity-5 backdrop-blur-lg p-6 rounded-xl shadow-xl mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2 className="text-2xl font-bold text-indigo-300 mb-2">🤖 TutorBot</h2>
          <p className="text-sm text-slate-300 mb-4">
            Ask anything or get help on a topic you're stuck on.
          </p>

          {chatbotLoading ? (
            <div className="text-center text-white">Loading TutorBot...</div>
          ) : (
            <AiChatbot setLoading={setChatbotLoading} />
          )}
        </motion.div>

        {/* Topics Roadmap */}
        <motion.div
          className="grid md:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {topics.map((topic) => (
            <motion.div
              key={topic}
              className="bg-gradient-to-br from-slate-700 to-slate-800 p-5 rounded-xl shadow-md text-center hover:scale-105 transition"
              whileHover={{ scale: 1.05 }}
            >
              {/* Animated Topic Icon */}
              <motion.i
                className="fas fa-book text-xl mb-2"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 1 }}
              ></motion.i>
              <h3 className="text-lg font-bold mb-2">{topic}</h3>
              <p className="text-sm text-slate-300">📘 Learn and master with practice & AI.</p>
              <button
                onClick={() => navigate(`/dashboard/practice?topic=${encodeURIComponent(topic)}`)}
                className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg"
              >
                Go to {topic}
              </button>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;













  