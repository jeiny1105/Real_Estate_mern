import React, { useEffect, useState } from "react";
import api from "../../app/apiClient";
import {
  FaBuilding,
  FaIdCard,
  FaSave,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCheckCircle,
  FaCalendarAlt
} from "react-icons/fa";

const SellerProfile = () => {

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    gstNumber: "",
    status: "",
    createdAt: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchProfile = async () => {
    try {

      const res = await api.get("/sellers/me");

      const data = res.data.data;

      setProfile({
        name: data.user?.name || "",
        email: data.user?.email || "",
        phone: data.user?.phone || "",
        companyName: data.companyName || "",
        gstNumber: data.gstNumber || "",
        status: data.status || "",
        createdAt: data.createdAt || "",
      });

      setLoading(false);

    } catch (error) {
      console.error("Failed to load profile", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      await api.patch("/sellers/me", {
        companyName: profile.companyName,
        gstNumber: profile.gstNumber,
      });

      setMessage("Profile updated successfully");

      setTimeout(() => setMessage(""), 3000);

    } catch (error) {
      console.error("Update failed", error);
      setMessage("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">

      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900">
          Account Settings
        </h2>
        <p className="text-gray-500 mt-1">
          Manage your business profile and public information.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

        {/* Status Banner */}
        <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex flex-wrap justify-between items-center gap-4">

          <div className="flex items-center gap-3">

            <div className="h-12 w-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
              <FaUser size={20} />
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-900">
                {profile.name}
              </p>

              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                Seller ID: {profile.gstNumber || "N/A"}
              </p>
            </div>

          </div>

          <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-100">
            <FaCheckCircle />
            {profile.status?.toUpperCase() || "ACTIVE"}
          </div>

        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8">

          {message && (
            <div
              className={`mb-6 p-4 rounded-lg text-sm font-medium ${
                message.includes("Failed")
                  ? "bg-red-50 text-red-700 border border-red-100"
                  : "bg-emerald-50 text-emerald-700 border border-emerald-100"
              }`}
            >
              {message}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

            {/* Personal Details */}
            <div className="space-y-6">

              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Personal Details
              </h3>

              <ReadOnlyField icon={<FaUser />} value={profile.name} label="Full Name" />
              <ReadOnlyField icon={<FaEnvelope />} value={profile.email} label="Email Address" />
              <ReadOnlyField icon={<FaPhone />} value={profile.phone} label="Phone Number" />

            </div>

            {/* Business Info */}
            <div className="space-y-6">

              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Business Information
              </h3>

              <EditableField
                icon={<FaBuilding />}
                label="Company Name"
                name="companyName"
                value={profile.companyName}
                onChange={handleChange}
                placeholder="Enter Company Name"
              />

              <EditableField
                icon={<FaIdCard />}
                label="GST Number"
                name="gstNumber"
                value={profile.gstNumber}
                onChange={handleChange}
                placeholder="15-digit GSTIN"
              />

              <div className="flex items-center gap-2 text-gray-500 text-xs italic">
                <FaCalendarAlt />
                <span>
                  Member since:{" "}
                  {profile.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "N/A"}
                </span>
              </div>

            </div>

          </div>

          <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end">

            <button
              type="submit"
              className="flex items-center justify-center gap-2 bg-purple-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-purple-700 active:scale-95 transition-all shadow-md hover:shadow-lg w-full md:w-auto"
            >
              <FaSave />
              Save Changes
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

const ReadOnlyField = ({ icon, value, label }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-600 mb-2">
      {label}
    </label>

    <div className="relative">

      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {icon}
      </div>

      <input
        type="text"
        value={value}
        readOnly
        className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 text-gray-500 rounded-lg text-sm cursor-not-allowed"
      />

    </div>
  </div>
);

const EditableField = ({ icon, label, name, value, onChange, placeholder }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {label}
    </label>

    <div className="relative">

      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-purple-500">
        {icon}
      </div>

      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="block w-full pl-10 pr-3 py-2.5 text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-sm shadow-sm"
      />

    </div>
  </div>
);

export default SellerProfile;