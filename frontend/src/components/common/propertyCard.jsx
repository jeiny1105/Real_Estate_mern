import {
  FaBed,
  FaBath,
  FaRulerCombined,
  FaMapMarkerAlt,
  FaChevronRight,
  FaEye,
  FaHeart,
  FaRegHeart
} from "react-icons/fa";

import api from "../../app/apiClient";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";

const PropertyCard = ({ property, navigate, wishlistIds, onWishlistToggle }) => {

  const { user } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  useEffect(() => {
    if (!wishlistIds) return;

    setIsWishlisted(wishlistIds.includes(property._id));
  }, [wishlistIds, property._id]);

  const toggleWishlist = async () => {
  if (!user) {
    alert("Please login first");
    return;
  }

  try {
    setLoadingWishlist(true);

    if (isWishlisted) {
      await api.delete(`/wishlist/${property._id}`);
      setIsWishlisted(false);

      // 🔥 update parent
      onWishlistToggle(property._id, false);

    } else {
      await api.post(`/wishlist/${property._id}`);
      setIsWishlisted(true);

      // 🔥 update parent
      onWishlistToggle(property._id, true);
    }

  } catch (err) {
    console.error(err);
  } finally {
    setLoadingWishlist(false);
  }
};

  const imageUrl =
    property.images && property.images.length > 0
      ? `http://localhost:3000/uploads/${property.images[0]}`
      : "https://placehold.co/600x400?text=DreamHaven";

  /* PROPERTY TYPE CHECKS */

  const isResidential = ["Apartment", "Villa", "Cottage", "House"].includes(
    property.propertyType
  );

  const isPlot = property.propertyType === "Plot";

  const isCommercial = property.propertyType === "Commercial";

  return (
    <div
      className="group bg-[#111827] border border-white/5 rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-purple-500/50 hover:shadow-[0_20px_50px_rgba(139,92,246,0.15)]"
    >

      {/* IMAGE SECTION */}

      <div className="relative h-64 overflow-hidden">

        {/* ❤️ Wishlist Button */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={toggleWishlist}
            disabled={loadingWishlist}
            className="bg-black/40 backdrop-blur p-2 rounded-full hover:scale-110 transition"
          >
            {isWishlisted ? (
              <FaHeart className="text-red-500" />
            ) : (
              <FaRegHeart className="text-white" />
            )}
          </button>
        </div>

        <img
          src={imageUrl}
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Overlay gradient */}

        <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/90 via-transparent to-transparent" />

        {/* Property Type Badge */}

        <div className="absolute top-4 left-4">
          <span className="bg-purple-600/90 backdrop-blur-md text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-lg shadow-lg">
            {property.propertyType}
          </span>
        </div>

        {/* Featured Badge */}

        {property.isFeatured && (
          <div className="absolute top-4 right-4">
            <span className="bg-yellow-500 text-black text-[10px] uppercase font-bold px-3 py-1.5 rounded-lg">
              Featured
            </span>
          </div>
        )}

        {/* Price */}

        <div className="absolute bottom-4 left-4">
          <p className="text-white text-2xl font-black tracking-tight">
            ₹{property.price?.toLocaleString("en-IN")}
          </p>
        </div>

        {/* Views */}

        <div className="absolute bottom-4 right-4 flex items-center gap-1 text-xs bg-black/40 backdrop-blur px-2 py-1 rounded text-white">
          <FaEye className="text-purple-400" />
          {property.views || 0}
        </div>

      </div>

      {/* CONTENT */}

      <div className="p-5">

        {/* TITLE + LOCATION */}

        <div className="mb-4">

          <h3 className="text-white text-lg font-bold leading-tight line-clamp-1 group-hover:text-purple-400 transition-colors">
            {property.title}
          </h3>

          <p className="flex items-center text-slate-400 text-xs mt-2 uppercase tracking-wider font-medium">
            <FaMapMarkerAlt className="mr-1.5 text-purple-500" />
            {property.location}
          </p>

        </div>

        {/* PROPERTY SPECS */}

        <div className="grid grid-cols-3 gap-2 py-4 border-y border-white/5 mb-5">

          {/* RESIDENTIAL */}

          {isResidential && (
            <>
              <div className="flex flex-col items-center gap-1">
                <span className="text-slate-500 text-[10px] uppercase font-bold">
                  Beds
                </span>

                <div className="flex items-center gap-1.5 text-white font-semibold">
                  <FaBed className="text-purple-400 text-sm" />
                  <span>{property.residential?.bedrooms || "0"}</span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-1 border-x border-white/5">
                <span className="text-slate-500 text-[10px] uppercase font-bold">
                  Baths
                </span>

                <div className="flex items-center gap-1.5 text-white font-semibold">
                  <FaBath className="text-purple-400 text-sm" />
                  <span>{property.residential?.bathrooms || "0"}</span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-1">
                <span className="text-slate-500 text-[10px] uppercase font-bold">
                  Area
                </span>

                <div className="flex items-center gap-1.5 text-white font-semibold text-xs">
                  <FaRulerCombined className="text-purple-400" />
                  <span>
                    {property.residential?.builtUpArea || "0"} sqft
                  </span>
                </div>
              </div>
            </>
          )}

          {/* PLOT */}

          {isPlot && (
            <>
              <div className="flex flex-col items-center gap-1">
                <span className="text-slate-500 text-[10px] uppercase font-bold">
                  Area
                </span>

                <div className="flex items-center gap-1.5 text-white font-semibold text-xs">
                  <FaRulerCombined className="text-purple-400" />
                  <span>
                    {property.land?.plotArea || "0"}{" "}
                    {property.land?.areaUnit || "sqft"}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-1 border-x border-white/5">
                <span className="text-slate-500 text-[10px] uppercase font-bold">
                  Facing
                </span>

                <span className="text-white text-sm">
                  {property.land?.facing || "-"}
                </span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <span className="text-slate-500 text-[10px] uppercase font-bold">
                  Zone
                </span>

                <span className="text-white text-sm">
                  {property.land?.zoningType || "-"}
                </span>
              </div>
            </>
          )}

          {/* COMMERCIAL */}

          {isCommercial && (
            <>
              <div className="flex flex-col items-center gap-1">
                <span className="text-slate-500 text-[10px] uppercase font-bold">
                  Area
                </span>

                <div className="flex items-center gap-1.5 text-white font-semibold text-xs">
                  <FaRulerCombined className="text-purple-400" />
                  <span>
                    {property.commercial?.areaSize || "0"} sqft
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-1 border-x border-white/5">
                <span className="text-slate-500 text-[10px] uppercase font-bold">
                  Floors
                </span>

                <span className="text-white text-sm">
                  {property.commercial?.floors || "0"}
                </span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <span className="text-slate-500 text-[10px] uppercase font-bold">
                  Parking
                </span>

                <span className="text-white text-sm">
                  {property.commercial?.parkingSpaces || "0"}
                </span>
              </div>
            </>
          )}

        </div>

        {/* ACTION BUTTON */}

        <button
          onClick={() => navigate(`/properties/${property._id}`)}
          className="group/btn relative w-full overflow-hidden flex items-center justify-center gap-2 bg-white text-slate-950 hover:text-white transition-all duration-300 py-3 rounded-xl font-bold text-sm"
        >

          <div className="absolute inset-0 w-0 bg-gradient-to-r from-purple-600 to-pink-500 transition-all duration-300 group-hover/btn:w-full" />

          <span className="relative z-10">View Details</span>

          <FaChevronRight className="relative z-10 text-[10px] transition-transform group-hover/btn:translate-x-1" />

        </button>

      </div>
    </div>
  );
};

export default PropertyCard;