import axios from "axios";

// ─── API Keys ────────────────────────────────────────────────────────────────
// Replace these with your own keys or set them in a .env file
const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY || "YOUR_OPENWEATHER_KEY";
const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY || "YOUR_NEWS_API_KEY";
const MOVIE_API_KEY = import.meta.env.VITE_MOVIE_API_KEY || "YOUR_OMDB_KEY";

// ─── Axios Clients ────────────────────────────────────────────────────────────
const weatherClient = axios.create({
  baseURL: "https://api.openweathermap.org/data/2.5",
});

const newsClient = axios.create({
  baseURL: "https://newsapi.org/v2",
});

const movieClient = axios.create({
  baseURL: "https://www.omdbapi.com",
});

// ─── Weather ─────────────────────────────────────────────────────────────────
/**
 * Fetch weather by city name
 * Endpoint: GET /weather?q={city}&units=metric&appid={key}
 * Docs: https://openweathermap.org/current
 */
export const fetchWeatherByCity = async (city = "Hyderabad") => {
  try {
    const { data } = await weatherClient.get(
      `/weather?q=${encodeURIComponent(city)}&units=metric&appid=${WEATHER_API_KEY}`
    );
    return data;
  } catch (err) {
    console.error("Weather fetch error:", err?.response?.data || err.message);
    throw err;
  }
};

/**
 * Fetch weather by coordinates (geolocation)
 * Endpoint: GET /weather?lat={lat}&lon={lon}&units=metric&appid={key}
 */
export const fetchWeatherByCoords = async (lat, lon) => {
  try {
    const { data } = await weatherClient.get(
      `/weather?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`
    );
    return data;
  } catch (err) {
    console.error("Weather (coords) fetch error:", err?.response?.data || err.message);
    throw err;
  }
};

// ─── News ────────────────────────────────────────────────────────────────────
/**
 * Fetch top headlines
 * Endpoint: GET /top-headlines?country=us&apiKey={key}
 * Docs: https://newsapi.org/docs/endpoints/top-headlines
 *
 * NOTE: NewsAPI free tier blocks browser requests (CORS).
 * Use a CORS proxy or your own backend. For production, proxy via:
 *   https://cors-anywhere.herokuapp.com/https://newsapi.org/v2/...
 * or use World News API (worldnewsapi.com) which supports CORS.
 */
export const fetchTopHeadlines = async (category = "general") => {
  try {
    // Try direct NewsAPI first
    const { data } = await newsClient.get(
      `/top-headlines?country=us&category=${category}&pageSize=10&apiKey=${NEWS_API_KEY}`
    );
    return data.articles || [];
  } catch (err) {
    console.error("News fetch error:", err?.response?.data || err.message);
    // Return mock articles so UI doesn't break in demo/dev
    return getMockNews();
  }
};

const getMockNews = () => [
  {
    title: "Tech Giants Report Record Q2 Earnings Amid AI Boom",
    description: "Major technology companies have reported unprecedented earnings driven by artificial intelligence investments and cloud computing growth.",
    urlToImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400",
    source: { name: "Tech Daily" },
    publishedAt: new Date().toISOString(),
    url: "#",
  },
  {
    title: "Climate Summit Reaches Historic Agreement on Carbon Emissions",
    description: "World leaders convened in Geneva to finalize a landmark agreement aimed at reducing global carbon emissions by 45% before 2035.",
    urlToImage: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400",
    source: { name: "Global News" },
    publishedAt: new Date().toISOString(),
    url: "#",
  },
  {
    title: "Space Agency Announces Mars Mission for 2028",
    description: "A joint international space agency has confirmed plans for a crewed mission to Mars, set to launch in late 2028.",
    urlToImage: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400",
    source: { name: "Space Today" },
    publishedAt: new Date().toISOString(),
    url: "#",
  },
  {
    title: "New Study Reveals Benefits of Mediterranean Diet",
    description: "Researchers have found compelling evidence linking Mediterranean dietary patterns to improved longevity and reduced risk of chronic diseases.",
    urlToImage: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400",
    source: { name: "Health Wire" },
    publishedAt: new Date().toISOString(),
    url: "#",
  },
  {
    title: "Global Markets Rally as Inflation Shows Signs of Cooling",
    description: "Stock markets around the world surged following new data suggesting that inflation pressures may be easing globally.",
    urlToImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400",
    source: { name: "Market Watch" },
    publishedAt: new Date().toISOString(),
    url: "#",
  },
];

// ─── Movies ──────────────────────────────────────────────────────────────────
/**
 * Search movies by query string (OMDB)
 * Endpoint: GET /?s={query}&type=movie&apikey={key}
 * Docs: https://www.omdbapi.com/
 */
export const searchMovies = async (query) => {
  try {
    const { data } = await movieClient.get(
      `/?s=${encodeURIComponent(query)}&type=movie&apikey=${MOVIE_API_KEY}`
    );
    if (data.Response === "True") return data.Search || [];
    return [];
  } catch (err) {
    console.error("Movie search error:", err?.response?.data || err.message);
    return [];
  }
};

/**
 * Fetch full movie details by IMDB ID
 * Endpoint: GET /?i={imdbID}&plot=full&apikey={key}
 */
export const fetchMovieDetails = async (imdbID) => {
  try {
    const { data } = await movieClient.get(
      `/?i=${imdbID}&plot=full&apikey=${MOVIE_API_KEY}`
    );
    return data.Response === "True" ? data : null;
  } catch (err) {
    console.error("Movie detail error:", err?.response?.data || err.message);
    return null;
  }
};

// Genre → search term mapping for OMDB
export const GENRE_QUERY_MAP = {
  Action: "action",
  Comedy: "comedy",
  Drama: "drama",
  Music: "music",
  Sports: "sports",
  Thriller: "thriller",
  Fantasy: "fantasy",
  Romance: "romance",
  Horror: "horror",
  Western: "western",
  Fiction: "science fiction",
};
