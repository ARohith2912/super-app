import React, { useState, useEffect, useRef } from "react";
import "./TimerWidget.css";

const pad = (n) => String(n).padStart(2, "0");

const TimerWidget = () => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null); // null = not started
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const intervalRef = useRef(null);

  const totalSet = hours * 3600 + minutes * 60 + seconds;

  const startTimer = () => {
    if (timeLeft === null) {
      // First start
      if (totalSet === 0) return;
      setTimeLeft(totalSet);
    }
    setRunning(true);
    setDone(false);
  };

  const pauseTimer = () => {
    setRunning(false);
  };

  const resetTimer = () => {
    setRunning(false);
    setTimeLeft(null);
    setDone(false);
  };

  useEffect(() => {
    if (!running) {
      clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setRunning(false);
          setDone(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const display = timeLeft !== null ? timeLeft : totalSet;
  const dispHours = Math.floor(display / 3600);
  const dispMinutes = Math.floor((display % 3600) / 60);
  const dispSeconds = display % 60;

  // Circle progress
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const progress = totalSet > 0 && timeLeft !== null
    ? (timeLeft / totalSet) * circumference
    : circumference;

  return (
    <div className={`timer-widget ${done ? "timer-done" : ""}`}>
      <p className="timer-label">⏱ Countdown Timer</p>

      {done && (
        <div className="timer-alert">⏰ Time's up!</div>
      )}

      {/* Circular display */}
      <div className="timer-circle-wrap">
        <svg viewBox="0 0 160 160" className="timer-svg">
          <circle cx="80" cy="80" r={radius} className="timer-track" />
          <circle
            cx="80"
            cy="80"
            r={radius}
            className="timer-progress"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            transform="rotate(-90 80 80)"
          />
        </svg>
        <div className="timer-time-display">
          <span className="timer-digits">
            {pad(dispHours)}:{pad(dispMinutes)}:{pad(dispSeconds)}
          </span>
        </div>
      </div>

      {/* Input fields (only when not started) */}
      {timeLeft === null && (
        <div className="timer-inputs">
          <div className="timer-inp-group">
            <label>Hours</label>
            <div className="timer-inp-spin">
              <button onClick={() => setHours((h) => Math.min(23, h + 1))}>▲</button>
              <input
                type="number"
                min="0"
                max="23"
                value={hours}
                onChange={(e) => setHours(Math.min(23, Math.max(0, +e.target.value)))}
              />
              <button onClick={() => setHours((h) => Math.max(0, h - 1))}>▼</button>
            </div>
          </div>
          <div className="timer-inp-group">
            <label>Minutes</label>
            <div className="timer-inp-spin">
              <button onClick={() => setMinutes((m) => Math.min(59, m + 1))}>▲</button>
              <input
                type="number"
                min="0"
                max="59"
                value={minutes}
                onChange={(e) => setMinutes(Math.min(59, Math.max(0, +e.target.value)))}
              />
              <button onClick={() => setMinutes((m) => Math.max(0, m - 1))}>▼</button>
            </div>
          </div>
          <div className="timer-inp-group">
            <label>Seconds</label>
            <div className="timer-inp-spin">
              <button onClick={() => setSeconds((s) => Math.min(59, s + 1))}>▲</button>
              <input
                type="number"
                min="0"
                max="59"
                value={seconds}
                onChange={(e) => setSeconds(Math.min(59, Math.max(0, +e.target.value)))}
              />
              <button onClick={() => setSeconds((s) => Math.max(0, s - 1))}>▼</button>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="timer-controls">
        {!running ? (
          <button className="timer-btn start" onClick={startTimer}>
            {timeLeft !== null && timeLeft > 0 ? "Resume" : "Start"}
          </button>
        ) : (
          <button className="timer-btn pause" onClick={pauseTimer}>Pause</button>
        )}
        <button className="timer-btn reset" onClick={resetTimer}>Reset</button>
      </div>
    </div>
  );
};

export default TimerWidget;
