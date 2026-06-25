import React from "react";
import "./CategoryCard.css";

const CategoryCard = ({ genre, isSelected, onToggle }) => {
  return (
    <div
      className={`cat-card ${isSelected ? "selected" : ""}`}
      onClick={() => onToggle(genre.id)}
    >
      <img src={genre.img} alt={genre.label} className="cat-card-img" loading="lazy" />
      <div className="cat-card-overlay">
        <span className="cat-card-label">{genre.label}</span>
      </div>
      {isSelected && (
        <div className="cat-card-check">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#39ff14" />
            <path d="M7 12.5l3.5 3.5 6.5-7" stroke="#000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default CategoryCard;
