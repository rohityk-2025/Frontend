// ==========================
// Navbar.jsx (UI ONLY – LOGIC & LINKS UNCHANGED)
// ==========================

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Navbar.css";
import { getUnreadCount } from "../../services/notificationApi";

export default function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  // SEARCH STATES (UNCHANGED)
  const [citySearch, setCitySearch] = useState("");
  const [mainSearch, setMainSearch] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread notification count on mount and periodically
  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (user) {
        try {
          const count = await getUnreadCount();
          setUnreadCount(count);
        } catch (error) {
          console.error("Failed to fetch unread count:", error);
        }
      }
    };

    fetchUnreadCount();

    // Poll every 30 seconds for new notifications
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const handleSell = () => {
    if (!user) navigate("/login");
    else navigate("/sell");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("favourites");
    navigate("/");
  };

  const handleCitySearch = () => {
    if (!citySearch.trim()) return;
    navigate(`/?city=${encodeURIComponent(citySearch)}`);
  };

  const handleMainSearch = () => {
    if (!mainSearch.trim()) return;
    navigate(`/?q=${encodeURIComponent(mainSearch)}`);
  };

  return (
    <>
      {/* TOP HEADER */}
      <header className="main-header">
        <div className="left-head">
          {/* LOGO + NAME */}
          <div className="logo" onClick={() => navigate("/")}>
            <img className="logo-img" src="logo.png" alt="logo" />
            <span className="logo-text">ReCircle Mart</span>
          </div>

          {/* CITY SEARCH */}
          <div className="search-box">
            <input
              type="text"
              placeholder="Location"
              value={citySearch}
              onChange={(e) => setCitySearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCitySearch()}
            />
            <div className="search-btn" onClick={handleCitySearch}>
              <i className="fa-solid fa-magnifying-glass"></i>
            </div>
          </div>

          {/* MAIN SEARCH (SAME SIZE AS CITY SEARCH) */}
          <div className="search-box">
            <input
              type="text"
              placeholder="Search products"
              value={mainSearch}
              onChange={(e) => setMainSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleMainSearch()}
            />
            <div className="search-btn" onClick={handleMainSearch}>
              <i className="fa-solid fa-magnifying-glass"></i>
            </div>
          </div>
        </div>

        <div className="right-head">
          {/* ICONS */}
          <div className="icon-circle" onClick={() => navigate("/messages")}>
            <img className="msg" src="chatting.png"></img>
          </div>

          <div
            className="icon-circle"
            onClick={() => navigate("/notifications")}
          >
            <i className="fa-regular fa-bell"></i>
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </div>

          <div className="icon-circle" onClick={() => navigate("/favourites")}>
            <i className="fa-regular fa-heart"></i>
          </div>

          {!user ? (
            <button className="nav-link" onClick={() => navigate("/login")}>
              Login
            </button>
          ) : (
            <div className="profile-nav">
              <span className="welcome-text">Welcome</span>

              <img
                src={user.avatar || "profile.png"}
                alt="profile"
                className="nav-profile"
                onClick={() => navigate("/profile")}
              />

              <span className="user-name">
                {user.first_name || user.firstName}
              </span>

              {/* LOGOUT ICON WITH HOVER TOOLTIP */}
              <div
                className="logout-icon"
                onClick={handleLogout}
                title="Logout"
              >
                <i class="fa-solid fa-arrow-right-from-bracket"></i>
              </div>
            </div>
          )}

          {/* SELL BUTTON (WITH ICON + PURPLE GLITTER) */}
          <div className="sell-border" onClick={handleSell}>
            <button className="sell-btn">
              <i className="fa-solid fa-tag sell-icon"></i> SELL
            </button>
          </div>
        </div>
      </header>

      {/* FILTER BAR */}
      <div className="filter-bar">
        <div className="filter-left">
          <div className="filter-icon">
            <img className="msg" src="filter.png"></img>
          </div>

          <span className="filter-pill" onClick={() => navigate("/?days=1")}>
            Yesterday
          </span>
          <span className="filter-pill" onClick={() => navigate("/?days=3")}>
            3 Days Ago
          </span>
          <span className="filter-pill" onClick={() => navigate("/?days=7")}>
            7 Days Ago
          </span>
        </div>

        {/* DATE */}
        <span className="category-date">Today, {today}</span>
      </div>
    </>
  );
}
