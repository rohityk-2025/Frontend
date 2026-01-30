import { useNavigate } from "react-router-dom";
import "./ListingCard.css";
import { useFavourites } from "../../context/FavouritesContext";

export default function ListingCard({ item }) {
  const navigate = useNavigate();
  const { favourites, addFavourite, removeFavourite } = useFavourites();

  const isLiked = favourites.some((fav) => fav.id === item.id);

  const handleLike = (e) => {
    e.stopPropagation();
    if (isLiked) removeFavourite(item.id);
    else addFavourite(item.id);
  };

  const city =
    item.location?.split(",")[1]?.trim() || item.location || "Unknown";

  const imageSrc = item.image
    ? item.image.startsWith("/uploads")
      ? `http://localhost:8080${item.image}`
      : item.image
    : "/no-image.png";

  return (
    <div className="olx-card" onClick={() => navigate(`/product/${item.id}`)}>
      {/* IMAGE */}
      <div className="card-img">
        <img src={imageSrc || "No-image1.png"} alt={item.title} />

        <div className={`fav ${isLiked ? "active" : ""}`} onClick={handleLike}>
          <i
            className={isLiked ? "fa-solid fa-heart" : "fa-regular fa-heart"}
          ></i>
        </div>
      </div>

      {/* BODY */}
      <div className="card-body">
        {/* MAIN INFO */}
        <div className="main-info">
          <div className="price">₹ {item.price}</div>
          <div className="title-1">{item.title}</div>
          <div className="subtitle-1">
            {" "}
            ‣ {item.subcategory || item.category}
          </div>

          <div className="year-row">
            <i className="fa-regular fa-calendar"></i>
            <span>{item.year || "N/A"} </span>
          </div>
        </div>

        {/* EXTRA INFO (VERTICAL STACK) */}
        <div className="info-box">
          <div className="info-item1">{city} </div>
          <div className="info-item1">
            {item.created_at
              ? new Date(item.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : ""}
          </div>
          <div className="info-item1">
            {item.created_at
              ? new Date(item.created_at).toLocaleDateString()
              : ""}
          </div>
        </div>
      </div>
    </div>
  );
}
