import { useState } from "react";
import { Link } from "react-router-dom";
import { listings } from "../../data/data";
import ListingCard from "../../components/cards/ListingCard";
import FilterSidebar from "../../components/filters/FilterSidebar";
import "./Home.css";

export default function Home() {
  const [filters, setFilters] = useState({});

  const filtered = listings.filter((item) => {
    if (filters.fuel && item.fuel !== filters.fuel) return false;
    return true;
  });

  return (
    <div style={{ display: "flex" }}>
      <FilterSidebar category="Cars" onFilter={setFilters} />

      <div className="home-wrapper">
        <h2 className="home-title">Fresh Recommendations</h2>

        <div className="list-wrapper">
          {filtered.map((item) => (
            <Link key={item.id} to={`/product/${item.id}`} className="listing-link">
              <ListingCard item={item} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
