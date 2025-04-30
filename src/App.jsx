// src/App.jsx

import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Hero from "./components/Hero/Hero";
import Services from "./components/Services/Services";
import Banner from "./components/Banner/Banner";
import Subscribe from "./components/Subscribe/Subscribe";
import Banner2 from "./components/Banner/Banner2";
import Footer from "./components/Footer/Footer";

import Login from "/Users/satyommitra/Downloads/Project-main/src/pages/login.jsx";
import Signup from "./pages/Signup";
import Dashboard from "/Users/satyommitra/Downloads/Project-main/src/pages/dashboard.jsx";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Landing Page (Home) */}
        <Route 
          path="" 
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

        {/* Protected or User Pages */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;

