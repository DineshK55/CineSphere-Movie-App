import React from "react";
import MovieCard from "./MovieCard";

export default function MovieGrid({ 
  movies, 
  favorites = [], 
  onToggleFavorite, 
  loading, 
  emptyState 
}) {
  // Generate 8 skeleton cards with shimmer overlays for the loading state
  const renderSkeletons = () => {
    return Array.from({ length: 8 }).map((_, index) => (
      <div key={`skeleton-${index}`} className="movie-card skeleton-card">
        <div className="card-poster-container skeleton-poster shimmer"></div>
        <div className="card-info">
          <div className="skeleton-title shimmer"></div>
          <div className="skeleton-year shimmer"></div>
        </div>
      </div>
    ));
  };

  if (loading) {
    return <div className="movies-grid">{renderSkeletons()}</div>;
  }

  if (!movies || movies.length === 0) {
    return emptyState || (
      <div className="movies-empty-state">
        <p className="empty-text">No movies available.</p>
      </div>
    );
  }

  return (
    <div className="movies-grid">
      {movies.map((movie) => {
        // Ensure id is compared as string/number safely
        const isFav = favorites.some((fav) => String(fav.id) === String(movie.id));
        return (
          <MovieCard
            key={movie.id}
            movie={movie}
            isFavorite={isFav}
            onToggleFavorite={onToggleFavorite}
          />
        );
      })}
    </div>
  );
}
