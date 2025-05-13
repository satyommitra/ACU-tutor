// src/App.jsx

import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Hero from "./components/Hero/Hero";
import Services from "./components/Services/Services";
import Banner from "./components/Banner/Banner";
import Subscribe from "./components/Subscribe/Subscribe";
import Banner2 from "./components/Banner/Banner2";
import Footer from "./components/Footer/Footer";
import DashboardAI from './pages/DashboardAI';
import DashboardProgress from './pages/DashboardProgress';
import Login from "/Users/satyommitra/Downloads/ACU-tutor-main 2/src/pages/login.jsx";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AiPage from './pages/AiPage';
import Progress from './pages/Progress';
import Practice from './pages/Practice';
import Quiz from './pages/Quiz';
import AiChatbot from './pages/AiChatbot';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Landing Page (Home) */}
        <Route 
          path="/" 
          element={
            <main className="overflow-x-hidden bg-white text-dark">
              <Hero />
              <Services />
              <Banner />
              <Subscribe />
              <Banner2 />
              <Footer />
            </main>
          } 
        />

        {/* Authentication Pages */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Dashboard and Protected Pages */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/ai" element={<DashboardAI />} />
        <Route path="/dashboard/progress" element={<DashboardProgress />} />
        <Route path="/dashboard/ai/chatbot" element={<AiChatbot />} />
        <Route path="/dashboard/ai/quiz" element={<Quiz />} />
        <Route path="/practice" element={<Practice />} />
        
        {/* Additional AI and Progress Pages */}
        <Route path="/ai" element={<AiPage />} />
        <Route path="/progress" element={<Progress />} />
      </Routes>
    </Router>
  );
};

export default App;




