import { useState } from "react";
import "./FurnitureSidebar.css";

export default function FurnitureSidebar({ onFilterChange }) {
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
        <h3>Furniture Filters</h3>
        <button className="clear-btn" onClick={clearAll}>Clear All</button>
      </div>

      <select name="location" value={filters.location} onChange={handleChange}>
        <option value="">Location</option>
        <option value="Pune">Pune</option>
        <option value="Mumbai">Mumbai</option>
      </select>

      <select name="budget" value={filters.budget} onChange={handleChange}>
        <option value="">Budget</option>
        <option value="0-5000">0 – 5,000</option>
        <option value="5000-15000">5,000 – 15,000</option>
        <option value="15000-30000">15,000 – 30,000</option>
        <option value="30000+">30,000+</option>
      </select>
    </aside>
  );
}
