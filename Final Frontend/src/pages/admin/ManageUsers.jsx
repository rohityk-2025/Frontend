import { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";
import "./ManageUsers.css";

export default function ManageUsers() {
  const [allUsers, setAllUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all"); // all | normal | sellers | admins
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const limit = 8;

  /* ================= FETCH USERS ================= */
  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setAllUsers(res.data.users || res.data || []);
    } catch (err) {
      toast.error("Failed to load users");
      console.error("FETCH USERS ERROR:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ================= STATS (FRONTEND ONLY) ================= */

  const totalUsers = allUsers.length;

  const totalListings = allUsers.reduce(
    (sum, u) => sum + (u.totalListings || 0),
    0,
  );

  const sellers = allUsers.filter((u) => (u.totalListings || 0) > 0);

  // Active sellers (last 30 days) – fallback: sellers only
  const activeSellers = sellers.length;

  const recentUsers = allUsers.filter((u) => {
    if (!u.created_at) return false;
    const created = new Date(u.created_at);
    const diffDays = (new Date() - created) / (1000 * 60 * 60 * 24);
    return diffDays <= 30;
  }).length;

  /* ================= SEARCH ================= */
  let filteredUsers = allUsers.filter((user) => {
    const text =
      `${user.id} ${user.first_name} ${user.last_name} ${user.email}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  /* ================= FILTER PILLS ================= */
  if (filter === "normal") {
    filteredUsers = filteredUsers.filter(
      (u) => (u.totalListings || 0) === 0 && u.role === "user",
    );
  }

  if (filter === "sellers") {
    filteredUsers = filteredUsers.filter((u) => (u.totalListings || 0) > 0);
  }

  if (filter === "admins") {
    filteredUsers = filteredUsers.filter((u) => u.role === "admin");
  }

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredUsers.length / limit);
  const start = (page - 1) * limit;
  const currentUsers = filteredUsers.slice(start, start + limit);

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await api.delete(`/admin/users/${id}`);
      toast.success("User deleted");
      setAllUsers(allUsers.filter((u) => u.id !== id));
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ================= EDIT USER ================= */
  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditFormData({
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      email: user.email || "",
      password: "",
      role: user.role || "user",
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    if (!editingUser) return;

    if (!editFormData.first_name.trim() || !editFormData.email.trim()) {
      toast.error("Name and email are required");
      return;
    }

    setIsSubmitting(true);
    try {
      const updateData = {
        first_name: editFormData.first_name,
        last_name: editFormData.last_name,
        email: editFormData.email,
        role: editFormData.role,
      };

      // Only include password if provided
      if (editFormData.password.trim()) {
        updateData.password = editFormData.password;
      }

      console.log("Sending update request for user:", editingUser.id);
      console.log("Update data:", updateData);

      const response = await api.put(
        `/admin/users/${editingUser.id}`,
        updateData,
      );

      console.log("Update response:", response.data);
      toast.success("User updated successfully");

      // Update local state
      setAllUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                first_name: editFormData.first_name,
                last_name: editFormData.last_name,
                email: editFormData.email,
                role: editFormData.role,
              }
            : u,
        ),
      );

      setEditingUser(null);
      setEditFormData({});
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.message || "Failed to update user";
      toast.error(errorMsg);
      console.error("UPDATE ERROR:", err);
      console.error("Response data:", err.response?.data);
      console.error("Request config:", err.config);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ================= GET ROLE STYLE ================= */
  const getRoleStyle = (user) => {
    if (user.role === "admin") {
      return "admin";
    } else if ((user.totalListings || 0) > 0) {
      return "seller";
    } else {
      return "user";
    }
  };

  /* ================= GET ROLE DISPLAY TEXT ================= */
  const getRoleDisplayText = (user) => {
    if (user.role === "admin") {
      return "Admin";
    } else if ((user.totalListings || 0) > 0) {
      return "Seller";
    } else {
      return "User";
    }
  };

  return (
    <div className="users-root">
      <h3>Manage Users</h3>

      {/* ================= STATS BLOCKS ================= */}
      <div className="stats-grid">
        <div className="stat-card purple">
          <span>Total Users</span>
          <strong>{totalUsers}</strong>
        </div>

        <div className="stat-card green">
          <span>Active Sellers</span>
          <strong>{activeSellers}</strong>
        </div>

        <div className="stat-card orange">
          <span>Total Listings</span>
          <strong>{totalListings}</strong>
        </div>

        <div className="stat-card blue">
          <span>Recent Users (30 days)</span>
          <strong>{recentUsers}</strong>
        </div>
      </div>

      <hr />

      {/* ================= SEARCH BAR ================= */}
      <div className="users-top">
        <input
          type="text"
          placeholder="Search by ID, name or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* ================= FILTER PILLS ================= */}
      <div className="filter-bar">
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => {
            setFilter("all");
            setPage(1);
          }}
        >
          All Users
        </button>

        <button
          className={filter === "normal" ? "active" : ""}
          onClick={() => {
            setFilter("normal");
            setPage(1);
          }}
        >
          Normal Users
        </button>

        <button
          className={filter === "sellers" ? "active" : ""}
          onClick={() => {
            setFilter("sellers");
            setPage(1);
          }}
        >
          Sellers
        </button>

        <button
          className={filter === "admins" ? "active" : ""}
          onClick={() => {
            setFilter("admins");
            setPage(1);
          }}
        >
          Admins
        </button>
      </div>

      {/* ================= TABLE ================= */}
      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>Profile</th>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Listings</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentUsers.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  No users found
                </td>
              </tr>
            ) : (
              currentUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <img
                      src={
                        user.avatar
                          ? user.avatar.startsWith("/uploads")
                            ? `https://frontend-nkg1.onrender.com${user.avatar}`
                            : user.avatar
                          : "/profile.png"
                      }
                      alt="profile"
                      className="user-avatar"
                    />
                  </td>

                  <td>{user.id}</td>
                  <td>
                    {user.first_name} {user.last_name}
                  </td>
                  <td>{user.email}</td>

                  <td>
                    <span className={`role ${getRoleStyle(user)}`}>
                      {getRoleDisplayText(user)}
                    </span>
                  </td>

                  <td>{user.totalListings || 0}</td>

                  <td className="action-icons">
                    <i
                      className="fa-solid fa-pen edit-icon"
                      onClick={() => handleEditClick(user)}
                    ></i>
                    <i
                      className="fa-solid fa-trash delete-icon"
                      onClick={() => handleDelete(user.id)}
                    ></i>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= PAGINATION ================= */}
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>

        <span>
          Page {page} of {totalPages || 1}
        </span>

        <button
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>

      {/* ================= EDIT MODAL ================= */}
      {editingUser && (
        <div className="modal-overlay" onClick={() => setEditingUser(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h4>Edit User</h4>
              <button
                className="close-btn"
                onClick={() => setEditingUser(null)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={editFormData.first_name}
                  onChange={handleEditFormChange}
                  placeholder="First name"
                />
              </div>

              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={editFormData.last_name}
                  onChange={handleEditFormChange}
                  placeholder="Last name"
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={editFormData.email}
                  onChange={handleEditFormChange}
                  placeholder="Email"
                />
              </div>

              <div className="form-group">
                <label>Password (leave blank to keep current)</label>
                <input
                  type="password"
                  name="password"
                  value={editFormData.password}
                  onChange={handleEditFormChange}
                  placeholder="New password"
                />
              </div>

              <div className="form-group">
                <label>Role</label>
                <select
                  name="role"
                  value={editFormData.role}
                  onChange={handleEditFormChange}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-cancel"
                onClick={() => setEditingUser(null)}
              >
                Cancel
              </button>
              <button
                className="btn-save"
                onClick={handleSaveChanges}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
