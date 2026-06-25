import React, { useState, useEffect } from "react";
import { fetchWeatherByCoords, fetchWeatherByCity } from "../services/apiServices";
import "./WeatherWidget.css";

const WEATHER_ICONS = {
  Clear: "☀️",
  Clouds: "☁️",
  Rain: "🌧️",
  Drizzle: "🌦️",
  Thunderstorm: "⛈️",
  Snow: "❄️",
  Mist: "🌫️",
  Fog: "🌫️",
  Haze: "🌫️",
  Smoke: "🌫️",
  Dust: "🌪️",
  Tornado: "🌪️",
  Default: "🌤️",
};

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [city, setCity] = useState("");
  const [inputCity, setInputCity] = useState("");

  const loadWeather = async (lat, lon, cityName) => {
    setLoading(true);
    setError("");
    try {
      let data;
      if (lat && lon) {
        data = await fetchWeatherByCoords(lat, lon);
      } else {
        data = await fetchWeatherByCity(cityName || "Hyderabad");
      }
      setWeather(data);
      setCity(data.name);
    } catch (err) {
      setError("Unable to fetch weather. Check your API key or city name.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => loadWeather(pos.coords.latitude, pos.coords.longitude),
        () => loadWeather(null, null, "Hyderabad")
      );
    } else {
      loadWeather(null, null, "Hyderabad");
    }
  }, []);

  const handleCitySearch = (e) => {
    e.preventDefault();
    if (inputCity.trim()) {
      loadWeather(null, null, inputCity.trim());
      setInputCity("");
    }
  };

  const getIcon = (main) => WEATHER_ICONS[main] || WEATHER_ICONS.Default;

  return (
    <div className="weather-widget">
      <div className="weather-search-row">
        <form onSubmit={handleCitySearch} className="weather-search">
          <input
            type="text"
            value={inputCity}
            onChange={(e) => setInputCity(e.target.value)}
            placeholder="Search city..."
            className="weather-input"
          />
          <button type="submit" className="weather-search-btn">🔍</button>
        </form>
      </div>

      {loading && (
        <div className="weather-loading">
          <div className="weather-spinner" />
          <p>Fetching weather…</p>
        </div>
      )}

      {error && !loading && (
        <div className="weather-error">
          <span>⚠️ {error}</span>
        </div>
      )}

      {!loading && !error && weather && (
        <div className="weather-content">
          <div className="weather-main">
            <div className="weather-icon-big">
              {getIcon(weather.weather?.[0]?.main)}
            </div>
            <div>
              <p className="weather-temp">{Math.round(weather.main?.temp)}°C</p>
              <p className="weather-desc">{weather.weather?.[0]?.description}</p>
              <p className="weather-city">{weather.name}, {weather.sys?.country}</p>
            </div>
          </div>

          <div className="weather-stats">
            <div className="weather-stat">
              <span className="weather-stat-icon">💧</span>
              <span className="weather-stat-label">Humidity</span>
              <span className="weather-stat-val">{weather.main?.humidity}%</span>
            </div>
            <div className="weather-stat">
              <span className="weather-stat-icon">💨</span>
              <span className="weather-stat-label">Wind</span>
              <span className="weather-stat-val">{(weather.wind?.speed * 3.6).toFixed(1)} km/h</span>
            </div>
            <div className="weather-stat">
              <span className="weather-stat-icon">🌡️</span>
              <span className="weather-stat-label">Pressure</span>
              <span className="weather-stat-val">{weather.main?.pressure} hPa</span>
            </div>
            <div className="weather-stat">
              <span className="weather-stat-icon">👁️</span>
              <span className="weather-stat-label">Feels like</span>
              <span className="weather-stat-val">{Math.round(weather.main?.feels_like)}°C</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
