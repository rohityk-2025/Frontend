import api from "./api";

// Get all listings (home page)
export const getAllListings = async () => {
  const res = await api.get("/listings");
  return res.data;
};

// Get single listing (product detail)
export const getListingById = async (id) => {
  const res = await api.get(`/listings/${id}`);
  return res.data;
};

// Create a new listing (sell forms, with images)
export const createListing = async (formData) => {
  // formData must be FormData (multipart)
  const res = await api.post("/listings", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

// Get my listings (profile page)
export const getMyListings = async () => {
  const res = await api.get("/listings/my");
  return res.data;
};

// Delete my listing (optional)
export const deleteListing = async (id) => {
  const res = await api.delete(`/listings/${id}`);
  return res.data;
};
