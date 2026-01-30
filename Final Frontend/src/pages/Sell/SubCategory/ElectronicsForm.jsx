import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../services/api";
import "react-toastify/dist/ReactToastify.css";
import "./BikeForm.css";

export default function ElectronicsForm() {
  const navigate = useNavigate();

  const category = "Electronics";

  const subCategories = [
    "Cameras & Lenses",
    "Games & Entertainment",
    "Fridges",
    "Computer Accessories",
    "Hard Disks, Printers & Monitors",
    "ACs",
    "Washing Machines",
  ];

  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry",
  ];

  // 🔒 PROTECT PAGE
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to post an ad");
      navigate("/login");
    }
  }, [navigate]);

  const [form, setForm] = useState({
    subCategory: "",
    title: "",
    yearOfPurchase: "",
    state: "",
    city: "",
    landmark: "",

    brand: "",
    model: "",
    condition: "",
    descriptionText: "",
    price: "",
  });

  const [photos, setPhotos] = useState(Array(12).fill(null));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSelectPhoto = (index, file) => {
    if (!file) return;
    const updated = [...photos];
    updated[index] = { file, preview: URL.createObjectURL(file) };
    setPhotos(updated);
  };

  const removePhoto = (index) => {
    const updated = [...photos];
    updated[index] = null;
    setPhotos(updated);
  };

  // Submit
  const handleSubmit = async () => {
    if (!form.subCategory) {
      toast.error("Please select a sub category");
      return;
    }

    try {
      // Description
      const description = `
Brand:${form.brand},
Model:${form.model},
Condition:${form.condition},
Notes:${form.descriptionText}
      `;

      // Location
      const location = `${form.state}, ${form.city}, ${form.landmark}`;

      // Prepare FormData
      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("price", form.price);
      formData.append("category", category);
      formData.append("subcategory", form.subCategory);
      formData.append("location", location);
      formData.append("year", form.yearOfPurchase);
      formData.append("description", description);

      // Handle multiple images
      photos.forEach((p) => {
        if (p) {
          formData.append("images", p.file);
        }
      });

      await api.post("/listings", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Electronics ad posted successfully!");
      navigate("/profile");
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Failed to post ad. Try again.",
      );
    }
  };

  return (
    <div className="sell-form-wrapper">
      {/* TOP BAR */}
      <div className="category-bar">
        <h2>Post your Ad</h2>

        <div className="selected-category">
          <span>Selected category</span>
          <div className="cat-path">
            <strong>{category}</strong>
            <button className="change-btn" onClick={() => navigate("/sell")}>
              Change
            </button>
          </div>
        </div>
      </div>

      <h3>Include some details</h3>

      {/* SUB CATEGORY */}
      <div className="form-group">
        <label>Sub Category *</label>
        <select
          name="subCategory"
          value={form.subCategory}
          onChange={handleChange}
          required
        >
          <option value="">Select</option>
          {subCategories.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* TITLE */}
      <div className="form-group">
        <label>Title *</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />
      </div>

      {/* BRAND */}
      <div className="form-group">
        <label>Brand *</label>
        <input name="brand" value={form.brand} onChange={handleChange} />
      </div>

      {/* MODEL */}
      <div className="form-group">
        <label>Model *</label>
        <input name="model" value={form.model} onChange={handleChange} />
      </div>

      {/* CONDITION */}
      <div className="form-group">
        <label>Condition *</label>
        <select name="condition" value={form.condition} onChange={handleChange}>
          <option value="">Select</option>
          <option>New</option>
          <option>Like New</option>
          <option>Used</option>
        </select>
      </div>

      {/* YEAR */}
      <div className="form-group">
        <label>Year of Purchase *</label>
        <input
          type="number"
          name="yearOfPurchase"
          value={form.yearOfPurchase}
          onChange={handleChange}
        />
      </div>

      {/* DESCRIPTION */}
      <div className="form-group">
        <label>Description *</label>
        <textarea
          rows="4"
          name="descriptionText"
          value={form.descriptionText}
          onChange={handleChange}
        />
      </div>

      {/* PRICE */}
      <h3>Set a price</h3>
      <div className="price-group">
        <span>₹</span>
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
        />
      </div>

      {/* PHOTOS */}
      <h3>Upload up to 12 photos</h3>
      <div className="photo-grid">
        {photos.map((photo, index) => (
          <div className="photo-slot" key={index}>
            {photo ? (
              <>
                <img src={photo.preview} alt="preview" />
                <button
                  className="remove-btn"
                  onClick={() => removePhoto(index)}
                >
                  ✕
                </button>
              </>
            ) : (
              <label className="add-photo">
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => handleSelectPhoto(index, e.target.files[0])}
                />
                <span className="plus">+</span>
              </label>
            )}
          </div>
        ))}
      </div>

      {/* LOCATION */}
      <h3>Confirm your location</h3>

      <div className="form-group">
        <label>State *</label>
        <select
          name="state"
          value={form.state}
          onChange={handleChange}
          required
        >
          <option value="">Select State</option>
          {indianStates.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>City *</label>
        <input name="city" value={form.city} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Landmark / Address *</label>
        <input
          name="landmark"
          value={form.landmark}
          onChange={handleChange}
          required
        />
      </div>

      <button className="submit-btn" onClick={handleSubmit}>
        Post Ad
      </button>
    </div>
  );
}
