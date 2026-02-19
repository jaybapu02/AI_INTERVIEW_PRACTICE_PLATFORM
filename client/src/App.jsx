import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AIInterview from "./pages/AiInterview";
import DigitalTwin from "./pages/DigitalTwin";
import ATSScorePage from "./pages/ATSScore";
import RoleRecommender from "./pages/RoleRecommender";
import Loader from "./components/Loader";
import InterviewPreview from "./components/InterviewPreview";
import AdminPanel from "./pages/AdminPanel";
import LiveInterviewPage from "./pages/LiveinterviewPage";

import "./styles/global.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // check login status on load
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    setLoading(false);
  }, []);

  if (loading) return <Loader text="Loading your experience..." />;

  const ProtectedRoute = ({ element }) => isLoggedIn ? element : <Navigate to="/login" />;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/interview-preview" element={<InterviewPreview />} />
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />} />
        <Route path="/ai-interview" element={<ProtectedRoute element={<AIInterview />} />} />
        <Route path="/live-interview" element={<LiveInterviewPage />} />
        <Route path="/digital-twin" element={<ProtectedRoute element={<DigitalTwin />} />} />
        <Route path="/role-recommender" element={<ProtectedRoute element={<RoleRecommender />} />} />
        <Route path="/ats-score" element={<ProtectedRoute element={<ATSScorePage />} />} />
        <Route path="/admin" element={<ProtectedRoute element={<AdminPanel />} />} />
      </Routes>
    </BrowserRouter>
  );
}
  
export default App;
