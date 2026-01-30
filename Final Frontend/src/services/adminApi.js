import api from "./api";

/* DASHBOARD */
export const getDashboardStats = () => api.get("/admin/dashboard");
export const getUsersListingsChart = () =>
  api.get("/admin/chart/users-listings");
export const getVisitsChart = () => api.get("/admin/chart/visits");
export const getCategoryChart = () => api.get("/admin/chart/categories");

/* USERS */
export const getUsers = (page, limit, search) =>
  api.get(`/admin/users?page=${page}&limit=${limit}&search=${search}`);

export const deleteUser = (id) => api.delete(`/admin/users/${id}`);

export const updateUser = (id, data) => api.put(`/admin/users/${id}`, data);

/* LISTINGS */
export const getListings = () => api.get("/admin/listings");

export const updateListingStatus = (id, status) =>
  api.put(`/admin/listings/${id}/status`, { status });

export const deleteListing = (id) => api.delete(`/admin/listings/${id}`);

/* CALENDAR */
export const getAllEvents = () => api.get("/admin/events");

export const getEventsByDate = async (date) => {
  const res = await api.get(`/admin/events/by-date?date=${date}`);
  return res.data;
};

export const addEvent = async (data) => {
  const res = await api.post("/admin/events", data);
  return res.data;
};

export const deleteEvent = async (id) => {
  const res = await api.delete(`/admin/events/${id}`);
  return res.data;
};
