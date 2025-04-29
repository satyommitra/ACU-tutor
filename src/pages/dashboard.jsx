// src/pages/Dashboard.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Please login first!');
      navigate('/login');
    } else {
      // You can later fetch user-specific data here using the token
      setUserData({ name: 'User', email: 'user@example.com' }); // Temporary static
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    alert('Logged out successfully!');
    navigate('/login');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded shadow-md w-96 text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome to ACU Tutor Dashboard</h1>
        {userData ? (
          <>
            <p className="mb-2">Name: {userData.name}</p>
            <p className="mb-4">Email: {userData.email}</p>

            <button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded font-semibold"
            >
              Logout
            </button>
          </>
        ) : (
          <p>Loading your info...</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

  