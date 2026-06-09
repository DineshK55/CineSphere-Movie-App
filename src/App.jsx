import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import SettingsModal from "./components/SettingsModal";
import { tmdb } from "./services/tmdb";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [favorites, setFavorites] = useState([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDemo, setIsDemo] = useState(tmdb.isDemoMode());

  // Load theme preference from localStorage or default to dark (isLightTheme = false)
  const [isLightTheme, setIsLightTheme] = useState(() => {
    const saved = localStorage.getItem("cine_theme");
    return saved === "light";
  });

  // Apply theme class to document body
  useEffect(() => {
    if (isLightTheme) {
      document.body.classList.add("light-theme");
    } else {
      document.body.classList.remove("light-theme");
    }
    localStorage.setItem("cine_theme", isLightTheme ? "light" : "dark");
  }, [isLightTheme]);

  // Load favorites from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem("cine_favorites");
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse favorites:", e);
      }
    }
  }, []);

  const handleToggleFavorite = (movie) => {
    let updated;
    const exists = favorites.some((fav) => String(fav.id) === String(movie.id));

    if (exists) {
      updated = favorites.filter((fav) => String(fav.id) !== String(movie.id));
    } else {
      updated = [...favorites, movie];
    }

    setFavorites(updated);
    localStorage.setItem("cine_favorites", JSON.stringify(updated));
  };

  const toggleTheme = () => {
    setIsLightTheme((prev) => !prev);
  };

  const handleKeySaved = () => {
    setIsDemo(tmdb.isDemoMode());
  };

  return (
    <div className="app-wrapper">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isLightTheme={isLightTheme}
        toggleTheme={toggleTheme}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isDemo={isDemo}
      />

      <main className="app-container">
        {activeTab === "home" ? (
          <Home
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        ) : (
          <Favorites
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            setActiveTab={setActiveTab}
          />
        )}
      </main>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onKeySaved={handleKeySaved}
      />
    </div>
  );
}
