import React, { useEffect, useState } from "react";
import api from "../../app/apiClient";
import AdminPropertyPreview from "./propertyPreview";

const AdminProperties = () => {

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewProperty, setPreviewProperty] = useState(null);

  const fetchProperties = async () => {
    try {

      const res = await api.get("/admin/properties");

      setProperties(res.data.data || []);

    } catch (error) {
      console.error("Failed to load properties", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  if (loading) {
    return <p className="p-6">Loading properties...</p>;
  }

  return (
    <div className="p-6">

      <h2 className="text-2xl font-bold mb-6">
        Approved Properties
      </h2>

      {properties.length === 0 && (
        <p className="text-gray-500">
          No approved properties found.
        </p>
      )}

      <div className="space-y-4">

        {properties.map((property) => {

          const image =
            property.images?.length > 0
              ? `http://localhost:3000/uploads/${property.images[0]}`
              : "https://placehold.co/300x200";

          return (

            <div
              key={property._id}
              className="border rounded-xl p-4 flex gap-4 items-center bg-white shadow-sm"
            >

              {/* Property Image */}
              <img
                src={image}
                alt="property"
                className="w-32 h-24 object-cover rounded-lg"
              />

              {/* Property Info */}
              <div className="flex-1">

                <div className="flex items-center gap-2 mb-1">

                  <h3 className="font-semibold text-lg">
                    {property.title}
                  </h3>

                  <span className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded">
                    {property.propertyType}
                  </span>

                </div>

                <p className="text-sm text-gray-500">
                  Seller: {property.seller?.name}
                </p>

                <p className="text-sm text-gray-500">
                  Location: {property.location}
                </p>

                <p className="text-sm font-medium">
                  ₹{property.price?.toLocaleString("en-IN")}
                </p>

                {/* Residential Stats */}
                {["Apartment", "Villa", "Cottage", "House"].includes(property.propertyType) && (
                  <div className="flex gap-4 text-xs text-gray-600 mt-1">

                    <span>
                      🛏 {property.residential?.bedrooms || 0} Beds
                    </span>

                    <span>
                      🛁 {property.residential?.bathrooms || 0} Baths
                    </span>

                    <span>
                      📐 {property.residential?.builtUpArea || 0} sqft
                    </span>

                  </div>
                )}

                {/* Plot Stats */}
                {property.propertyType === "Plot" && (
                  <div className="flex gap-4 text-xs text-gray-600 mt-1">

                    <span>
                      🌍 {property.land?.plotArea || 0} {property.land?.areaUnit}
                    </span>

                    <span>
                      🧭 {property.land?.facing || "N/A"}
                    </span>

                    <span>
                      🏷 {property.land?.zoningType || "N/A"}
                    </span>

                  </div>
                )}

                {/* Commercial Stats */}
                {property.propertyType === "Commercial" && (
                  <div className="flex gap-4 text-xs text-gray-600 mt-1">

                    <span>
                      📐 {property.commercial?.areaSize || 0} sqft
                    </span>

                    <span>
                      🏢 {property.commercial?.floors || 0} floors
                    </span>

                    <span>
                      🚗 {property.commercial?.parkingSpaces || 0} parking
                    </span>

                  </div>
                )}

              </div>

              {/* Right Section */}
              <div className="flex flex-col items-end gap-2">

                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                  Approved
                </span>

                <p className="text-xs text-gray-500">
                  Agent: {property.agent?.name}
                </p>

                <button
                  onClick={() => setPreviewProperty(property)}
                  className="px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-900"
                >
                  View
                </button>

              </div>

            </div>

          );
        })}

      </div>

      {/* Property Preview Modal */}
      {previewProperty && (
        <AdminPropertyPreview
          property={previewProperty}
          onClose={() => setPreviewProperty(null)}
        />
      )}

    </div>
  );
};

export default AdminProperties;