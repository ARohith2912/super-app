import React from "react";
import { useStore } from "../store/useStore";
import "./NotesWidget.css";

const NotesWidget = () => {
  const { notes, setNotes } = useStore();

  const handleClear = () => {
    setNotes("");
    localStorage.removeItem("super_app_notes");
  };

  const wordCount = notes.trim() ? notes.trim().split(/\s+/).length : 0;

  return (
    <div className="notes-widget">
      <div className="notes-header">
        <span className="notes-title">📝 All notes</span>
        <div className="notes-actions">
          <span className="notes-word-count">{wordCount} words</span>
          <button className="notes-clear-btn" onClick={handleClear} title="Clear notes">
            Clear
          </button>
        </div>
      </div>

      <textarea
        className="notes-textarea"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="This is how I am going to learn MERN stack in next 3 months…"
        spellCheck="true"
      />

      <div className="notes-footer">
        <span className="notes-saved">✓ Auto-saved to browser storage</span>
      </div>
    </div>
  );
};

export default NotesWidget;
