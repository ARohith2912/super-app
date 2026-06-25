import React, { useState, useEffect } from "react";
import { fetchMovieDetails } from "../services/apiServices";
import "./MovieModal.css";

const MovieModal = ({ imdbID, onClose }) => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await fetchMovieDetails(imdbID);
      setMovie(data);
      setLoading(false);
    })();
  }, [imdbID]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const poster =
    movie?.Poster && movie.Poster !== "N/A"
      ? movie.Poster
      : "https://via.placeholder.com/300x450/1a1a1a/666?text=No+Poster";

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        {loading && (
          <div className="modal-loading">
            <div className="modal-spinner" />
            <p>Loading details…</p>
          </div>
        )}

        {!loading && !movie && (
          <div className="modal-error">
            <p>⚠️ Could not load movie details. Check your OMDB API key.</p>
          </div>
        )}

        {!loading && movie && (
          <div className="modal-content">
            <div className="modal-poster-col">
              <img src={poster} alt={movie.Title} className="modal-poster" />
              <div className="modal-rating-badge">
                ⭐ {movie.imdbRating !== "N/A" ? movie.imdbRating : "—"}
              </div>
            </div>

            <div className="modal-info-col">
              <h2 className="modal-title">{movie.Title}</h2>
              <p className="modal-meta">
                {movie.Year} · {movie.Runtime} · {movie.Rated}
              </p>

              <div className="modal-tags">
                {movie.Genre?.split(", ").map((g) => (
                  <span key={g} className="modal-tag">{g}</span>
                ))}
              </div>

              <div className="modal-section">
                <h4>Plot</h4>
                <p>{movie.Plot}</p>
              </div>

              <div className="modal-section">
                <h4>Cast</h4>
                <p>{movie.Actors}</p>
              </div>

              <div className="modal-section">
                <h4>Director</h4>
                <p>{movie.Director}</p>
              </div>

              {movie.Awards && movie.Awards !== "N/A" && (
                <div className="modal-section">
                  <h4>Awards</h4>
                  <p>{movie.Awards}</p>
                </div>
              )}

              <div className="modal-stats">
                <div className="modal-stat">
                  <span className="modal-stat-label">Box Office</span>
                  <span className="modal-stat-val">{movie.BoxOffice || "N/A"}</span>
                </div>
                <div className="modal-stat">
                  <span className="modal-stat-label">Language</span>
                  <span className="modal-stat-val">{movie.Language}</span>
                </div>
                <div className="modal-stat">
                  <span className="modal-stat-label">Country</span>
                  <span className="modal-stat-val">{movie.Country}</span>
                </div>
              </div>

              {movie.imdbID && (
                <a
                  href={`https://www.imdb.com/title/${movie.imdbID}`}
                  target="_blank"
                  rel="noreferrer"
                  className="modal-imdb-link"
                >
                  View on IMDb →
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieModal;
