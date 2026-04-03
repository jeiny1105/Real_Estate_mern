import React, { useEffect, useState } from "react";
import {
  FaEdit,
  FaTrashAlt,
  FaEye,
  FaSearch,
  FaPlus,
} from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import api from "../../app/apiClient";

const MyListings = () => {
  const navigate = useNavigate();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Filters
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [status, setStatus] = useState("");

  // 🔥 Debounce
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  /* 🔥 Fetch Listings */
  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        setLoading(true);

        const params = {};

        if (debouncedSearch) params.search = debouncedSearch;
        if (city) params.city = city;
        if (status) params.status = status;

        const res = await api.get("/properties/my", { params });

        setListings(res.data.data);
      } catch (err) {
        console.error("Failed to fetch listings", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyListings();
  }, [debouncedSearch, city, status]);

  /* Delete */
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this property?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/properties/${id}`);
      setListings((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="p-6 md:p-10">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-white">
            My <span className="text-purple-500 font-light">Listings</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage and track your property inventory.
          </p>
        </div>

        <button
          onClick={() => navigate("/seller/add-property")}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-2xl"
        >
          <FaPlus size={14} /> Add Property
        </button>
      </div>

      {/* 🔍 FILTER BAR */}
      <div className="flex flex-wrap gap-4 mb-8">

        {/* Search */}
        <div className="relative">
          <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search properties..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm"
          />
        </div>

        {/* City */}
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm"
        />

        {/* Status */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm"
        >
          <option value="">All Status</option>
          <option value="Available">Available</option>
          <option value="Sold">Sold</option>
          <option value="Pending">Pending</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* LOADING */}
      {loading && (
        <p className="text-slate-400">Loading your properties...</p>
      )}

      {/* EMPTY */}
      {!loading && listings.length === 0 && (
        <div className="text-center py-20 text-slate-500">
          <p>No properties found.</p>
        </div>
      )}

      {/* TABLE */}
      {!loading && listings.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-8 py-5 text-xs text-slate-500">Property</th>
                  <th className="px-6 py-5 text-xs text-slate-500">Status</th>
                  <th className="px-6 py-5 text-xs text-slate-500">Price</th>
                  <th className="px-6 py-5 text-xs text-slate-500">Views</th>
                  <th className="px-8 py-5 text-xs text-right text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">
                {listings.map((item) => (
                  <tr key={item._id} className="hover:bg-white/[0.02]">

                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <img
                          src={`http://localhost:3000/uploads/${item.images?.[0]}`}
                          alt={item.title}
                          className="w-16 h-16 rounded-xl object-cover"
                        />

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">
                              {item.title}
                            </span>
                            {item.approvalStatus === "Approved" && (
                              <MdVerified className="text-purple-400" />
                            )}
                          </div>

                          <p className="text-slate-500 text-xs mt-1">
                            {item.locality}, {item.city}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-6 text-slate-400">
                      {item.status}
                    </td>

                    <td className="px-6 py-6 font-bold text-indigo-300">
                      ₹{item.price?.toLocaleString("en-IN")}
                    </td>

                    <td className="px-6 py-6 text-slate-400">
                      <FaEye size={12} className="inline mr-1" />
                      {item.views || 0}
                    </td>

                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => navigate(`/seller/edit/${item._id}`)}
                          className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-indigo-600"
                        >
                          <FaEdit size={14} />
                        </button>

                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-red-600"
                        >
                          <FaTrashAlt size={14} />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyListings;