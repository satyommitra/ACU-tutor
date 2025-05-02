import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first!');
      navigate('/login');
    } else {
      setUserData({ name: 'User', email: 'user@example.com' }); // Placeholder
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    alert('Logged out successfully!');
    navigate('/login');
  };

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-light font-poppins text-dark">
        <p>Loading your info...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex font-poppins text-dark">
      {/* Sidebar */}
      <aside className="w-64 bg-secondary text-white p-6 space-y-6 shadow-md">
        <h2 className="text-2xl font-bold mb-6">ACU Tutor</h2>
        <nav className="space-y-4 text-lg">
          <Link to="/dashboard" className="block hover:text-primary">🏠 Home</Link>
          <Link to="/dashboard/progress" className="block hover:text-primary">📈 Progress</Link>
          <Link to="/dashboard/practice" className="block hover:text-primary">📝 Practice Tests</Link>
          <Link to="/dashboard/ai" className="block hover:text-primary">🤖 Ask AI</Link>
        </nav>
        <button
          onClick={handleLogout}
          className="mt-10 bg-red-500 hover:bg-red-600 w-full py-2 rounded-lg font-semibold"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 bg-light">
        <h1 className="text-3xl font-bold mb-2">Welcome, {userData.name}! 🎓</h1>
        <p className="text-dark2 mb-6">Email: {userData.email}</p>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition duration-300">
            <h2 className="text-xl font-semibold text-primary mb-2">📊 Your Progress</h2>
            <p className="text-dark2">Track mastered topics and what to review.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition duration-300">
            <h2 className="text-xl font-semibold text-primary mb-2">📝 Practice Tests</h2>
            <p className="text-dark2">Take personalized quizzes to sharpen skills.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition duration-300">
            <h2 className="text-xl font-semibold text-primary mb-2">🤖 Ask the AI</h2>
            <p className="text-dark2">Instant explanations from your AI tutor.</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;



  