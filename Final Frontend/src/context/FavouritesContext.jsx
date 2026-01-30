import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const FavouritesContext = createContext();

export function FavouritesProvider({ children }) {
  const [favourites, setFavourites] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const token = localStorage.getItem("token"); // watch token

  // LOAD FAVOURITES WHEN USER LOGS IN / TOKEN CHANGES
  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        if (!token) {
          // USER LOGGED OUT → CLEAR FAVOURITES
          setFavourites([]);
          setLoaded(true);
          return;
        }

        const res = await api.get("/favourites");

        console.log("FAV CONTEXT RESPONSE:", res.data);

        let listings = [];

        if (Array.isArray(res.data)) {
          if (res.data[0]?.listing) {
            listings = res.data.map((fav) => fav.listing);
          } else {
            listings = res.data;
          }
        }

        setFavourites(listings);
        setLoaded(true);
      } catch (err) {
        console.error("FAV CONTEXT ERROR:", err);
        setFavourites([]); // reset on error
        setLoaded(true);
      }
    };

    fetchFavourites();
  }, [token]); // VERY IMPORTANT: re-run when user changes

  // ADD TO FAVOURITES
  const addFavourite = async (listingId) => {
    try {
      await api.post("/favourites", { listingId });

      // reload favourites after add
      const res = await api.get("/favourites");

      let listings = [];
      if (res.data[0]?.listing) {
        listings = res.data.map((fav) => fav.listing);
      } else {
        listings = res.data;
      }

      setFavourites(listings);
    } catch (err) {
      console.error("ADD FAV ERROR:", err);
    }
  };

  // REMOVE FROM FAVOURITES
  const removeFavourite = async (listingId) => {
    try {
      await api.delete(`/favourites/${listingId}`);
      setFavourites((prev) => prev.filter((item) => item.id !== listingId));
    } catch (err) {
      console.error("REMOVE FAV ERROR:", err);
    }
  };

  const isFavourite = (id) => {
    return favourites.some((item) => item.id === id);
  };

  // WAIT UNTIL CONTEXT IS READY
  if (!loaded) {
    return children; // or spinner
  }

  return (
    <FavouritesContext.Provider
      value={{
        favourites,
        addFavourite,
        removeFavourite,
        isFavourite,
      }}
    >
      {children}
    </FavouritesContext.Provider>
  );
}

export function useFavourites() {
  return useContext(FavouritesContext);
}
