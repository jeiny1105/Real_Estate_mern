import React, { useEffect, useState } from "react";
import api from "../../app/apiClient";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaClock,
  FaUserTie,
} from "react-icons/fa";

function ScheduledVisits() {
  const navigate = useNavigate();

  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const res = await api.get("/inquiries/buyer/inquiries");

        const all = res.data.data || [];

        const scheduled = all.filter(
          (i) => i.status === "Visit Scheduled"
        );

        setVisits(scheduled);
      } catch (err) {
        console.error("Error fetching visits:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVisits();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-28">
      <h1 className="text-3xl font-bold mb-10 text-white">
        Scheduled Visits
      </h1>

      {/* Loading */}
      {loading && (
        <div className="text-center py-20 text-slate-400">
          Loading visits...
        </div>
      )}

      {/* Empty */}
      {!loading && visits.length === 0 && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-10 text-center text-slate-400">
          No visits scheduled yet.
        </div>
      )}

      {/* ✅ BEAUTIFUL CARDS */}
      {!loading && visits.length > 0 && (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {visits.map((visit) => {
            const property = visit.property;

            const imageUrl =
              property?.images?.length > 0
                ? `http://localhost:3000/uploads/${property.images[0]}`
                : "https://placehold.co/600x400?text=DreamHaven";

            return (
              <div
                key={visit._id}
                className="group bg-[#111827] border border-white/5 rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-purple-500/50 hover:shadow-[0_20px_50px_rgba(139,92,246,0.15)]"
              >
                {/* IMAGE */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={property?.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-700"
                  />

                  {/* overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  {/* PRICE */}
                  <div className="absolute bottom-4 left-4 text-white font-bold text-lg">
                    ₹{property?.price?.toLocaleString("en-IN")}
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-5">
                  {/* TITLE */}
                  <h2 className="text-white font-bold text-lg group-hover:text-purple-400 transition">
                    {property?.title}
                  </h2>

                  <p className="text-slate-400 text-sm mb-4">
                    📍 {property?.location}
                  </p>

                  {/* VISIT INFO */}
                  <div className="space-y-2 text-sm text-slate-300">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-purple-400" />
                      {visit.visitDate
                        ? new Date(visit.visitDate).toLocaleDateString()
                        : "N/A"}
                    </div>

                    <div className="flex items-center gap-2">
                      <FaClock className="text-purple-400" />
                      {visit.visitTime}
                    </div>

                    <div className="flex items-center gap-2">
                      <FaUserTie className="text-purple-400" />
                      {visit.agent?.name || "Agent"}
                    </div>
                  </div>

                  {/* STATUS */}
                  <div className="mt-4">
                    <span className="bg-purple-600/20 text-purple-400 text-xs px-3 py-1 rounded-full">
                      Visit Scheduled
                    </span>
                  </div>

                  {/* BUTTON */}
                  <button
                    onClick={() =>
                      navigate(`/properties/${property._id}`)
                    }
                    className="mt-5 w-full bg-white text-black py-2 rounded-xl font-semibold hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-500 hover:text-white transition"
                  >
                    View Property
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ScheduledVisits;