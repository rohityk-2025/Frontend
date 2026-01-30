import { Outlet, Link, useNavigate } from "react-router-dom";
import "./AdminLayout.css";

export default function AdminLayout() {
  const navigate = useNavigate();

  // Get logged-in admin from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="admin-root">
      {/* ---------- LEFT SIDEBAR ---------- */}
      <div className="admin-sidebar">
        {/* PROFILE TOP */}
        <div className="admin-profile">
          <div className="admin-avatar">
            {user?.first_name?.charAt(0) || "A"}
          </div>
          <div>
            <p className="admin-name">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="admin-email">{user?.email}</p>
          </div>
        </div>

        {/* MENU */}
        <div className="admin-menu">
          <Link to="/admin/dashboard" className="admin-link">
            <i className="fa-solid fa-chart-line"></i>
            <span style={{ marginLeft: "10px" }}>Dashboard</span>
          </Link>

          <Link to="/admin/listings" className="admin-link">
            <i className="fa-solid fa-list"></i>
            <span style={{ marginLeft: "10px" }}>Manage Listings</span>
          </Link>

          <Link to="/admin/users" className="admin-link">
            <i className="fa-solid fa-users"></i>
            <span style={{ marginLeft: "10px" }}>Manage Users</span>
          </Link>

          <Link to="/admin/calendar" className="admin-link">
            <i className="fa-solid fa-calendar-days"></i>
            <span style={{ marginLeft: "10px" }}>Calendar</span>
          </Link>
        </div>

        {/* LOGOUT BOTTOM */}
        <div className="admin-logout">
          <button onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket"></i>
            <span style={{ marginLeft: "8px" }}>Logout</span>
          </button>
        </div>
      </div>

      {/* ---------- RIGHT PANEL ---------- */}
      <div className="admin-main">
        {/* TOP BAR */}
        <div className="admin-top">
          <h2>
            <i className="fa-solid fa-user-shield"></i>
            <span style={{ marginLeft: "10px" }}>Admin Panel</span>
          </h2>
          <span className="admin-date">
            <i className="fa-regular fa-calendar"></i>
            <span style={{ marginLeft: "8px" }}>{today}</span>
          </span>
        </div>

        {/* PAGE CONTENT */}
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
