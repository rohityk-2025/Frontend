import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import api from "../../services/api";
import { toast } from "react-toastify";
import { setToken } from "../../utils/token";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // CALL BACKEND LOGIN API
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      console.log("LOGIN FULL RESPONSE:", res); // DEBUG
      console.log("LOGIN DATA:", res.data); // DEBUG

      // BACKEND MUST RETURN: { token, user }
      const token = res.data.token;
      const user = res.data.user;

      if (!token || !user) {
        toast.error("Login failed: token or user missing from server response");
        setLoading(false);
        return;
      }

      // SAVE AUTH DATA
      setToken(token); // localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("Login successful!");

      // NEW: ADMIN / USER REDIRECT + ADMIN TOAST
      if (user.role === "admin") {
        toast.success("Welcome Admin");
        navigate("/admin/dashboard");
      } else {
        navigate("/profile");
      }
    } catch (err) {
      console.error("LOGIN ERROR FULL:", err);

      const message =
        err.response?.data?.message ||
        "Login failed. Please check email and password.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <input
            className="login-input"
            type="email"
            placeholder="Enter Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="login-input"
            type="password"
            placeholder="Enter Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="login-note">
          New user?{" "}
          <span className="resend" onClick={() => navigate("/register")}>
            Register here
          </span>
        </p>
      </div>
    </div>
  );
}
