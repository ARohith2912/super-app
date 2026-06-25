import React from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import UserProfileWidget from "../components/UserProfileWidget";
import WeatherWidget from "../components/WeatherWidget";
import NewsWidget from "../components/NewsWidget";
import TimerWidget from "../components/TimerWidget";
import NotesWidget from "../components/NotesWidget";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, categories, resetStore } = useStore();

  const handleLogout = () => {
    resetStore();
    navigate("/");
  };

  return (
    <div className="dash-page">
      {/* Top navbar */}
      <header className="dash-header">
        <span className="dash-brand">Super app</span>
        <nav className="dash-nav">
          <button className="dash-nav-btn active" onClick={() => navigate("/dashboard")}>Dashboard</button>
          <button className="dash-nav-btn" onClick={() => navigate("/movies")}>Movies</button>
          <button className="dash-nav-btn logout" onClick={handleLogout}>Logout</button>
        </nav>
      </header>

      {/* Grid layout */}
      <main className="dash-grid">
        {/* Row 1: Profile + News (takes up right side) */}
        <div className="dash-cell profile-cell">
          <UserProfileWidget user={user} categories={categories} />
        </div>

        <div className="dash-cell news-cell">
          <NewsWidget />
        </div>

        {/* Row 2: Weather + Timer + Notes */}
        <div className="dash-cell weather-cell">
          <WeatherWidget />
        </div>

        <div className="dash-cell timer-cell">
          <TimerWidget />
        </div>

        <div className="dash-cell notes-cell">
          <NotesWidget />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
