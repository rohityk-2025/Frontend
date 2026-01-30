import { Navigate, Outlet } from "react-router-dom";
{
  /* <Route path="/admin/listings" element={<ManageListings />} /> */
}

export default function AdminRoutes() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // NOT LOGGED IN
  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  // NOT ADMIN
  if (user.role !== "admin") {
    return <Navigate to="/" />;
  }

  // ADMIN VERIFIED → ALLOW ACCESS
  return <Outlet />;
}
