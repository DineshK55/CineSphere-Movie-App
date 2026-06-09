import React from "react";
import { HeartOff, Film } from "lucide-react";
import MovieGrid from "../components/MovieGrid";

export default function Favorites({ favorites, onToggleFavorite, setActiveTab }) {
  return (
    <div className="favorites-page">
      <div className="section-header">
        <h2 className="section-title">Your Favorites</h2>
        <span className="favorites-count-badge">
          {favorites.length} {favorites.length === 1 ? "Movie" : "Movies"}
        </span>
      </div>

      <MovieGrid
        movies={favorites}
        favorites={favorites}
        onToggleFavorite={onToggleFavorite}
        loading={false}
        emptyState={
          <div className="favorites-empty-state card-glassmorphism">
            <HeartOff size={48} className="empty-icon" />
            <h3 className="empty-title">No Favorites Yet</h3>
            <p className="empty-subtitle">
              Explore the latest movies and tap the heart icon on any card to save your favorites here.
            </p>
            <button 
              className="btn btn-primary" 
              onClick={() => setActiveTab("home")}
              aria-label="Browse popular movies"
            >
              <Film size={16} />
              <span>Browse Movies</span>
            </button>
          </div>
        }
      />
    </div>
  );
}
