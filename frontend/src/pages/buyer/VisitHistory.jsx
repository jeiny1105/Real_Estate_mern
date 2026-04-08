import React, { useEffect, useState } from "react";
import api from "../../app/apiClient";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaClock,
  FaUserTie,
  FaCheckCircle,
} from "react-icons/fa";

function VisitHistory() {
  const navigate = useNavigate();

  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const res = await api.get("/inquiries/buyer/inquiries");

        const all = res.data.data || [];

        // 🔥 Past visits (you can tweak statuses later)
        const history = all.filter((i) =>
          ["Completed", "Closed Won", "Closed Lost"].includes(i.status)
        );

        setVisits(history);
      } catch (err) {
        console.error("Error fetching visit history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVisits();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-28">
      <h1 className="text-3xl font-bold mb-10 text-white">
        Visit History
      </h1>

      {/* Loading */}
      {loading && (
        <div className="text-center py-20 text-slate-400">
          Loading history...
        </div>
      )}

      {/* Empty */}
      {!loading && visits.length === 0 && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-10 text-center text-slate-400">
          No past visits yet.
        </div>
      )}

      {/* ✅ Cards */}
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
                className="group bg-[#111827] border border-white/5 rounded-2xl overflow-hidden opacity-90 hover:opacity-100 transition-all duration-500 hover:-translate-y-2 hover:border-green-500/50 hover:shadow-[0_20px_50px_rgba(34,197,94,0.15)]"
              >
                {/* IMAGE */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={property?.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-700"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  {/* Completed Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-green-600/90 text-white text-xs px-3 py-1 rounded-lg flex items-center gap-1">
                      <FaCheckCircle /> Completed
                    </span>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-5">
                  <h2 className="text-white font-bold text-lg">
                    {property?.title}
                  </h2>

                  <p className="text-slate-400 text-sm mb-4">
                    📍 {property?.location}
                  </p>

                  {/* VISIT INFO */}
                  <div className="space-y-2 text-sm text-slate-300">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-green-400" />
                      {visit.visitDate
                        ? new Date(visit.visitDate).toLocaleDateString()
                        : "N/A"}
                    </div>

                    <div className="flex items-center gap-2">
                      <FaClock className="text-green-400" />
                      {visit.visitTime || "N/A"}
                    </div>

                    <div className="flex items-center gap-2">
                      <FaUserTie className="text-green-400" />
                      {visit.agent?.name || "Agent"}
                    </div>
                  </div>

                  {/* STATUS TEXT */}
                  <p className="mt-4 text-xs text-slate-500">
                    Status: {visit.status}
                  </p>

                  {/* BUTTON */}
                  <button
                    onClick={() =>
                      navigate(`/properties/${property._id}`)
                    }
                    className="mt-5 w-full bg-white text-black py-2 rounded-xl font-semibold hover:bg-gradient-to-r hover:from-green-500 hover:to-emerald-600 hover:text-white transition"
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

export default VisitHistory;