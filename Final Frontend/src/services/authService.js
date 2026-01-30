import api from "./api";

// LOGIN
export const login = async (email, password) => {
  const res = await api.post("/auth/login", {
    email,
    password,
  });

  // SAVE TOKEN + USER
  localStorage.setItem("token", res.data.token);
  localStorage.setItem("user", JSON.stringify(res.data.user));

  return res.data;
};

// REGISTER
export const register = async (data) => {
  // data = { firstName, lastName, email, password, avatar }
  const res = await api.post("/auth/register", data);
  return res.data;
};

// LOGOUT
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// GET CURRENT LOGGED IN USER (FROM LOCAL STORAGE)
export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// UPDATE PROFILE
export const updateProfile = async (data) => {
  // data = { firstName, email, password(optional) }
  const res = await api.put("/users/me", data);

  // UPDATE LOCAL USER
  localStorage.setItem("user", JSON.stringify(res.data));

  return res.data;
};
