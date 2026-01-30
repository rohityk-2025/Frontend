import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { categories } from "../../data/categories";
import { toast } from "react-toastify"; // toast notifications
import "./Sell.css";

export default function Sell() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");

  const navigate = useNavigate();

  // Protect page (only logged-in users can sell)
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login to start selling");
      navigate("/login");
    }
  }, [navigate]);

  const handleSubCategoryChange = (sub) => {
    setSelectedSubCategory(sub);

    // CARS
    if (selectedCategory === "Cars") {
      navigate("/sell/cars");
    }

    // BIKES
    else if (selectedCategory === "Bikes") {
      if (sub === "Motorcycles") navigate("/sell/bikes/motorcycles");
      if (sub === "Scooters") navigate("/sell/bikes/scooters");
      if (sub === "Bicycles") navigate("/sell/bikes/bicycles");
    }

    // ELECTRONICS
    else if (selectedCategory === "Electronics") {
      navigate("/sell/electronics");
    }

    // FURNITURE
    else if (selectedCategory === "Furniture") {
      navigate("/sell/furniture");
    }

    // FASHION
    else if (selectedCategory === "Fashion") {
      navigate("/sell/fashion");
    }

    // PETS
    else if (selectedCategory === "Pets") {
      navigate("/sell/pets");
    }

    // MOBILES
    else if (selectedCategory === "Mobiles") {
      navigate("/sell/mobile");
    }

    // SPORTS & HOBBIES
    else if (selectedCategory === "Sports") {
      navigate("/sell/sport");
    }
  };

  return (
    <div className="sell-wrapper">
      <h2 className="sell-title">POST YOUR AD</h2>

      <div className="sell-box">
        {/* CATEGORY */}
        <div className="form-group">
          <label>Choose Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedSubCategory("");
            }}
          >
            <option value="">Select Category</option>
            {Object.keys(categories).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* SUB CATEGORY */}
        {selectedCategory && (
          <div className="form-group">
            <label>Choose Sub Category</label>
            <select
              value={selectedSubCategory}
              onChange={(e) => handleSubCategoryChange(e.target.value)}
            >
              <option value="">Select Sub Category</option>
              {categories[selectedCategory].map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
