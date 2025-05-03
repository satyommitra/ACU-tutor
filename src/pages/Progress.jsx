import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const Progress = () => {
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProgress = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('/api/auth/progress', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProgressData(res.data);
      } catch (err) {
        setError('Failed to load progress data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white font-poppins">
        <p>Loading your progress...</p>
      </div>
    );
  }

  if (error || !progressData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-red-500 font-poppins">
        <p>{error || 'Error loading progress data'}</p>
      </div>
    );
  }

  // Mock XP trend (you can replace with real data)
  const xpTrend = [
    { day: 'Mon', xp: 120 },
    { day: 'Tue', xp: 150 },
    { day: 'Wed', xp: 200 },
    { day: 'Thu', xp: 180 },
    { day: 'Fri', xp: 220 },
    { day: 'Sat', xp: 250 },
    { day: 'Sun', xp: progressData.xp % 300 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black text-white p-10 font-poppins">
      <motion.h1
        className="text-4xl font-bold mb-8 text-center text-indigo-400"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        📈 Your Progress Overview
      </motion.h1>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-12">
        <motion.div
          className="bg-slate-800 p-6 rounded-xl shadow-lg text-center"
          whileHover={{ scale: 1.05 }}
        >
          <h3 className="text-lg font-semibold mb-2">🎮 Level</h3>
          <p className="text-2xl font-bold text-indigo-300">{progressData.level}</p>
        </motion.div>

        <motion.div
          className="bg-slate-800 p-6 rounded-xl shadow-lg text-center"
          whileHover={{ scale: 1.05 }}
        >
          <h3 className="text-lg font-semibold mb-2">⭐ XP</h3>
          <p className="text-2xl font-bold text-emerald-300">{progressData.xp}</p>
        </motion.div>

        <motion.div
          className="bg-slate-800 p-6 rounded-xl shadow-lg text-center"
          whileHover={{ scale: 1.05 }}
        >
          <h3 className="text-lg font-semibold mb-2">🔥 Streak</h3>
          <p className="text-2xl font-bold text-orange-400">{progressData.streak || 0} days</p>
        </motion.div>

        <motion.div
          className="bg-slate-800 p-6 rounded-xl shadow-lg text-center"
          whileHover={{ scale: 1.05 }}
        >
          <h3 className="text-lg font-semibold mb-2">🏅 Badges</h3>
          <p className="text-xl text-purple-300">
            {progressData.badges?.length || 0} earned
          </p>
        </motion.div>
      </div>

      {/* XP Chart */}
      <motion.div
        className="bg-slate-800 p-6 rounded-xl shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h2 className="text-xl font-semibold mb-4 text-center text-cyan-300">📊 Weekly XP Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={xpTrend}>
            <Line type="monotone" dataKey="xp" stroke="#38bdf8" strokeWidth={3} />
            <CartesianGrid stroke="#334155" strokeDasharray="5 5" />
            <XAxis dataKey="day" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
      {/* Weak Topics Section */}
<motion.div
  className="mt-12 bg-slate-800 p-6 rounded-xl shadow-lg"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.1 }}
>
  <h2 className="text-xl font-semibold mb-4 text-red-400">❗ Weak Topics</h2>
  {progressData.weakTopics?.length > 0 ? (
    <ul className="list-disc pl-6 text-slate-300">
      {progressData.weakTopics.map((topic, idx) => (
        <li key={idx} className="mb-2">{topic}</li>
      ))}
    </ul>
  ) : (
    <p className="text-slate-400 italic">No weak topics identified. Great job!</p>
  )}
</motion.div>

{/* Recent Activity Section */}
<motion.div
  className="mt-8 bg-slate-800 p-6 rounded-xl shadow-lg"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.2 }}
>
  <h2 className="text-xl font-semibold mb-4 text-emerald-400">🕒 Recent Activity</h2>
  {progressData.activityLog?.length > 0 ? (
    <ul className="space-y-3 text-slate-300">
      {progressData.activityLog.slice(0, 5).map((entry, idx) => (
        <li key={idx} className="bg-slate-700 p-3 rounded-lg">
          <p className="text-sm">{entry.message}</p>
          <p className="text-xs text-slate-400">{new Date(entry.date).toLocaleString()}</p>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-slate-400 italic">No recent activity.</p>
  )}
</motion.div>

    </div>
  );
};

export default Progress;
