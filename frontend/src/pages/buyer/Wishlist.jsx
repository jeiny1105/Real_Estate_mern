import React, { useEffect, useState } from "react";
import api from "../../app/apiClient";
import { useNavigate } from "react-router-dom";
import PropertyCard from "../../components/common/propertyCard";
import { FaHeartBroken } from "react-icons/fa";

function Wishlist() {
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ================= */
  const fetchWishlist = async () => {
    try {
      const res = await api.get("/wishlist");
      setWishlist(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  /* ================= REMOVE SYNC ================= */
  const handleWishlistToggle = (propertyId, isAdding) => {
    if (!isAdding) {
      setWishlist((prev) =>
        prev.filter((item) => item._id !== propertyId)
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-28">

      <h1 className="text-3xl font-bold mb-6">
        ❤️ Wishlist
      </h1>

      {loading ? (
        <div className="text-center py-20">Loading...</div>
      ) : wishlist.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-xl p-10 text-center text-slate-400">
          <FaHeartBroken className="mx-auto text-4xl mb-4" />
          No saved properties yet.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {wishlist.map((property) => (
            <PropertyCard
              key={property._id}
              property={property}
              navigate={navigate}
              wishlistIds={wishlist.map((p) => p._id)}
              onWishlistToggle={handleWishlistToggle}
            />
          ))}
        </div>
      )}

    </div>
  );
}

export default Wishlist;