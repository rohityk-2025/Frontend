import { useState } from "react";
import "./FashionSidebar.css";

export default function FashionSidebar({ onFilterChange }) {
  const [filters, setFilters] = useState({
    location: "",
    subCategory: "",
    brand: "",
    productType: "",
    size: "",
    condition: "",
    price: "",
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
      productType: "",
      size: "",
      condition: "",
      price: "",
    };
    setFilters(cleared);
    onFilterChange(cleared);
  };

  return (
    <aside className="sidebar">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3>Fashion Filters</h3>
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
        <option value="Men">Men</option>
        <option value="Women">Women</option>
        <option value="Kids">Kids</option>
      </select>

      {/* BRAND */}
      <select name="brand" value={filters.brand} onChange={handleChange}>
        <option value="">Brand</option>
        <option value="Nike">Nike</option>
        <option value="Adidas">Adidas</option>
        <option value="Puma">Puma</option>
        <option value="Levis">Levis</option>
        <option value="Zara">Zara</option>
        <option value="H&M">H&M</option>
        <option value="Allen Solly">Allen Solly</option>
        <option value="Roadster">Roadster</option>
      </select>

      {/* PRODUCT TYPE */}
      <select
        name="productType"
        value={filters.productType}
        onChange={handleChange}
      >
        <option value="">Product Type</option>
        <option value="T-Shirts">T-Shirts</option>
        <option value="Shirts">Shirts</option>
        <option value="Jeans">Jeans</option>
        <option value="Trousers">Trousers</option>
        <option value="Dresses">Dresses</option>
        <option value="Ethnic Wear">Ethnic Wear</option>
        <option value="Footwear">Footwear</option>
        <option value="Accessories">Accessories</option>
      </select>

      {/* SIZE */}
      <select name="size" value={filters.size} onChange={handleChange}>
        <option value="">Size</option>
        <option value="XS">XS</option>
        <option value="S">S</option>
        <option value="M">M</option>
        <option value="L">L</option>
        <option value="XL">XL</option>
        <option value="XXL">XXL</option>
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

      {/* PRICE */}
      <select name="price" value={filters.price} onChange={handleChange}>
        <option value="">Price</option>
        <option value="0-500">0 – 500</option>
        <option value="500-1000">500 – 1,000</option>
        <option value="1000-2000">1,000 – 2,000</option>
        <option value="2000-5000">2,000 – 5,000</option>
        <option value="5000+">5,000+</option>
      </select>
    </aside>
  );
}
