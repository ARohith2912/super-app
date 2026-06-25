import React from "react";
import "./MovieCard.css";

const PLACEHOLDER = "https://via.placeholder.com/300x450/1a1a1a/666?text=No+Poster";

const MovieCard = ({ movie, onSelect }) => {
  const poster = movie.Poster && movie.Poster !== "N/A" ? movie.Poster : PLACEHOLDER;

  return (
    <div className="movie-card" onClick={() => onSelect(movie.imdbID)}>
      <div className="movie-card-img-wrap">
        <img
          src={poster}
          alt={movie.Title}
          className="movie-card-img"
          loading="lazy"
          onError={(e) => { e.target.src = PLACEHOLDER; }}
        />
        <div className="movie-card-hover-overlay">
          <span className="movie-card-view">View Details</span>
        </div>
      </div>
      <div className="movie-card-info">
        <p className="movie-card-title">{movie.Title}</p>
        <p className="movie-card-year">{movie.Year}</p>
      </div>
    </div>
  );
};

export default MovieCard;
