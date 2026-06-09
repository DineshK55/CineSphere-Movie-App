// TMDB API Service client for CineSphere
// Supports both TMDB API requests and a premium Offline Demo Mode (Mock Data)

const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

// High-quality mock movies with Unsplash imagery for Offline Demo Mode
const MOCK_MOVIES = [
  {
    id: "mock-1",
    title: "Interstellar Horizon",
    overview: "A team of explorers travel beyond this galaxy to discover whether mankind has a future among the stars, facing time dilation and quantum anomalies.",
    poster_path: null,
    mock_image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop",
    vote_average: 8.7,
    release_date: "2024-11-07",
    genre_ids: [878, 18, 12]
  },
  {
    id: "mock-2",
    title: "The Neon Syndicate",
    overview: "In a rain-drenched cyberpunk metropolis, a rogue hacker teams up with a corporate defector to shut down an omnipresent AI system controlling the city.",
    poster_path: null,
    mock_image: "https://images.unsplash.com/photo-1515621061946-eff1c2a352bd?q=80&w=600&auto=format&fit=crop",
    vote_average: 7.9,
    release_date: "2025-03-14",
    genre_ids: [878, 28, 53]
  },
  {
    id: "mock-3",
    title: "Chronicles of Whispering Woods",
    overview: "An ancient forest holds the key to saving a dying kingdom, but a young herbalist must brave forbidden magic and mythical beasts to retrieve it.",
    poster_path: null,
    mock_image: "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=600&auto=format&fit=crop",
    vote_average: 8.2,
    release_date: "2023-08-22",
    genre_ids: [14, 12, 10751]
  },
  {
    id: "mock-4",
    title: "Shadows in the Deep",
    overview: "A deep-sea research station makes contact with a prehistoric intelligence residing at the bottom of the Mariana Trench, leading to a claustrophobic fight for survival.",
    poster_path: null,
    mock_image: "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?q=80&w=600&auto=format&fit=crop",
    vote_average: 6.8,
    release_date: "2024-06-30",
    genre_ids: [27, 9648, 53]
  },
  {
    id: "mock-5",
    title: "Velocity Rush",
    overview: "A professional street racer turned heist driver is forced into one final high-octane job across the mountain passes of Switzerland to clear his brother's debt.",
    poster_path: null,
    mock_image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=600&auto=format&fit=crop",
    vote_average: 7.4,
    release_date: "2025-01-19",
    genre_ids: [28, 53, 80]
  },
  {
    id: "mock-6",
    title: "Whispers of the Past",
    overview: "A renowned archivist uncovers a series of audio cylinders from the 1890s that contain voice recordings predicting major global events of the 21st century.",
    poster_path: null,
    mock_image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=600&auto=format&fit=crop",
    vote_average: 7.5,
    release_date: "2024-04-05",
    genre_ids: [9648, 18, 53]
  },
  {
    id: "mock-7",
    title: "Aura's Awakening",
    overview: "When humanity starts developing psychic abilities, society divides into those who fear the new power and those who seek to accelerate the evolutionary leap.",
    poster_path: null,
    mock_image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=600&auto=format&fit=crop",
    vote_average: 8.1,
    release_date: "2025-05-12",
    genre_ids: [878, 18]
  },
  {
    id: "mock-8",
    title: "The Silent Summit",
    overview: "Two estranged climbers attempt to conquer the world's most treacherous peak during a severe winter storm, facing psychological demons and freezing temperatures.",
    poster_path: null,
    mock_image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600&auto=format&fit=crop",
    vote_average: 7.1,
    release_date: "2023-12-15",
    genre_ids: [18, 12, 53]
  }
];

export const tmdb = {
  // Get active API key
  getApiKey: () => {
    // 1. Check local storage
    const storedKey = localStorage.getItem("cine_tmdb_api_key");
    if (storedKey) return storedKey;

    // 2. Check environment variable
    const envKey = import.meta.env.VITE_TMDB_API_KEY;
    if (envKey && envKey !== "YOUR_TMDB_API_KEY") return envKey;

    return null;
  },

  // Check if offline/demo mode is active
  isDemoMode: () => {
    return localStorage.getItem("cine_demo_mode") === "true" || !tmdb.getApiKey();
  },

  // Set demo mode active state
  setDemoMode: (active) => {
    localStorage.setItem("cine_demo_mode", active ? "true" : "false");
  },

  // Save API key
  saveApiKey: (key) => {
    if (key) {
      localStorage.setItem("cine_tmdb_api_key", key.trim());
      localStorage.setItem("cine_demo_mode", "false"); // Disable demo mode once key is saved
    } else {
      localStorage.removeItem("cine_tmdb_api_key");
    }
  },

  // Test validity of API key
  verifyApiKey: async (key) => {
    if (!key) return false;
    try {
      const response = await fetch(`${BASE_URL}/configuration?api_key=${key.trim()}`);
      return response.ok;
    } catch (e) {
      console.error("Error verifying API Key:", e);
      return false;
    }
  },

  // Fetch popular movies
  fetchPopular: async (page = 1) => {
    const key = tmdb.getApiKey();
    const isDemo = tmdb.isDemoMode();

    if (isDemo || !key) {
      // Return mock data paginated
      return new Promise((resolve) => {
        setTimeout(() => {
          const limit = 4; // 4 per page in mock mode to test pagination easily
          const offset = (page - 1) * limit;
          const paginated = MOCK_MOVIES.slice(offset, offset + limit);
          
          resolve({
            results: paginated,
            page: page,
            total_pages: Math.ceil(MOCK_MOVIES.length / limit),
            total_results: MOCK_MOVIES.length,
            isMock: true
          });
        }, 600); // Simulate network latency
      });
    }

    // Call TMDB API
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${key}&page=${page}&language=en-US`);
    if (!response.ok) {
      throw new Error(`Failed to fetch popular movies: ${response.statusText}`);
    }
    return response.json();
  },

  // Search movies
  search: async (query, page = 1) => {
    if (!query || query.trim() === "") {
      return tmdb.fetchPopular(page);
    }

    const key = tmdb.getApiKey();
    const isDemo = tmdb.isDemoMode();

    if (isDemo || !key) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const filtered = MOCK_MOVIES.filter(movie => 
            movie.title.toLowerCase().includes(query.toLowerCase()) ||
            movie.overview.toLowerCase().includes(query.toLowerCase())
          );
          const limit = 4;
          const offset = (page - 1) * limit;
          const paginated = filtered.slice(offset, offset + limit);

          resolve({
            results: paginated,
            page: page,
            total_pages: Math.ceil(filtered.length / limit),
            total_results: filtered.length,
            isMock: true
          });
        }, 500);
      });
    }

    // Call TMDB API
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${key}&query=${encodeURIComponent(query)}&page=${page}&language=en-US`
    );
    if (!response.ok) {
      throw new Error(`Failed to search movies: ${response.statusText}`);
    }
    return response.json();
  },

  // Get image URL
  getImageUrl: (path, size = "w500", mockImage = null) => {
    if (mockImage) return mockImage;
    if (!path) {
      // High-quality placeholder
      return "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=400&auto=format&fit=crop";
    }
    return `${IMAGE_BASE_URL}/${size}${path}`;
  }
};
