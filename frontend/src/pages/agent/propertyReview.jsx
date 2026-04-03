
import React, { useEffect, useState } from "react";
import api from "../../app/apiClient";
import { useParams, useNavigate } from "react-router-dom";

const AgentPropertyReview = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [rejectReason, setRejectReason] = useState("");
    const [actionLoading, setActionLoading] = useState(false);

    const fetchProperty = async () => {
        try {
            const res = await api.get(`/properties/${id}`);
            setProperty(res.data.data);
        } catch (error) {
            console.error("Failed to fetch property", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProperty();
    }, [id]);

    const approveProperty = async () => {
        if (!window.confirm("Approve this property?")) return;

        try {
            setActionLoading(true);

            await api.patch(`/agent/properties/${id}/approve`);

            alert("Property approved");
            navigate("/agent/properties");

        } catch (error) {
            alert("Failed to approve property");
        } finally {
            setActionLoading(false);
        }
    };

    const rejectProperty = async () => {
        if (!rejectReason) {
            alert("Please enter a reject reason");
            return;
        }

        if (!window.confirm("Reject this property?")) return;

        try {
            setActionLoading(true);

            await api.patch(`/agent/properties/${id}/reject`, {
                reason: rejectReason,
            });

            alert("Property rejected");
            navigate("/agent/properties");

        } catch (error) {
            alert("Failed to reject property");
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return <p className="p-6">Loading property...</p>;
    }

    if (!property) {
        return <p className="p-6">Property not found</p>;
    }

    const isReviewed = property.agentDecision !== "Pending";

    return (
        <div className="p-6 space-y-6">

            <div className="flex items-center gap-4 mb-6">

                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm"
                >
                    ← 
                </button>

                <h1 className="text-2xl font-semibold">
                    Property Review
                </h1>

            </div>

            {/* IMAGE GALLERY */}
            {property.images?.length > 0 && (

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

                    {property.images.map((img, index) => (

                        <img
                            key={index}
                            src={`http://localhost:3000/uploads/${img}`}
                            alt="property"
                            className="w-full h-48 object-cover rounded-lg shadow"
                        />

                    ))}

                </div>

            )}

            {/* PROPERTY DETAILS */}
            <div className="bg-white shadow rounded-xl p-6 space-y-3">

                <h2 className="text-xl font-semibold">
                    {property.title}
                </h2>

                {/* Status Badge */}
                <span
                    className={`px-3 py-1 text-xs rounded-full
            ${property.agentDecision === "Approved"
                            ? "bg-green-100 text-green-700"
                            : property.agentDecision === "Rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                        }`}
                >
                    {property.agentDecision}
                </span>

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
                    <strong>Description:</strong> {property.description}
                </p>

                <p>
                    <strong>Seller:</strong> {property.seller?.name}
                </p>

            </div>

            {/* AMENITIES */}
            {property.amenities?.length > 0 && (

                <div className="bg-white shadow rounded-xl p-6">

                    <h3 className="font-semibold mb-3">
                        Amenities
                    </h3>

                    <div className="flex flex-wrap gap-2">

                        {property.amenities.map((amenity, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 text-sm bg-gray-100 rounded-full"
                            >
                                {amenity}
                            </span>
                        ))}

                    </div>

                </div>

            )}

            {/* REJECT REASON */}
            {!isReviewed && (
                <div>

                    <textarea
                        placeholder="Reject reason..."
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        className="w-full border rounded-lg p-3"
                    />

                </div>
            )}

            {/* ACTION BUTTONS */}
            <div className="flex gap-4">

                <button
                    disabled={isReviewed || actionLoading}
                    onClick={approveProperty}
                    className="px-5 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                >
                    Approve
                </button>

                <button
                    disabled={isReviewed || actionLoading}
                    onClick={rejectProperty}
                    className="px-5 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                >
                    Reject
                </button>

            </div>

        </div>
    );
};

export default AgentPropertyReview;

