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
  FaCalendarAlt,
  FaChartBar
} from "react-icons/fa";

const SellerProfile = () => {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  /* ================= FETCH ================= */
  const fetchProfile = async () => {
    try {
      const res = await api.get("/sellers/me");
      setProfile(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) =>
    setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.patch("/sellers/me", {
        companyName: profile.companyName,
        gstNumber: profile.gstNumber,
      });

      setMessage("Profile updated successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Failed to update profile");
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">
          Seller Profile
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage your business details.
        </p>
      </div>

      {/* CARD */}
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">

        {/* TOP BAR */}
        <div className="flex justify-between items-center p-6 border-b bg-gray-50">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
              <FaUser />
            </div>

            <div>
              <p className="font-semibold text-gray-900">
                {profile.name}
              </p>
              <p className="text-sm text-gray-500">
                {profile.email}
              </p>
            </div>
          </div>

          <span className="flex items-center gap-1 text-xs font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full">
            <FaCheckCircle />
            {profile.status || "Active"}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-10">

          {/* ALERT */}
          {message && (
            <div
              className={`p-3 rounded-lg text-sm ${
                message.includes("Failed")
                  ? "bg-red-50 text-red-600"
                  : "bg-green-50 text-green-700"
              }`}
            >
              {message}
            </div>
          )}

          {/* 🔥 SMALL OVERVIEW ONLY */}
          <Section title="Overview">
            <Stat label="Properties" value={profile.stats?.totalProperties} />
            <Stat label="Active Listings" value={profile.stats?.activeListings} />
            <Stat label="Bookings" value={profile.stats?.bookings} />
          </Section>

          {/* PERSONAL */}
          <Section title="Personal Information">
            <ReadOnly label="Name" value={profile.name} icon={<FaUser />} />
            <ReadOnly label="Email" value={profile.email} icon={<FaEnvelope />} />
            <ReadOnly label="Phone" value={profile.phone} icon={<FaPhone />} />
          </Section>

          {/* BUSINESS */}
          <Section title="Business Information">
            <Input
              label="Company Name"
              name="companyName"
              value={profile.companyName}
              onChange={handleChange}
              icon={<FaBuilding />}
            />

            <Input
              label="GST Number"
              name="gstNumber"
              value={profile.gstNumber}
              onChange={handleChange}
              icon={<FaIdCard />}
            />

            <div className="text-sm text-gray-500 flex items-center gap-2 mt-2">
              <FaCalendarAlt />
              Joined on{" "}
              {profile.createdAt
                ? new Date(profile.createdAt).toLocaleDateString()
                : "N/A"}
            </div>
          </Section>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full md:w-auto bg-purple-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-purple-700 transition flex items-center gap-2"
          >
            <FaSave />
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

/* 🔹 COMPONENTS */

const Section = ({ title, children }) => (
  <div>
    <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2 flex items-center gap-2">
      <FaChartBar /> {title}
    </h3>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {children}
    </div>
  </div>
);

const Stat = ({ label, value }) => (
  <div className="bg-gray-50 p-4 rounded-lg text-center border">
    <p className="text-xl font-bold text-gray-900">
      {value || 0}
    </p>
    <p className="text-xs text-gray-500">{label}</p>
  </div>
);

const ReadOnly = ({ label, value, icon }) => (
  <div>
    <label className="text-sm text-gray-600 mb-1 block">{label}</label>
    <div className="relative">
      <div className="absolute left-3 top-2.5 text-gray-400">{icon}</div>
      <input
        value={value || ""}
        readOnly
        className="w-full pl-10 pr-3 py-2.5 bg-gray-100 border rounded-lg text-sm text-gray-600"
      />
    </div>
  </div>
);

const Input = ({ label, name, value, onChange, icon }) => (
  <div>
    <label className="text-sm text-gray-600 mb-1 block">{label}</label>
    <div className="relative">
      <div className="absolute left-3 top-2.5 text-purple-500">{icon}</div>
      <input
        name={name}
        value={value || ""}
        onChange={onChange}
        className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
      />
    </div>
  </div>
);

export default SellerProfile;