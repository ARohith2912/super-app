import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import { searchMovies, GENRE_QUERY_MAP } from "../services/apiServices";
import MovieCard from "../components/MovieCard";
import MovieModal from "../components/MovieModal";
import "./Movies.css";

const Movies = () => {
  const navigate = useNavigate();
  const { categories, user, resetStore } = useStore();
  const [moviesByGenre, setMoviesByGenre] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    if (!categories.length) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      const results = {};
      await Promise.all(
        categories.map(async (genre) => {
          const query = GENRE_QUERY_MAP[genre] || genre.toLowerCase();
          const movies = await searchMovies(query);
          if (!cancelled) results[genre] = movies.slice(0, 6);
        })
      );
      if (!cancelled) {
        setMoviesByGenre(results);
        setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [categories]);

  const handleLogout = () => {
    resetStore();
    navigate("/");
  };

  return (
    <div className="movies-page">
      {/* Header */}
      <header className="movies-header">
        <span className="movies-brand">Super app</span>
        <nav className="movies-nav">
          <button className="movies-nav-btn" onClick={() => navigate("/dashboard")}>Dashboard</button>
          <button className="movies-nav-btn active" onClick={() => navigate("/movies")}>Movies</button>
          <button className="movies-nav-btn logout" onClick={handleLogout}>Logout</button>
        </nav>
      </header>

      <div className="movies-content">
        {/* User avatar */}
        <div className="movies-top-bar">
          <div>
            <p className="movies-greeting">Entertainment according to your choice</p>
          </div>
          <div className="movies-user-avatar">
            {user.name?.[0]?.toUpperCase()}
          </div>
        </div>

        {loading && (
          <div className="movies-loading">
            <div className="movies-spinner" />
            <p>Loading movies…</p>
          </div>
        )}

        {!loading && Object.entries(moviesByGenre).map(([genre, movies]) => (
          <div key={genre} className="movies-genre-section">
            <h2 className="movies-genre-title">{genre}</h2>
            {movies.length === 0 ? (
              <p className="movies-empty">No results found for this genre.</p>
            ) : (
              <div className="movies-row">
                {movies.map((movie) => (
                  <MovieCard
                    key={movie.imdbID}
                    movie={movie}
                    onSelect={setSelectedMovie}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedMovie && (
        <MovieModal
          imdbID={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
};

export default Movies;
