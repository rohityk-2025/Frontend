import { useEffect, useState } from "react";
import api from "../../services/api";
import ListingCard from "../../components/cards/ListingCard";
import Footer from "../../components/footer/Footer";
import { toast } from "react-toastify";

export default function Favourites() {
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const res = await api.get("/favourites");

        console.log("RAW FAVOURITES RESPONSE:", res.data);

        let listings = [];

        // Very safe handling (no crash possible)
        if (Array.isArray(res.data)) {
          // If backend sends { listing: {...} }
          if (res.data.length > 0 && res.data[0].listing) {
            listings = res.data.map((fav) => fav.listing);
          }
          // If backend already sends listings directly
          else {
            listings = res.data;
          }
        }

        setFavourites(listings);
      } catch (err) {
        console.error("FAVOURITES ERROR:", err);
        toast.error("Failed to load favourites");
      }
    };

    fetchFavourites();
  }, []);

  return (
    <>
      <div className="container py-4">
        <h4 className="fw-bold mb-3">My Favourites</h4>

        {favourites.length === 0 ? (
          <p>No liked listings yet.</p>
        ) : (
          <div className="row">
            {favourites.map((item) => (
              <div
                key={item.id}
                className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
              >
                {/* Extra safety: don't render broken items */}
                {item && <ListingCard item={item} />}
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
