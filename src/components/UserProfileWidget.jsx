import React from "react";
import "./UserProfileWidget.css";

const AVATAR_COLORS = ["#7c3aed", "#db2777", "#2563eb", "#059669", "#d97706"];

const UserProfileWidget = ({ user, categories }) => {
  // Pick a consistent color based on username
  const colorIndex =
    user.username ? user.username.charCodeAt(0) % AVATAR_COLORS.length : 0;
  const avatarColor = AVATAR_COLORS[colorIndex];
  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "SA";

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    month: "2-digit", day: "2-digit", year: "numeric",
  });
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit", hour12: false,
  });

  return (
    <div className="profile-widget">
      <div className="profile-top">
        <div className="profile-avatar" style={{ background: avatarColor }}>
          {initials}
        </div>
        <div className="profile-info">
          <p className="profile-email">{user.email}</p>
          <p className="profile-username">{user.username}</p>
          <p className="profile-mobile">{user.mobile}</p>
        </div>
      </div>

      <div className="profile-categories">
        {categories.map((cat) => (
          <span key={cat} className="profile-cat-chip">{cat}</span>
        ))}
      </div>

      <div className="profile-datetime">
        <span className="profile-date">{dateStr}</span>
        <span className="profile-time">{timeStr}</span>
      </div>
    </div>
  );
};

export default UserProfileWidget;
