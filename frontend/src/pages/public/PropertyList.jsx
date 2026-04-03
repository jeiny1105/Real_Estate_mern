import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../app/apiClient";
import {
  FaSearch,
  FaFilter,
  FaRegTimesCircle
} from "react-icons/fa";
import PropertyCard from "../../components/common/propertyCard";

const Properties = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState([]);

  const latestSearchRef = useRef("");

  /* ================= SEARCH ================= */
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [recentSearches, setRecentSearches] = useState([]);

  /* ================= AUTOCOMPLETE ================= */
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  /* ================= FILTER STATE ================= */
  const [filters, setFilters] = useState({
    type: "",
    minPrice: "",
    maxPrice: "",
    sort: "",
  });

  const [debouncedFilters, setDebouncedFilters] = useState({
    search: searchParams.get("search") || "",
    type: "",
    minPrice: "",
    maxPrice: "",
    sort: "",
  });

  /* ================= SEARCH DEBOUNCE ================= */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  /* ================= FILTER DEBOUNCE ================= */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters({
        search: debouncedSearch,
        ...filters,
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [debouncedSearch, filters]);

  useEffect(() => {
    const stored = localStorage.getItem("recentSearches");
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
  const fetchWishlist = async () => {
    try {
      const res = await api.get("/wishlist");
      const ids = res.data.data.map((item) => item._id);
      setWishlistIds(ids);
    } catch (err) {
      console.error(err);
    }
  };

  fetchWishlist();
}, []);

const handleWishlistToggle = (propertyId, isAdding) => {
  setWishlistIds((prev) => {
    if (isAdding) {
      return [...prev, propertyId];
    } else {
      return prev.filter((id) => id !== propertyId);
    }
  });
};

  /* ================= AUTOCOMPLETE FETCH ================= */
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (search.trim() === "") {
        setSuggestions([]);
        setActiveIndex(-1);
        return;
      }

      try {
        const res = await api.get(`/properties/suggestions?q=${search}`);
        setSuggestions(res.data.data);
        setShowDropdown(true);
        setActiveIndex(-1);
      } catch (err) {
        console.error(err);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  /* ================= FETCH PROPERTIES ================= */
  const fetchProperties = async () => {
    try {
      setLoading(true);

      const { search, type, minPrice, maxPrice, sort } = debouncedFilters;

      if (search && search.trim() !== "") {
        let updated = [search, ...recentSearches.filter((s) => s !== search)];
        updated = updated.slice(0, 5); // keep last 5

        setRecentSearches(updated);
        localStorage.setItem("recentSearches", JSON.stringify(updated));
      }

      const params = {};

      if (search) params.search = search;
      if (type) params.propertyType = type;

      if (minPrice !== "") params.minPrice = Number(minPrice);
      if (maxPrice !== "") params.maxPrice = Number(maxPrice);
      if (sort) params.sort = sort;

      const key = JSON.stringify(params);
      latestSearchRef.current = key;

      const res = await api.get("/properties", { params });

      if (latestSearchRef.current === key) {
        setProperties(res.data?.data || []);
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [debouncedFilters]);

  /* ================= CLEAR ================= */
  const clearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setFilters({
      type: "",
      minPrice: "",
      maxPrice: "",
      sort: "",
    });
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans antialiased">

      {/* HEADER */}
      <header className="bg-white border-b border-slate-100 pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <span className="text-[10px] font-black tracking-[0.4em] text-blue-600 uppercase block">
                Executive Portfolios
              </span>
              <h1 className="text-4xl md:text-5xl font-light tracking-tight text-slate-900">
                Premium <span className="font-serif italic text-blue-700">Listings</span>
              </h1>
            </div>

            {!loading && (
              <div className="bg-slate-50 px-5 py-2.5 rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                  {properties.length} Properties Found
                </p>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MAIN */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* SIDEBAR */}
          <aside className="lg:w-80 space-y-10 lg:sticky lg:top-32 h-fit">

            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3 text-slate-900 font-bold uppercase tracking-widest text-xs">
                <FaFilter className="text-blue-600" /> Filter Gallery
              </div>

              {(search || Object.values(filters).some(Boolean)) && (
                <button
                  onClick={clearFilters}
                  className="text-[10px] text-red-500 font-black uppercase hover:underline"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* SEARCH */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase">Search</label>
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />

                <input
                  type="text"
                  placeholder="Search city or locality..."
                  value={search}
                  onFocus={() => setShowDropdown(true)}  
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setShowDropdown(true);
                  }}
                  onKeyDown={(e) => {
                    if (!suggestions.length) return;

                    if (e.key === "ArrowDown") {
                      setActiveIndex((prev) =>
                        prev < suggestions.length - 1 ? prev + 1 : prev
                      );
                    }

                    if (e.key === "ArrowUp") {
                      setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
                    }

                    if (e.key === "Enter" && activeIndex >= 0) {
                      const item = suggestions[activeIndex];
                      const value =
                        item.title || item.city || item.locality;

                      setSearch(value);
                      setDebouncedSearch(value);
                      setShowDropdown(false);
                    }
                  }}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                  className="w-full bg-white border rounded-[18px] py-4 pl-12 pr-4 outline-none text-sm"
                />

                {/* DROPDOWN */}
                {showDropdown && (
                  <div className="absolute z-50 bg-white border w-full rounded-xl mt-2 shadow-lg">

                    {/* 🔥 RECENT SEARCHES */}
                    {search.trim() === "" && recentSearches.length > 0 && (
                      <>
                        <div className="px-4 py-2 text-xs text-gray-400 uppercase">
                          Recent Searches
                        </div>

                        {recentSearches.map((item, index) => (
                          <div
                            key={index}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                            onMouseDown={() => {
                              setSearch(item);
                              setDebouncedSearch(item);
                              setShowDropdown(false);
                            }}
                          >
                            {item}
                          </div>
                        ))}
                      </>
                    )}

                    {/* 🔥 SUGGESTIONS */}
                    {suggestions.map((item, index) => {
                      const value = item.title || item.city || item.locality;

                      return (
                        <div
                          key={index}
                          className={`px-4 py-2 cursor-pointer text-sm ${index === activeIndex
                              ? "bg-gray-200"
                              : "hover:bg-gray-100"
                            }`}
                          onMouseDown={() => {
                            setSearch(value);
                            setDebouncedSearch(value);
                            setShowDropdown(false);
                          }}
                        >
                          {value}
                        </div>
                      );
                    })}

                  </div>
                )}
              </div>
            </div>

            {/* TYPE */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase">Property Type</label>
              <select
                value={filters.type}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, type: e.target.value }))
                }
                className="w-full bg-white border rounded-[18px] py-4 px-5 text-sm"
              >
                <option value="">All</option>
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>

            {/* MAX PRICE */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase">Max Price</label>
              <select
                value={filters.maxPrice}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))
                }
                className="w-full bg-white border rounded-[18px] py-4 px-5 text-sm"
              >
                <option value="">Any</option>
                <option value="5000000">₹50L</option>
                <option value="10000000">₹1Cr</option>
                <option value="20000000">₹2Cr</option>
              </select>
            </div>

            {/* MIN PRICE */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase">Min Price</label>
              <select
                value={filters.minPrice}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, minPrice: e.target.value }))
                }
                className="w-full bg-white border rounded-[18px] py-4 px-5 text-sm"
              >
                <option value="">Any</option>
                <option value="1000000">₹10L</option>
                <option value="2000000">₹20L</option>
                <option value="5000000">₹50L</option>
              </select>
            </div>

            {/* SORT */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase">
                Sort By
              </label>
              <select
                value={filters.sort}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, sort: e.target.value }))
                }
                className="w-full bg-white border rounded-[18px] py-4 px-5 text-sm"
              >
                <option value="">Default</option>
                <option value="price_asc">Price Low → High</option>
                <option value="price_desc">Price High → Low</option>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>

          </aside>

          {/* LIST */}
          <main className="flex-1">
            {loading ? (
              <div className="text-center py-40">Loading...</div>
            ) : properties.length === 0 ? (
              <div className="text-center py-40">
                <FaRegTimesCircle className="mx-auto text-3xl text-slate-300" />
                <p>No properties found</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                {properties.map((property) => (
                  <PropertyCard
                    key={property._id}
                    property={property}
                    navigate={navigate}
                    wishlistIds={wishlistIds}
                    onWishlistToggle={handleWishlistToggle}
                  />
                ))}
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
};

export default Properties;