import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

// CREATE CONTEXT
const AuthContext = createContext();

// PROVIDER
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load logged-in user from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });

    const { token, user } = res.data;

    // SAVE TO LOCAL STORAGE
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    // UPDATE STATE
    setUser(user);

    return user;
  };

  // Register function
  const register = async (data) => {
    // data = { firstName, lastName, email, password, avatar }
    const res = await api.post("/auth/register", data);
    return res.data;
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// CUSTOM HOOK (EASY TO USE)
export function useAuth() {
  return useContext(AuthContext);
}
