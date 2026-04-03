import React, { useEffect, useState, useMemo } from "react";
import api from "../../app/apiClient";
import { useNavigate } from "react-router-dom";

const TABS = ["Assigned", "Approved", "Rejected"];

const AgentProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("Assigned");

  const navigate = useNavigate();

  const fetchProperties = async () => {
    try {
      const res = await api.get("/agent/properties");
      setProperties(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch properties", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  /* Filter properties based on tab */
  const filteredProperties = useMemo(() => {
    if (tab === "Assigned") {
      return properties.filter((p) => p.agentDecision === "Pending");
    }

    if (tab === "Approved") {
      return properties.filter((p) => p.agentDecision === "Approved");
    }

    if (tab === "Rejected") {
      return properties.filter((p) => p.agentDecision === "Rejected");
    }

    return properties;
  }, [properties, tab]);

  /* Status counters */
  const count = (status) =>
    properties.filter((p) => p.agentDecision === status).length;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">
        Property Management
      </h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {TABS.map((t) => {
          const statusKey = t === "Assigned" ? "Pending" : t;

          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition
                ${
                  tab === t
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              {t}
              <span className="ml-2 text-xs opacity-80">
                ({count(statusKey)})
              </span>
            </button>
          );
        })}
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-gray-500">Loading properties...</p>
      )}

      {/* Empty */}
      {!loading && filteredProperties.length === 0 && (
        <p className="text-gray-500">No properties found.</p>
      )}

      {/* Table */}
      {!loading && filteredProperties.length > 0 && (
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Property</th>
                <th className="p-3">Location</th>
                <th className="p-3">Price</th>
                <th className="p-3">Seller</th>
                <th className="p-3">Decision</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredProperties.map((property) => (
                <tr key={property._id} className="border-t">
                  <td className="p-3 font-medium">
                    {property.title}
                  </td>

                  <td className="p-3">
                    {property.location}
                  </td>

                  <td className="p-3">
                    ₹{property.price?.toLocaleString("en-IN")}
                  </td>

                  <td className="p-3">
                    {property.seller?.name}
                  </td>

                  {/* Decision */}
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold
                        ${
                          property.agentDecision === "Approved"
                            ? "bg-green-100 text-green-700"
                            : property.agentDecision === "Rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      {property.agentDecision}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-3">
                    <button
                      onClick={() =>
                        navigate(`/agent/properties/${property._id}`)
                      }
                      className="px-3 py-1 text-xs rounded bg-purple-600 text-white hover:bg-purple-700"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}
    </div>
  );
};

export default AgentProperties;