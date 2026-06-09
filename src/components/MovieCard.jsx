import React from "react";
import { Heart, Star } from "lucide-react";
import { tmdb } from "../services/tmdb";

export default function MovieCard({ movie, isFavorite, onToggleFavorite }) {
  // Format release year
  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "N/A";

  // Format rating (keep one decimal place)
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "0.0";

  // Choose rating badge class based on score
  const getRatingClass = (score) => {
    const num = parseFloat(score);
    if (num >= 8.0) return "rating-high";
    if (num >= 6.0) return "rating-mid";
    return "rating-low";
  };

  // Prevent click on favorite button from triggering other card events (like opening details if expanded)
  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onToggleFavorite(movie);
  };

  // Check if this is a mock movie or external path
  const posterUrl = tmdb.getImageUrl(movie.poster_path, "w500", movie.mock_image);

  return (
    <div className="movie-card">
      {/* Poster Image Container */}
      <div className="card-poster-container">
        <img 
          src={posterUrl} 
          alt={`${movie.title} poster`} 
          className="card-poster"
          loading="lazy"
        />
        
        {/* Heart Icon Button (Overlay) */}
        <button 
          className={`card-favorite-btn ${isFavorite ? "is-favorite" : ""}`}
          onClick={handleFavoriteClick}
          title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          aria-label={isFavorite ? "Remove movie from favorites" : "Add movie to favorites"}
        >
          <Heart size={20} fill={isFavorite ? "currentColor" : "transparent"} />
        </button>

        {/* Floating Rating Badge */}
        <div className={`card-rating ${getRatingClass(rating)}`}>
          <Star size={12} fill="currentColor" />
          <span>{rating}</span>
        </div>

        {/* Hover Details Overlay */}
        <div className="card-hover-overlay">
          <div className="hover-overlay-content">
            <h4 className="hover-title">{movie.title}</h4>
            <p className="hover-overview">{movie.overview || "No synopsis available."}</p>
            <div className="hover-release-date">
              Released: {movie.release_date || "Unknown"}
            </div>
          </div>
        </div>
      </div>

      {/* Info Block (Bottom) */}
      <div className="card-info">
        <h3 className="card-title" title={movie.title}>{movie.title}</h3>
        <span className="card-year">{releaseYear}</span>
      </div>
    </div>
  );
}
