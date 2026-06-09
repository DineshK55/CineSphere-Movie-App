import React, { useState, useEffect, useCallback } from "react";
import { Search, ChevronLeft, ChevronRight, AlertTriangle, X } from "lucide-react";
import { tmdb } from "../services/tmdb";
import MovieGrid from "../components/MovieGrid";

export default function Home({ favorites, onToggleFavorite, onOpenSettings }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Flag to check if demo mode is active
  const isDemo = tmdb.isDemoMode();

  const loadMovies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (activeQuery) {
        data = await tmdb.search(activeQuery, page);
      } else {
        data = await tmdb.fetchPopular(page);
      }
      setMovies(data.results || []);
      setTotalPages(data.total_pages || 1);
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching movies. Please verify your internet connection and TMDB API Key.");
    } finally {
      setLoading(false);
    }
  }, [activeQuery, page]);

  useEffect(() => {
    loadMovies();
  }, [loadMovies]);

  // Reset page when query changes
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setActiveQuery(searchQuery);
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setActiveQuery("");
    setPage(1);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Your Gateway to Cinema</h1>
          <p className="hero-subtitle">
            Explore popular releases, search your favorite movies, and create your perfect watchlist.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="search-form">
            <div className="search-input-wrapper">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                aria-label="Search movies"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={handleClearSearch}
                  title="Clear search"
                  aria-label="Clear search input"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            <button type="submit" className="search-submit-btn" aria-label="Submit search">
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Demo Warning Banner */}
      {isDemo && (
        <div className="demo-warning-banner">
          <div className="demo-warning-content">
            <AlertTriangle className="warning-icon" size={20} />
            <div>
              <strong>Viewing Demo Mode (Offline Data)</strong>
              <p>You are viewing cached sample movies. Setup your TMDB API Key to unlock real-time movie discoveries.</p>
            </div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={onOpenSettings} aria-label="Open TMDB settings">
            Connect TMDB Key
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <section className="movie-results-section">
        <div className="section-header">
          <h2 className="section-title">
            {activeQuery ? `Search Results for "${activeQuery}"` : "Popular Movies"}
          </h2>
          {activeQuery && (
            <button className="back-to-popular-btn" onClick={handleClearSearch} aria-label="Back to popular movies">
              Back to Popular
            </button>
          )}
        </div>

        {error ? (
          <div className="error-state">
            <AlertTriangle size={40} className="error-icon" />
            <p className="error-text">{error}</p>
            <button className="btn btn-primary" onClick={loadMovies} aria-label="Reload movie list">
              Try Again
            </button>
          </div>
        ) : (
          <>
            <MovieGrid
              movies={movies}
              favorites={favorites}
              onToggleFavorite={onToggleFavorite}
              loading={loading}
              emptyState={
                <div className="movies-empty-state">
                  <p className="empty-text">No movies found matching "{activeQuery}".</p>
                  <button className="btn btn-secondary" onClick={handleClearSearch} aria-label="Clear search and show popular movies">
                    Clear Search
                  </button>
                </div>
              }
            />

            {/* Pagination Controls */}
            {!loading && movies.length > 0 && totalPages > 1 && (
              <div className="pagination-container">
                <button
                  className="pagination-btn"
                  onClick={handlePrevPage}
                  disabled={page === 1}
                  aria-label="Previous page"
                >
                  <ChevronLeft size={18} />
                  <span>Previous</span>
                </button>

                <div className="pagination-info">
                  Page <span className="current-page">{page}</span> of{" "}
                  <span className="total-pages">{totalPages}</span>
                </div>

                <button
                  className="pagination-btn"
                  onClick={handleNextPage}
                  disabled={page === totalPages}
                  aria-label="Next page"
                >
                  <span>Next</span>
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
