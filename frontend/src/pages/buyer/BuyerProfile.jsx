import React, { useEffect, useState } from "react";
import api from "../../app/apiClient";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCamera,
  FaChartBar,
  FaShieldAlt,
} from "react-icons/fa";

function Profile() {
  const [user, setUser] = useState(null);
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

  /* ================= FETCH - Logic Maintained ================= */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/users/me");
        const data = res.data.data;
        setUser(data);
        setForm({
          name: data.name,
          email: data.email,
          phone: data.phone,
        });
        if (data.profileImage) {
          setPreview(`http://localhost:3000${data.profileImage}`);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  /* ================= HANDLERS - Logic Maintained ================= */
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
      if (passwords.newPassword && passwords.newPassword !== passwords.confirmPassword) {
        alert("Passwords do not match");
        return;
      }
      const formData = new FormData();
      Object.keys(form).forEach((key) => { if (form[key]) formData.append(key, form[key]); });
      Object.keys(passwords).forEach((key) => { if (passwords[key]) formData.append(key, passwords[key]); });
      if (image) formData.append("profileImage", image);

      const res = await api.patch("/users/me", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUser(res.data.data);
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user)
    return (
      <div className="flex items-center justify-center min-h-screen text-slate-500 font-medium bg-slate-50">
        <div className="animate-pulse">Loading your profile...</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <h1 className="text-3xl font-extrabold mb-10 text-slate-900 tracking-tight">Account Settings</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 🔹 LEFT CARD: PROFILE PREVIEW */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-8 text-center">
              <label className="relative group cursor-pointer inline-block">
                <div className="w-28 h-28 mx-auto rounded-full overflow-hidden border-4 border-white shadow-xl ring-1 ring-slate-100 transition-transform group-hover:scale-105">
                  <img
                    src={preview || "https://placehold.co/200"}
                    className="w-full h-full object-cover"
                    alt="Profile"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <FaCamera className="text-white text-xl" />
                  </div>
                </div>
                <input type="file" className="hidden" onChange={handleImage} />
              </label>

              <h2 className="text-slate-900 font-bold text-xl mt-6">{user?.name}</h2>
              <p className="text-slate-500 text-sm mb-6">{user?.email}</p>

              <div className="flex flex-col gap-2">
                <span className="bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                  {user?.role}
                </span>
                <span className="bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                  {user?.status}
                </span>
              </div>
            </div>
            
            {/* 📊 ACTIVITY SUMMARY FOR BUYERS */}
            {user?.role === "Buyer" && (
              <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6">
                <h3 className="text-slate-800 font-bold mb-4 flex items-center gap-2">
                  <FaChartBar className="text-indigo-500" /> Activity
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-50 p-3 rounded-2xl text-center">
                    <p className="text-lg font-bold text-slate-900">{user.stats?.wishlist || 0}</p>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Saved</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl text-center">
                    <p className="text-lg font-bold text-slate-900">{user.stats?.visits || 0}</p>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Visits</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl text-center">
                    <p className="text-lg font-bold text-slate-900">{user.stats?.inquiries || 0}</p>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Asks</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 🔹 RIGHT PANEL: FORMS */}
          <div className="lg:col-span-2 space-y-8">
            {/* 📝 BASIC INFO */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-8 space-y-5">
              <h3 className="text-slate-900 font-bold text-lg border-b border-slate-100 pb-4">Personal Details</h3>
              
              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-slate-600 text-xs font-bold uppercase ml-1">Full Name</label>
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-3.5 rounded-2xl focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
                    <FaUser className="text-slate-400" />
                    <input name="name" value={form.name || ""} onChange={handleChange} className="bg-transparent w-full outline-none text-slate-900 font-medium"/>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-600 text-xs font-bold uppercase ml-1">Phone Number</label>
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-3.5 rounded-2xl focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
                    <FaPhone className="text-slate-400" />
                    <input name="phone" value={form.phone || ""} onChange={handleChange} className="bg-transparent w-full outline-none text-slate-900 font-medium"/>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-600 text-xs font-bold uppercase ml-1">Email Address</label>
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-3.5 rounded-2xl focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
                  <FaEnvelope className="text-slate-400" />
                  <input name="email" value={form.email || ""} onChange={handleChange} className="bg-transparent w-full outline-none text-slate-900 font-medium"/>
                </div>
              </div>
            </div>

            {/* 🔒 SECURITY SECTION */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-8 space-y-5">
              <h3 className="text-slate-900 font-bold text-lg flex items-center gap-2 border-b border-slate-100 pb-4">
                <FaShieldAlt className="text-indigo-500" /> Security & Password
              </h3>

              <div className="space-y-4">
                <input
                  type="password"
                  name="currentPassword"
                  value={passwords.currentPassword}
                  placeholder="Current Password"
                  onChange={handlePasswordChange}
                  className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="password"
                    name="newPassword"
                    value={passwords.newPassword}
                    placeholder="New Password"
                    onChange={handlePasswordChange}
                    className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwords.confirmPassword}
                    placeholder="Confirm New Password"
                    onChange={handlePasswordChange}
                    className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* 🔥 ACTION BUTTON */}
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 active:scale-[0.99] transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
            >
              {saving ? "Saving Changes..." : "Save Profile Settings"}
            </button>

            {/* 💎 SUBSCRIPTION (Visible for Non-Buyers) */}
            {user?.role !== "Buyer" && user.subscription?.snapshot && (
              <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="font-bold text-xl mb-2">Your Membership</h3>
                  <p className="text-indigo-100 text-sm mb-6">Plan: <span className="text-white font-bold">{user.subscription.snapshot.name}</span></p>
                  
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(user.subscription.snapshot.features || {}).map(
                      ([k, v]) => v && (
                        <span key={k} className="bg-white/20 backdrop-blur-md text-[10px] px-3 py-1.5 rounded-full font-bold uppercase tracking-widest">
                          {k}
                        </span>
                      )
                    )}
                  </div>
                </div>
                {/* Decorative circle */}
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;