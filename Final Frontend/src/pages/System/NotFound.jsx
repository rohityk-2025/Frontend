import { useNavigate } from "react-router-dom";
import "./System.css";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="system-page">
      <div className="system-box">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for does not exist.</p>

        <button className="system-btn" onClick={() => navigate("/")}>
          Go to Home
        </button>
      </div>
    </div>
  );
}
