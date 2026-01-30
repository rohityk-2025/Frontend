import { useParams, useNavigate } from "react-router-dom";
import { listings } from "../../data";
import "./ProductDetail.css";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const listing = listings.find((l) => l.id == id);

  if (!listing) {
    return (
      <div className="product-wrapper">
        <p>Listing not found.</p>
        <button onClick={() => navigate("/")}>Back to Home</button>
      </div>
    );
  }

  return (
    <div className="product-wrapper">
      <div className="product-card">
        <img
          src={listing.image}
          alt={listing.title}
          className="product-image"
        />

        <div className="product-info">
          <h2>{listing.title}</h2>
          <h3 className="product-price">{listing.price}</h3>

          <p>
            <b>Seller:</b> {listing.owner}
          </p>
          <p>
            <b>Location:</b> {listing.location}
          </p>
          <p>
            <b>Posted:</b> {listing.date}
          </p>
          <p>
            <b>Fuel:</b> {listing.fuel || "N/A"}
          </p>

          <h4>Description</h4>
          <p>{listing.description}</p>

          <button onClick={() => navigate("/messages")}>
            Chat with Seller
          </button>
        </div>
      </div>
    </div>
  );
}
