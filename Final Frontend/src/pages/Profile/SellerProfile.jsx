import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import "./SellerProfile.css";

export default function SellerProfile() {
  const { id } = useParams(); // seller id
  const navigate = useNavigate();

  const [seller, setSeller] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        // Fetch seller info
        const userRes = await api.get(`/users/${id}`);
        setSeller(userRes.data);

        // Fetch seller listings
        const listingsRes = await api.get(`/listings/user/${id}`);
        setListings(listingsRes.data);
      } catch (err) {
        console.error("SELLER PROFILE ERROR:", err);
        toast.error("Failed to load seller profile");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchSeller();
  }, [id, navigate]);

  if (loading) return <Loader />;
  if (!seller) return null;

  const joinedDate = seller.created_at
    ? new Date(seller.created_at).toLocaleDateString()
    : null;

  function ListingCard({ item }) {
    console.log("SELLER LISTING RAW DATA:", item);

    // Safe image handling (prepend backend path if needed)

    let rawImage = null;

    if (item.images && item.images.length > 0) {
      rawImage = item.images[0]; // first image from array
    } else if (item.image) {
      rawImage = item.image; // fallback if single image field exists
    }

    const imageSrc = rawImage
      ? rawImage.startsWith("/uploads")
        ? `http://localhost:8080${rawImage}`
        : rawImage
      : "no-image.png";

    return (
      <div className="seller-listing-card">
        <img src={imageSrc ? imageSrc : "no-image.png"} alt={item.title} />

        <div className="listing-info">
          <h4>{item.title}</h4>
          <p className="price">₹ {item.price}</p>

          <button
            className="view-btn"
            onClick={() => navigate(`/product/${item.id}`)}
          >
            <i className="fa-solid fa-eye"></i> View
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="seller-profile-container">
      {/* LEFT SIDE */}
      <div className="seller-left">
        <div className="seller-avatar-wrapper">
          <img
            src={
              seller.avatar
                ? seller.avatar.startsWith("/uploads")
                  ? `http://localhost:8080${seller.avatar}`
                  : seller.avatar
                : "/profile.png"
            }
            alt="seller"
            className="seller-big-img"
          />
        </div>

        <h2 className="seller-name">
          <i className="fa-solid fa-user"></i>
          <span>
            {seller.first_name} {seller.last_name}{" "}
          </span>
        </h2>

        <p className="seller-email">
          <i className="fa-solid fa-envelope"></i>
          <span> {seller.email}</span>
        </p>

        {joinedDate && (
          <p className="seller-joined">
            <i className="fa-solid fa-calendar-days"></i>
            Joined on {joinedDate}
          </p>
        )}

        <div className="seller-stats">
          <div>
            <strong>{listings.length}</strong>
            <span> Listings</span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="seller-right">
        <h3 className="seller-listings-title">Listings by Seller</h3>

        {listings.length === 0 ? (
          <div className="no-listing-box">
            <h3>No listings yet</h3>
          </div>
        ) : (
          <div className="listing-grid">
            {listings.map((item) => (
              <ListingCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
