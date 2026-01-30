import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

import {
  faCar,
  faMotorcycle,
  faTv,
  faMobileScreen,
  faShirt,
  faDog,
  faFootball,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ListingCard from "../../components/cards/ListingCard";
import Footer from "../../components/footer/Footer";

import api from "../../services/api";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";

import "./Home.css";

// Category carousel data
const categories = [
  {
    name: "Cars",
    img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
  },
  {
    name: "Bikes",
    img: "https://images.unsplash.com/photo-1518655048521-f130df041f66",
  },
  {
    name: "Electronics",
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475",
  },
  {
    name: "Mobiles",
    img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
  },
  {
    name: "Fashion",
    img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d",
  },
  {
    name: "Pets",
    img: "https://images.unsplash.com/photo-1517849845537-4d257902454a",
  },
  {
    name: "Sports & Hobbies",
    img: "https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf",
  },
];

// Icon categories for quick filters
const iconCategories = [
  { name: "Cars", icon: faCar },
  { name: "Bikes", icon: faMotorcycle },
  { name: "Electronics", icon: faTv },
  { name: "Mobiles", icon: faMobileScreen },
  { name: "Fashion", icon: faShirt },
  { name: "Pets", icon: faDog },
  { name: "Sports & Hobbies", icon: faFootball },
];

export default function Home() {
  const location = useLocation();

  const [allListings, setAllListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [loading, setLoading] = useState(false);

  // Filter state variables
  const [selectedDays, setSelectedDays] = useState(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showPriceFilter, setShowPriceFilter] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const carouselRef = useRef(null);

  // Fetch approved listings from backend
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const res = await api.get("/listings");
        // Only approved listings are returned by backend
        setAllListings(res.data);

        const shuffled = [...res.data].sort(() => 0.5 - Math.random());
        setFilteredListings(shuffled);
      } catch {
        toast.error("Failed to load listings from server");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  // Apply search and city filters from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const city = params.get("city");
    const q = params.get("q");
    const days = params.get("days");

    let filtered = [...allListings];

    if (city) {
      filtered = filtered.filter(
        (item) =>
          item.location &&
          item.location.toLowerCase().includes(city.toLowerCase()),
      );
    }

    if (q) {
      filtered = filtered.filter((item) => {
        const searchText = q.toLowerCase();

        return (
          item.title?.toLowerCase().includes(searchText) ||
          item.category?.toLowerCase().includes(searchText) ||
          item.subcategory?.toLowerCase().includes(searchText) ||
          item.description?.toLowerCase().includes(searchText)
        );
      });
    }

    // Filter by date range
    if (days) {
      const daysNum = parseInt(days);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysNum);

      filtered = filtered.filter((item) => {
        const createdDate = new Date(item.created_at);
        return createdDate >= cutoffDate;
      });

      setSelectedDays(daysNum);
    } else {
      setSelectedDays(null);
    }

    setFilteredListings(filtered);
    setCurrentPage(1);
  }, [location.search, allListings]);

  // Apply price range filter
  const applyPriceFilter = () => {
    let filtered = [...allListings];

    // Apply existing filters (search, city, category)
    const params = new URLSearchParams(location.search);
    const city = params.get("city");
    const q = params.get("q");

    if (city) {
      filtered = filtered.filter(
        (item) =>
          item.location &&
          item.location.toLowerCase().includes(city.toLowerCase()),
      );
    }

    if (q) {
      filtered = filtered.filter((item) => {
        const searchText = q.toLowerCase();
        return (
          item.title?.toLowerCase().includes(searchText) ||
          item.category?.toLowerCase().includes(searchText) ||
          item.subcategory?.toLowerCase().includes(searchText) ||
          item.description?.toLowerCase().includes(searchText)
        );
      });
    }

    // Apply price filter
    if (minPrice !== "" || maxPrice !== "") {
      filtered = filtered.filter((item) => {
        const min = minPrice !== "" ? parseFloat(minPrice) : 0;
        const max = maxPrice !== "" ? parseFloat(maxPrice) : Infinity;
        return item.price >= min && item.price <= max;
      });
    }

    setFilteredListings(filtered);
    setCurrentPage(1);
    setShowPriceFilter(false);
  };

  // Handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);

    const filtered = allListings.filter((item) => item.category === category);
    setFilteredListings(filtered);
  };

  // Sort listings based on selected option
  const getSortedListings = () => {
    let sorted = [...filteredListings];

    if (sortBy === "recent") {
      sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortBy === "oldest") {
      sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (sortBy === "price_high") {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortBy === "price_low") {
      sorted.sort((a, b) => a.price - b.price);
    }

    return sorted;
  };

  const sortedListings = getSortedListings();

  // Pagination calculations

  const totalPages = Math.ceil(sortedListings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentListings = sortedListings.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Auto-scroll category carousel
  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        carouselRef.current.scrollLeft += 1;

        if (
          carouselRef.current.scrollLeft + carouselRef.current.clientWidth >=
          carouselRef.current.scrollWidth
        ) {
          carouselRef.current.scrollLeft = 0;
        }
      }
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="home-page">
        <div className="main-layout no-sidebar">
          <section className="listings">
            {/* IMAGE CAROUSEL */}
            <div className="category-carousel" ref={carouselRef}>
              {categories.map((cat) => (
                <div
                  key={cat.name}
                  className={`carousel-card ${
                    selectedCategory === cat.name ? "active" : ""
                  }`}
                  onClick={() => handleCategorySelect(cat.name)}
                >
                  <img src={cat.img} alt={cat.name} />

                  {/* Overlay with category name */}
                  <div className="carousel-overlay">
                    <span>{cat.name}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* ICON STRIP (HARD CODED) */}
            <div className="category-strip">
              {iconCategories.map((cat) => (
                <div
                  key={cat.name}
                  className={`strip-item ${
                    selectedCategory === cat.name ? "active" : ""
                  }`}
                  onClick={() => handleCategorySelect(cat.name)}
                >
                  <FontAwesomeIcon icon={cat.icon} className="strip-icon" />
                  <span>{cat.name}</span>
                </div>
              ))}
            </div>

            {/* TITLE + SORT */}
            <div className="title-row">
              <h2 className="home-title">
                {selectedCategory
                  ? `${selectedCategory} Ads`
                  : "Fresh Recommendations"}
              </h2>

              <div className="filter-controls">
                <select
                  className="sort-dropdown"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="recent">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="price_low">Price: Low to High</option>
                </select>

                {/* PRICE FILTER BUTTON */}
                <button
                  className="price-filter-btn"
                  onClick={() => setShowPriceFilter(!showPriceFilter)}
                >
                  <i className="fa-solid fa-indian-rupee-sign"></i> Price Filter
                </button>

                {/* PRICE FILTER INPUTS */}
                {showPriceFilter && (
                  <div className="price-filter-container">
                    <input
                      type="number"
                      placeholder="Min Price"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="price-input"
                    />
                    <input
                      type="number"
                      placeholder="Max Price"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="price-input"
                    />
                    <button
                      className="apply-filter-btn"
                      onClick={applyPriceFilter}
                    >
                      Apply Filter
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="divider" />

            {/* LOADER */}
            {loading ? (
              <Loader />
            ) : currentListings.length === 0 ? (
              <p className="no-results">No ads found for selected filters.</p>
            ) : (
              <>
                <div className="listings-grid compact">
                  {currentListings.map((item) => (
                    <ListingCard key={item.id} item={item} />
                  ))}
                </div>

                {/* PAGINATION */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => goToPage(currentPage - 1)}
                    >
                      Prev
                    </button>

                    {[...Array(totalPages)].map((_, index) => {
                      const page = index + 1;
                      return (
                        <button
                          key={page}
                          className={page === currentPage ? "active" : ""}
                          onClick={() => goToPage(page)}
                        >
                          {page}
                        </button>
                      );
                    })}

                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => goToPage(currentPage + 1)}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>

      <Footer />
    </>
  );
}
