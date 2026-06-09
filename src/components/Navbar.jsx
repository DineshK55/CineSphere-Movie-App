import React from "react";
import { Film, Heart, Home, Settings, Sun, Moon } from "lucide-react";

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  isLightTheme, 
  toggleTheme, 
  onOpenSettings, 
  isDemo 
}) {
  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand Logo */}
        <div className="navbar-logo" onClick={() => setActiveTab("home")}>
          <Film className="logo-icon" />
          <span className="logo-text">CineSphere</span>
        </div>

        {/* Navigation & Actions */}
        <div className="navbar-actions">
          {/* Navigation Links */}
          <nav className="navbar-nav">
            <button 
              className={`nav-link ${activeTab === "home" ? "active" : ""}`}
              onClick={() => setActiveTab("home")}
              aria-label="Navigate to Home"
            >
              <Home size={18} />
              <span>Home</span>
            </button>
            <button 
              className={`nav-link ${activeTab === "favorites" ? "active" : ""}`}
              onClick={() => setActiveTab("favorites")}
              aria-label="Navigate to Favorites"
            >
              <Heart size={18} />
              <span>Favorites</span>
            </button>
          </nav>

          {/* Divider */}
          <span className="actions-divider">|</span>

          {/* Action Buttons */}
          <div className="action-buttons">
            {isDemo && (
              <span className="demo-pill" onClick={onOpenSettings} title="Click to configure TMDB API Key">
                Demo Mode
              </span>
            )}
            
            <button 
              className="action-btn" 
              onClick={toggleTheme} 
              title={isLightTheme ? "Switch to Dark Mode" : "Switch to Light Mode"}
              aria-label="Toggle theme color"
            >
              {isLightTheme ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            
            <button 
              className="action-btn" 
              onClick={onOpenSettings} 
              title="Configure TMDB API Key"
              aria-label="Open settings"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
