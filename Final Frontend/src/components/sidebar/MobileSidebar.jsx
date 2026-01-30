import { useState } from "react";
import "./MobileSidebar.css";

export default function MobileSidebar({ onFilterChange }) {
  const [filters, setFilters] = useState({
    location: "",
    subCategory: "",
    brand: "",
    condition: "",
    budget: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // CLEAR ALL
  const clearAll = () => {
    const cleared = {
      location: "",
      subCategory: "",
      brand: "",
      condition: "",
      budget: "",
    };
    setFilters(cleared);
    onFilterChange(cleared);
  };

  return (
    <aside className="sidebar">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3>Mobile Filters</h3>
        <button className="clear-btn" onClick={clearAll}>
          Clear All
        </button>
      </div>

      {/* LOCATION */}
      <select name="location" value={filters.location} onChange={handleChange}>
        <option value="">Location</option>
        <option value="Hinjewadi">Hinjewadi</option>
        <option value="Baner">Baner</option>
        <option value="Kothrud">Kothrud</option>
        <option value="Wakad">Wakad</option>
        <option value="Pune">Pune</option>
        <option value="Mumbai">Mumbai</option>
      </select>

      {/* SUB CATEGORY */}
      <select
        name="subCategory"
        value={filters.subCategory}
        onChange={handleChange}
      >
        <option value="">Sub Category</option>
        <option value="Smartphones">Smartphones</option>
        <option value="Feature Phones">Feature Phones</option>
        <option value="Accessories">Accessories</option>
      </select>

      {/* BRAND */}
      <select name="brand" value={filters.brand} onChange={handleChange}>
        <option value="">Brand</option>
        <option value="Apple">Apple</option>
        <option value="Samsung">Samsung</option>
        <option value="OnePlus">OnePlus</option>
        <option value="Xiaomi">Xiaomi</option>
        <option value="Realme">Realme</option>
        <option value="Vivo">Vivo</option>
        <option value="Oppo">Oppo</option>
        <option value="Motorola">Motorola</option>
        <option value="Nokia">Nokia</option>
      </select>

      {/* CONDITION */}
      <select
        name="condition"
        value={filters.condition}
        onChange={handleChange}
      >
        <option value="">Condition</option>
        <option value="New">New</option>
        <option value="Like New">Like New</option>
        <option value="Used">Used</option>
      </select>

      {/* BUDGET */}
      <select name="budget" value={filters.budget} onChange={handleChange}>
        <option value="">Budget</option>
        <option value="0-5000">0 – 5,000</option>
        <option value="5000-10000">5,000 – 10,000</option>
        <option value="10000-20000">10,000 – 20,000</option>
        <option value="20000-30000">20,000 – 30,000</option>
        <option value="30000-50000">30,000 – 50,000</option>
        <option value="50000+">50,000+</option>
      </select>
    </aside>
  );
}
