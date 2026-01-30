import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-toastify";
import "./EditProfile.css";

export default function EditProfile() {
  const navigate = useNavigate();

  const localUser = JSON.parse(localStorage.getItem("user"));

  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Load current user once on mount
  useEffect(() => {
    if (!localUser) {
      navigate("/login");
      return;
    }

    // IMPORTANT FIX — SUPPORT BOTH NAMING STYLES
    setFirstName(localUser.first_name || localUser.firstName || "");
    setEmail(localUser.email || "");
  }, []); // ⚠️ DO NOT PUT localUser IN DEPENDENCY (THIS WAS LOCKING INPUT)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.put("/auth/update-profile", {
        first_name: firstName,
        email: email,
        ...(password && { password }),
      });

      // Update localStorage with new user data
      const updatedUser = {
        ...localUser,
        first_name: firstName,
        firstName: firstName,
        email: email,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("Profile updated successfully");
      navigate("/profile");
    } catch (err) {
      console.error(" UPDATE PROFILE ERROR:", err);

      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to update profile";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile-wrapper">
      <div className="edit-profile-card">
        <h2>Edit Profile</h2>
        <p className="subtitle">Update your personal information</p>

        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave empty to keep current password"
            />
          </div>

          <div className="edit-actions">
            <button type="submit" disabled={loading} className="save-btn">
              {loading ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/profile")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
