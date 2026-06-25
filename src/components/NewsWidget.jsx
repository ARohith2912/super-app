import React, { useState, useEffect, useRef } from "react";
import { fetchTopHeadlines } from "../services/apiServices";
import "./NewsWidget.css";

const NewsWidget = () => {
  const [articles, setArticles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchTopHeadlines("general");
        setArticles(data.filter((a) => a.title && a.title !== "[Removed]"));
      } catch (_) {
        // mock already returned in service
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Auto-rotate every 2 seconds
  useEffect(() => {
    if (articles.length === 0 || paused) return;
    intervalRef.current = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % articles.length);
    }, 2000);
    return () => clearInterval(intervalRef.current);
  }, [articles, paused]);

  const goTo = (idx) => {
    setCurrentIndex(idx);
  };

  const article = articles[currentIndex];

  return (
    <div
      className="news-widget"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="news-header">
        <span className="news-title-label">📰 Latest News</span>
        <span className="news-counter">
          {articles.length > 0 ? `${currentIndex + 1} / ${articles.length}` : ""}
        </span>
      </div>

      {loading && (
        <div className="news-loading">
          <div className="news-spinner" />
        </div>
      )}

      {!loading && article && (
        <div className="news-card">
          {article.urlToImage && (
            <div className="news-img-wrap">
              <img
                src={article.urlToImage}
                alt={article.title}
                className="news-img"
                onError={(e) => { e.target.style.display = "none"; }}
              />
            </div>
          )}
          <div className="news-body">
            <p className="news-source">{article.source?.name}</p>
            <h3 className="news-headline">{article.title}</h3>
            <p className="news-desc">
              {article.description?.slice(0, 140)}
              {article.description?.length > 140 ? "…" : ""}
            </p>
            {article.url && article.url !== "#" && (
              <a href={article.url} target="_blank" rel="noreferrer" className="news-read-more">
                Read more →
              </a>
            )}
          </div>
        </div>
      )}

      {/* Dot indicators */}
      {articles.length > 0 && (
        <div className="news-dots">
          {articles.slice(0, 8).map((_, i) => (
            <button
              key={i}
              className={`news-dot ${i === currentIndex ? "active" : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Article ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsWidget;
