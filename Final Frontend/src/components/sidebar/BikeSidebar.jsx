import { useState } from "react";
import "./BikeSidebar.css";

export default function BikeSidebar({ onFilterChange }) {
  const [filters, setFilters] = useState({
    brand: "",
    model: "",
    year: "",
    fuel: "",
    kmDriven: "",
    owners: "",
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
      brand: "",
      model: "",
      year: "",
      fuel: "",
      kmDriven: "",
      owners: "",
    };
    setFilters(cleared);
    onFilterChange(cleared);
  };

  // YEAR OPTIONS 1990 → 2026
  const years = [];
  for (let y = 2026; y >= 1990; y--) {
    years.push(y);
  }

  return (
    <aside className="sidebar">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3>Bike Filters</h3>
        <button className="clear-btn" onClick={clearAll}>
          Clear All
        </button>
      </div>

      {/* BRAND */}
      <select name="brand" value={filters.brand} onChange={handleChange}>
        <option value="">Brand</option>
        <option value="Hero">Hero</option>
        <option value="Honda">Honda</option>
        <option value="Bajaj">Bajaj</option>
        <option value="TVS">TVS</option>
        <option value="Royal Enfield">Royal Enfield</option>
        <option value="Yamaha">Yamaha</option>
        <option value="Suzuki">Suzuki</option>
        <option value="KTM">KTM</option>
      </select>

      {/* MODEL */}
      <select name="model" value={filters.model} onChange={handleChange}>
        <option value="">Model</option>
        <option value="Splendor">Splendor</option>
        <option value="Pulsar">Pulsar</option>
        <option value="Apache">Apache</option>
        <option value="FZ">FZ</option>
        <option value="Classic 350">Classic 350</option>
        <option value="Duke 200">Duke 200</option>
        <option value="Activa">Activa</option>
        <option value="Jupiter">Jupiter</option>
      </select>

      {/* YEAR */}
      <select name="year" value={filters.year} onChange={handleChange}>
        <option value="">Year</option>
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>

      {/* FUEL */}
      <select name="fuel" value={filters.fuel} onChange={handleChange}>
        <option value="">Fuel</option>
        <option value="Petrol">Petrol</option>
        <option value="Electric">Electric</option>
      </select>

      {/* KM DRIVEN */}
      <select name="kmDriven" value={filters.kmDriven} onChange={handleChange}>
        <option value="">KM Driven</option>
        <option value="0-25000">0 – 25,000</option>
        <option value="25000-50000">25,000 – 50,000</option>
        <option value="50000-75000">50,000 – 75,000</option>
        <option value="75000-100000">75,000 – 1,00,000</option>
        <option value="100000-125000">1,00,000 – 1,25,000</option>
        <option value="125000-150000">1,25,000 – 1,50,000</option>
        <option value="150000-175000">1,50,000 – 1,75,000</option>
        <option value="175000-200000">1,75,000 – 2,00,000</option>
        <option value="200000+">2,00,000+</option>
      </select>

      {/* OWNERS */}
      <select name="owners" value={filters.owners} onChange={handleChange}>
        <option value="">No. of Owners</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="4+">More than 4</option>
      </select>
    </aside>
  );
}
