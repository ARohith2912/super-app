import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import CategoryCard from "../components/CategoryCard";
import "./Categories.css";

const GENRES = [
  { id: "Action",   label: "Action",   img: "Group 12.png" },
  { id: "Drama",    label: "Drama",    img: "Group 13.png" },
  { id: "Romance",  label: "Romance",  img: "Group 14.png" },
  { id: "Thriller", label: "Thriller", img: "Group 11.png" },
  { id: "Western",  label: "Western",  img: "Group 10.png" },
  { id: "Horror",   label: "Horror",   img: "Group 9.png" },
  { id: "Fantasy",  label: "Fantasy",  img: "Group 6.png" },
  { id: "Music",    label: "Music",    img: "Group 7.png" },
  { id: "Fiction",  label: "Fiction",  img: "Group 8.png"},
];

const MIN_SELECTIONS = 3;

const Categories = () => {
  const navigate = useNavigate();
  const { user, setCategories } = useStore();
  const [selected, setSelected] = useState([]);

  const toggleCategory = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    if (selected.length >= MIN_SELECTIONS) {
      setCategories(selected);
      navigate("/dashboard");
    }
  };

  const canContinue = selected.length >= MIN_SELECTIONS;

  return (
    <div className="cat-page">
      {/* Sidebar */}
      <div className="cat-sidebar">
        <div className="cat-brand">Super app</div>
        <h2 className="cat-heading">
          Choose your entertainment category
        </h2>
        <div className="cat-selected-chips">
          {selected.map((id) => (
            <span key={id} className="cat-chip">
              {id}
            </span>
          ))}
        </div>
        {selected.length < MIN_SELECTIONS && (
          <p className="cat-warning">
            ⚠ Minimum {MIN_SELECTIONS} categories required
          </p>
        )}
      </div>

      {/* Grid */}
      <div className="cat-main">
        <div className="cat-grid">
          {GENRES.map((genre) => (
            <CategoryCard
              key={genre.id}
              genre={genre}
              isSelected={selected.includes(genre.id)}
              onToggle={toggleCategory}
             
            />
          ))}
        </div>

        <div className="cat-footer">
          <button
            className={`cat-next-btn ${canContinue ? "active" : "disabled"}`}
            onClick={handleContinue}
            disabled={!canContinue}
          >
            Next Page →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Categories;
