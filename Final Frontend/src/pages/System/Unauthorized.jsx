import { useNavigate } from "react-router-dom";
import "./System.css";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="system-page">
      <div className="system-box">
        <h1>403</h1>
        <h2>Unauthorized</h2>
        <p>You are not allowed to access this page.</p>

        <div className="system-actions">
          <button className="system-btn" onClick={() => navigate("/login")}>
            Login
          </button>

          <button className="system-btn outline" onClick={() => navigate("/")}>
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}
