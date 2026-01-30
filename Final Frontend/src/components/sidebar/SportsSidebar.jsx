import { useState } from "react";
import "./CarSidebar.css";

export default function SportsSidebar({ onFilterChange }) {
  const [filters, setFilters] = useState({ location: "", budget: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearAll = () => {
    const cleared = { location: "", budget: "" };
    setFilters(cleared);
    onFilterChange(cleared);
  };

  return (
    <aside className="sidebar">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3>Sports & Hobbies Filters</h3>
        <button className="clear-btn" onClick={clearAll}>
          Clear All
        </button>
      </div>

      <select name="location" value={filters.location} onChange={handleChange}>
        <option value="">Location</option>
        <option value="Pune">Pune</option>
        <option value="Mumbai">Mumbai</option>
      </select>

      <select name="budget" value={filters.budget} onChange={handleChange}>
        <option value="">Budget</option>
        <option value="0-3000">0 – 3,000</option>
        <option value="3000-10000">3,000 – 10,000</option>
        <option value="10000-20000">10,000 – 20,000</option>
        <option value="20000+">20,000+</option>
      </select>
    </aside>
  );
}
