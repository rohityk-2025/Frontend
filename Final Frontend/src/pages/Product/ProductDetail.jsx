//

import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../services/api";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import "./ProductDetail.css";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch single listing
  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/listings/${id}`);
        setListing(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  if (loading) return <Loader />;

  if (!listing) {
    return (
      <div className="product-wrapper">
        <p>Listing not found.</p>
        <button onClick={() => navigate("/")}>Back to Home</button>
      </div>
    );
  }

  // Prepare image URLs (prepend backend path if necessary)
  const images =
    listing.images && listing.images.length > 0
      ? listing.images.map((img) =>
          img.startsWith("/uploads") ? `http://localhost:8080${img}` : img,
        )
      : ["/no-image.png"];

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Display only city portion of location
  const cityOnly = listing.location
    ? listing.location.split(",")[1]?.trim()
    : "Unknown";

  // Start chat helper (used by chat & make-offer buttons)
  const startChat = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login to chat with seller");
        navigate("/login");
        return;
      }

      // API request: start or fetch chat
      const res = await api.post("/messages/start", {
        listingId: listing.id,
        sellerId: listing.seller?.id || listing.seller_id,
      });

      const { chatId } = res.data;

      // Navigate to messages page and open the created chat
      navigate("/messages", {
        state: { chatId },
      });
    } catch (err) {
      console.error("START CHAT ERROR:", err);
      toast.error("Failed to start chat with seller");
    }
  };

  return (
    <div className="product-page">
      {/* IMAGE SECTION */}
      <div className="image-section">
        <button className="close-btn" onClick={() => navigate("/")}>
          <i className="fa-solid fa-xmark"></i>
        </button>

        {images.length > 1 && (
          <button className="arrow left-arrow" onClick={prevImage}>
            <i className="fa-solid fa-chevron-left"></i>
          </button>
        )}

        <img src={images[currentIndex]} alt={listing.title} />

        {images.length > 1 && (
          <button className="arrow right-arrow" onClick={nextImage}>
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        )}
      </div>

      {/* MAIN CONTENT */}
      <div className="product-container">
        {/* LEFT SIDE */}
        <div className="left-panel mt-2">
          <div className="detail-card">
            <h2 className="product-title">{listing.title}</h2>
            <p className="category-line">
              {listing.category} / {listing.subcategory}
            </p>
          </div>

          <div className="detail-card">
            <h3>Overview</h3>

            <div className="overview-grid">
              <div>
                <i className="fa-solid fa-calendar"></i>
                <span>{listing.year || "N/A"}</span>
              </div>

              <div>
                <i className="fa-solid fa-location-dot"></i>
                <span>{cityOnly}</span>
              </div>

              <div>
                <i className="fa-solid fa-calendar-days"></i>
                <span>
                  {listing.created_at
                    ? new Date(listing.created_at).toLocaleDateString()
                    : "Recently"}
                </span>
              </div>

              <div>
                <i className="fa-solid fa-user"></i>
                <span>
                  {listing.seller?.name || listing.seller_name || "Seller"}
                </span>
              </div>
            </div>
          </div>

          <div className="detail-card">
            <h3>Description</h3>
            <p>{listing.description}</p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="right-panel mt-2">
          {/* PRICE + OFFER */}
          <div className="price-card">
            <h2 className="price">₹ {listing.price}</h2>

            {/* Make offer also opens chat */}
            <button className="offer-btn" onClick={startChat}>
              Make Offer
            </button>
          </div>

          {/* SELLER CARD */}
          <div className="seller-card">
            <div className="seller-info">
              <i className="fa-solid fa-circle-user"></i>
              <div>
                <span
                  className="seller-link"
                  onClick={() =>
                    navigate(
                      `/seller/${listing.seller?.id || listing.seller_id}`,
                    )
                  }
                  style={{
                    cursor: "pointer",
                    color: "#4f46e5",
                    fontWeight: "600",
                  }}
                >
                  {listing.seller?.name || listing.seller_name || "Seller"}
                </span>

                <p className="seller-meta">Member since recently</p>
              </div>
            </div>

            {/* Chat button */}
            <button className="chat-btn" onClick={startChat}>
              <i className="fa-solid fa-comment-dots"></i> Chat with seller
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
