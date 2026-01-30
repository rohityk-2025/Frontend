import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";

import Navbar from "./components/navbar/Navbar";
import PublicRoutes from "./routes/PublicRoutes";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Determine whether to show the site navigation. Navbar is hidden for admin routes.
  const isAdminPage = location.pathname.startsWith("/admin");
  const shouldShowNavbar = !isAdminPage;

  return (
    <AuthProvider>
      <div className="app-wrapper">
        {/* Navigation bar - displayed for non-admin routes only */}
        {shouldShowNavbar && <Navbar />}

        {/* Toast notifications (react-toastify) - global container */}
        <ToastContainer position="top-right" autoClose={3000} />

        {/* Application routes (PublicRoutes) - mounts page routes */}
        <PublicRoutes />
      </div>
    </AuthProvider>
  );
}

// Previous alternate App implementation removed.
// The App component wraps the application with `AuthProvider`, renders the
// navigation bar on non-admin pages, includes global toast notifications,
// and mounts the `PublicRoutes` component to provide all routes.
