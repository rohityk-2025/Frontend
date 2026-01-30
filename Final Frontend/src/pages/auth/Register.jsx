import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import iconData from "../../data/icondata";
import "./Register.css";
import api from "../../services/api";
import { toast } from "react-toastify";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({});
  const [selectedIcon, setSelectedIcon] = useState(iconData[0]);
  const [avatarFile, setAvatarFile] = useState(null); // selected avatar file
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Use FormData for file upload
      const formData = new FormData();

      formData.append("firstName", form.firstName);
      formData.append("lastName", form.lastName);
      formData.append("email", form.email);
      formData.append("password", form.password);

      // If avatar file selected, send file
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      } else {
        // Otherwise send selected icon URL
        formData.append("icon", selectedIcon);
      }

      await api.post("/auth/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      const message =
        err.response?.data?.message || "Registration failed. Try again.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>Register</h2>

        {/* ICON SELECTION (UNCHANGED UI) */}
        <div className="icon-section">
          <p>Choose Profile Icon</p>
          <div className="icon-grid">
            {iconData.map((icon, i) => (
              <img
                key={i}
                src={icon}
                alt="icon"
                className={`icon-img ${selectedIcon === icon ? "active" : ""}`}
                onClick={() => {
                  setSelectedIcon(icon);
                  setAvatarFile(null); // reset file if icon selected
                }}
              />
            ))}
          </div>
        </div>

        {/* Optional upload photo (small add, doesn't break UI) */}
        <div style={{ marginBottom: "10px", textAlign: "center" }}>
          <label style={{ cursor: "pointer", color: "#008b8b" }}>
            Or upload your own photo
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                setAvatarFile(e.target.files[0]);
              }}
            />
          </label>

          {avatarFile && (
            <p style={{ fontSize: "12px", color: "green" }}>
              Selected: {avatarFile.name}
            </p>
          )}
        </div>

        <form onSubmit={handleRegister}>
          <input
            className="login-input"
            name="firstName"
            placeholder="First Name"
            required
            onChange={handleChange}
          />

          <input
            className="login-input"
            name="lastName"
            placeholder="Last Name"
            required
            onChange={handleChange}
          />

          <input
            className="login-input"
            type="email"
            name="email"
            placeholder="Email"
            required
            onChange={handleChange}
          />

          <input
            className="login-input"
            type="password"
            name="password"
            placeholder="Password"
            required
            onChange={handleChange}
          />

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="login-note">
          Already have an account?{" "}
          <span className="resend" onClick={() => navigate("/login")}>
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}
