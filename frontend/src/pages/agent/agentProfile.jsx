import React, { useEffect, useState } from "react";
import api from "../../app/apiClient";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCamera,
  FaChartBar,
  FaShieldAlt,
  FaBuilding,
  FaMoneyBillWave,
} from "react-icons/fa";

function AgentProfile() {
  const [user, setUser] = useState(null);
  const [agent, setAgent] = useState(null);

  const [form, setForm] = useState({});
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const userRes = await api.get("/users/me");
        const userData = userRes.data.data;

        const agentRes = await api.get("/agent/me"); // ✅ FIXED
        const agentData = agentRes.data.data;

        setUser(userData);
        setAgent(agentData);

        setForm({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          agencyName: agentData.agencyName,
        });

        if (userData.profileImage) {
          setPreview(
            `${import.meta.env.VITE_API_URL}${userData.profileImage}`
          );
        }
      } catch (err) {
        console.error(err);
        alert("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);

      if (
        passwords.newPassword &&
        passwords.newPassword !== passwords.confirmPassword
      ) {
        alert("Passwords do not match");
        return;
      }

      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        if (form[key]) formData.append(key, form[key]);
      });

      Object.keys(passwords).forEach((key) => {
        if (passwords[key]) formData.append(key, passwords[key]);
      });

      if (image) formData.append("profileImage", image);

      const res = await api.patch("/users/me", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUser(res.data.data);

      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  /* ================= LOADING ================= */
  if (loading || !user || !agent) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-pulse text-slate-500 font-medium">
          Loading your profile...
        </div>
      </div>
    );
  }

  /* ================= STATUS STYLE ================= */
  const getStatusStyle = () => {
    switch (agent.status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Rejected":
      case "Blocked":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const conversionRate = agent.performance?.totalLeads
    ? Math.round(
        (agent.performance.leadsConverted /
          agent.performance.totalLeads) *
          100
      )
    : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <h1 className="text-3xl font-bold mb-10 text-slate-900">
          Agent Profile
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT SIDE */}
          <div className="space-y-6">

            {/* PROFILE CARD */}
            <div className="bg-white p-6 rounded-3xl text-center shadow">
              <label className="cursor-pointer relative inline-block">
                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden">
                  <img
                    src={preview || "https://placehold.co/200"}
                    className="w-full h-full object-cover"
                    alt="Profile"
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 rounded-full">
                  <FaCamera className="text-white" />
                </div>
                <input type="file" hidden onChange={handleImage} />
              </label>

              <h2 className="font-bold mt-4 text-lg">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>

              <span
                className={`text-xs px-3 py-1 rounded-full mt-2 inline-block ${getStatusStyle()}`}
              >
                {agent.status}
              </span>
            </div>

            {/* PERFORMANCE */}
            <div className="bg-white p-6 rounded-3xl shadow">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <FaChartBar /> Performance
              </h3>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div>
                  <p className="font-bold">
                    {agent.performance?.totalLeads || 0}
                  </p>
                  <p className="text-xs">Leads</p>
                </div>

                <div>
                  <p className="font-bold">
                    {agent.performance?.leadsConverted || 0}
                  </p>
                  <p className="text-xs">Converted</p>
                </div>

                <div>
                  <p className="font-bold">
                    {agent.performance?.bookingsCompleted || 0}
                  </p>
                  <p className="text-xs">Bookings</p>
                </div>

                <div>
                  <p className="font-bold">
                    {agent.performance?.responseTimeAvg || 0}h
                  </p>
                  <p className="text-xs">Response</p>
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-3 text-center">
                Conversion Rate: {conversionRate}%
              </p>
            </div>

            {/* EARNINGS */}
            <div className="bg-white p-6 rounded-3xl shadow">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <FaMoneyBillWave /> Earnings
              </h3>

              <p className="text-2xl font-bold text-green-600">
                ₹ {agent.earnings?.toLocaleString() || 0}
              </p>

              <p className="text-sm text-gray-500">
                Commission: {agent.commissionRate}%
              </p>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="lg:col-span-2 space-y-6">

            {/* PERSONAL DETAILS */}
            <div className="bg-white p-6 rounded-3xl shadow space-y-4">
              <h3 className="font-bold">Personal Details</h3>

              <input
                name="name"
                value={form.name || ""}
                onChange={handleChange}
                placeholder="Name"
                className="input"
              />

              <input
                name="phone"
                value={form.phone || ""}
                onChange={handleChange}
                placeholder="Phone"
                className="input"
              />

              <input
                name="email"
                value={form.email || ""}
                onChange={handleChange}
                placeholder="Email"
                className="input"
              />
            </div>

            {/* AGENCY */}
            <div className="bg-white p-6 rounded-3xl shadow space-y-4">
              <h3 className="font-bold flex items-center gap-2">
                <FaBuilding /> Agency Info
              </h3>

              <input
                name="agencyName"
                value={form.agencyName || ""}
                onChange={handleChange}
                placeholder="Agency Name"
                className="input"
              />

              <input
                value={agent.licenseNumber}
                disabled
                className="input bg-gray-100"
              />
            </div>

            {/* SECURITY */}
            <div className="bg-white p-6 rounded-3xl shadow space-y-4">
              <h3 className="font-bold flex items-center gap-2">
                <FaShieldAlt /> Security
              </h3>

              <input
                type="password"
                name="currentPassword"
                placeholder="Current Password"
                onChange={handlePasswordChange}
                className="input"
              />

              <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                onChange={handlePasswordChange}
                className="input"
              />

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                onChange={handlePasswordChange}
                className="input"
              />
            </div>

            {/* SAVE BUTTON */}
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgentProfile;