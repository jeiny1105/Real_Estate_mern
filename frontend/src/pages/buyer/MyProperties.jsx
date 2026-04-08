import { useEffect, useState } from "react";
import api from "../../app/apiClient";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa";

const MyProperties = () => {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyProperties = async () => {
    try {
      const res = await api.get("/inquiries/buyer/properties");

      // backend returns inquiry with populated property
      const data = res.data.data || [];

      setProperties(data);
    } catch (err) {
      console.error("Failed to fetch buyer properties", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProperties();
  }, []);

  /* ================= UI ================= */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <div className="w-10 h-10 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <div className="mb-12">
          <h1 className="text-4xl font-light tracking-tight text-slate-900">
            My <span className="font-serif italic text-blue-600">Properties</span>
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Properties you have successfully acquired
          </p>
        </div>

        {/* EMPTY STATE */}
        {properties.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center shadow-sm">
            <p className="text-slate-400 font-medium">
              You don’t own any properties yet.
            </p>
          </div>
        ) : (

          /* GRID */
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

            {properties.map((item) => {
              const property = item.property;

              if (!property) return null;

              const image =
                property.images?.length > 0
                  ? `http://localhost:3000/uploads/${property.images[0]}`
                  : "https://images.unsplash.com/photo-1600585154340-be6161a56a0c";

              return (
                <div
                  key={item._id}
                  onClick={() => navigate(`/properties/${property._id}`)}
                  className="cursor-pointer group bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
                >
                  {/* IMAGE */}
                  <div className="h-56 overflow-hidden">
                    <img
                      src={image}
                      alt="property"
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="p-6 space-y-4">

                    {/* STATUS */}
                    <div className="flex items-center gap-2 text-green-600 text-xs font-bold uppercase tracking-widest">
                      <FaCheckCircle />
                      Owned
                    </div>

                    {/* TITLE */}
                    <h2 className="text-lg font-semibold text-slate-900 line-clamp-1">
                      {property.title}
                    </h2>

                    {/* LOCATION */}
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <FaMapMarkerAlt />
                      {property.location}
                    </div>

                    {/* PRICE */}
                    <div className="text-xl font-bold text-slate-900">
                      ₹{property.price?.toLocaleString("en-IN")}
                    </div>

                    {/* OPTIONAL: VISIT DATE */}
                    {item.visitDate && (
                      <div className="text-xs text-slate-400">
                        Visit:{" "}
                        {new Date(item.visitDate).toLocaleDateString()}
                      </div>
                    )}

                  </div>
                </div>
              );
            })}

          </div>
        )}
      </div>
    </div>
  );
};

export default MyProperties;