import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../utils/token";

export default function ProtectedRoute({ children }) {
  // IF NOT LOGGED IN → BLOCK ACCESS
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />; // better UX than /unauthorized
  }

  // IF LOGGED IN → SHOW THE PAGE
  return children;
}
