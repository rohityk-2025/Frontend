import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-toastify";
import "./EditListing.css";

export default function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    price: "",
    category: "",
    subcategory: "",
    location: "",
    year: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  // Fetch existing listing data
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await api.get(`/listings/${id}`);
        const data = res.data;

        setForm({
          title: data.title || "",
          price: data.price || "",
          category: data.category || "",
          subcategory: data.subcategory || "",
          location: data.location || "",
          year: data.year || "",
          description: data.description || "",
        });
      } catch (err) {
        console.error("EDIT FETCH ERROR:", err);
        toast.error("Failed to load listing");
        navigate("/profile");
      }
    };

    fetchListing();
  }, [id, navigate]);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit updated listing
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.put(`/listings/${id}`, form);

      toast.success("Listing updated successfully!");

      // Navigate back to profile
      navigate("/profile");
    } catch (err) {
      console.error("UPDATE ERROR FULL:", err);

      const message = err.response?.data?.message || "Failed to update listing";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-listing-wrapper">
      <div className="edit-listing-card">
        <h2>Edit Listing</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="subcategory"
            placeholder="Subcategory"
            value={form.subcategory}
            onChange={handleChange}
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
          />

          <input
            type="text"
            name="year"
            placeholder="Year"
            value={form.year}
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Description"
            rows="4"
            value={form.description}
            onChange={handleChange}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Listing"}
          </button>
        </form>
      </div>
    </div>
  );
}
