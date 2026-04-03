import React from "react";

const AdminPropertyPreview = ({ property, onClose }) => {

  if (!property) return null;

  const images = property.images?.length > 0 ? property.images : [];

  const isResidential = ["Apartment", "Villa", "Cottage", "House"].includes(property.propertyType);
  const isPlot = property.propertyType === "Plot";
  const isCommercial = property.propertyType === "Commercial";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className="bg-white rounded-xl w-full max-w-5xl p-6 max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">

          <h2 className="text-xl font-bold">
            Property Preview
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-lg"
          >
            ✕
          </button>

        </div>

        {/* Images */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {images.map((img, index) => (
              <img
                key={index}
                src={`http://localhost:3000/uploads/${img}`}
                alt="property"
                className="w-full h-40 object-cover rounded-lg"
              />
            ))}
          </div>
        )}

        {/* Basic Info */}
        <div className="space-y-3">

          <h3 className="text-lg font-semibold">
            {property.title}
          </h3>

          <p className="text-gray-600">
            {property.description}
          </p>

          <p>
            <strong>Location:</strong> {property.location}
          </p>

          <p>
            <strong>Price:</strong> ₹{property.price?.toLocaleString("en-IN")}
          </p>

          <p>
            <strong>Property Type:</strong> {property.propertyType}
          </p>

          <p>
            <strong>Listing Type:</strong> {property.listingType}
          </p>

          <p>
            <strong>Seller:</strong> {property.seller?.name}
          </p>

          {property.agent && (
            <p>
              <strong>Agent:</strong> {property.agent?.name}
            </p>
          )}

          <p>
            <strong>Status:</strong> {property.status}
          </p>

          <p>
            <strong>Approval:</strong> {property.approvalStatus}
          </p>

        </div>

        {/* Residential Details */}
        {isResidential && (
          <div className="mt-6">

            <h4 className="font-semibold mb-2">
              Residential Details
            </h4>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">

              <p>Bedrooms: {property.residential?.bedrooms || 0}</p>

              <p>Bathrooms: {property.residential?.bathrooms || 0}</p>

              <p>Kitchens: {property.residential?.kitchens || 0}</p>

              <p>Area: {property.residential?.builtUpArea || 0} sqft</p>

              <p>Furnishing: {property.residential?.furnishing}</p>

            </div>

          </div>
        )}

        {/* Commercial Details */}
        {isCommercial && (
          <div className="mt-6">

            <h4 className="font-semibold mb-2">
              Commercial Details
            </h4>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">

              <p>Area Size: {property.commercial?.areaSize || 0} sqft</p>

              <p>Floors: {property.commercial?.floors || 0}</p>

              <p>Parking: {property.commercial?.parkingSpaces || 0}</p>

              <p>Business Type: {property.commercial?.businessType || "N/A"}</p>

            </div>

          </div>
        )}

        {/* Land Details */}
        {isPlot && (
          <div className="mt-6">

            <h4 className="font-semibold mb-2">
              Land Details
            </h4>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">

              <p>
                Plot Area: {property.land?.plotArea || 0} {property.land?.areaUnit}
              </p>

              <p>Facing: {property.land?.facing || "N/A"}</p>

              <p>Zoning: {property.land?.zoningType || "N/A"}</p>

              <p>Land Approval: {property.land?.approvalStatus}</p>

            </div>

          </div>
        )}

        {/* Amenities */}
        {property.amenities?.length > 0 && (
          <div className="mt-6">

            <h4 className="font-semibold mb-2">
              Amenities
            </h4>

            <div className="flex flex-wrap gap-2">

              {property.amenities.map((a, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-xs bg-gray-100 rounded-full"
                >
                  {a}
                </span>
              ))}

            </div>

          </div>
        )}

        {/* Agent Reject Reason */}
        {property.agentDecision === "Rejected" && (
          <div className="mt-6 bg-red-50 border border-red-200 p-4 rounded">

            <h4 className="font-semibold text-red-700">
              Agent Rejection Reason
            </h4>

            <p className="text-sm text-red-600">
              {property.agentRejectReason}
            </p>

          </div>
        )}

      </div>

    </div>
  );
};

export default AdminPropertyPreview;