import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { validateRegister } from "./registerValidation";
import api from "../../app/apiClient";
import {
  FaBuilding,
  FaCreditCard,
  FaCheckCircle,
  FaEye,
  FaEyeSlash,
  FaInfoCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import {
  MdHomeWork,
  MdLockOutline,
  MdVisibility,
  MdVisibilityOff,
  MdErrorOutline,
  MdMail,
} from "react-icons/md";
import { MdAddHomeWork } from "react-icons/md";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "Buyer",

    companyName: "",
    gstNumber: "",
    agencyName: "",
    licenseNumber: "",

  });

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((p) => ({ ...p, [name]: value }));
    setFieldErrors((p) => ({ ...p, [name]: "" }));
    setError("");

  };


  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const { isValid, errors } = validateRegister(formData);
    if (!isValid) {
      setFieldErrors(errors);
      return;
    }


    try {
      setLoading(true);

      // 🔒 BUILD CLEAN PAYLOAD BASED ON ROLE
      const payload = { ...formData };


      // Remove unnecessary fields based on role
      if (formData.role === "Buyer") {
        delete payload.companyName;
        delete payload.gstNumber;
        delete payload.agencyName;
        delete payload.licenseNumber;
      }

      if (formData.role === "Seller") {
        delete payload.agencyName;
        delete payload.licenseNumber;
      }

      if (formData.role === "Agent") {
        delete payload.companyName;
        delete payload.gstNumber;
      }

      console.log("📤 Clean payload:", payload);

      const endpoint =
        formData.role === "Seller"
          ? "/auth/register/seller"
          : formData.role === "Agent"
            ? "/auth/register/agent"
            : "/auth/register";

      await api.post(endpoint, payload);

      alert("Registration successful 🎉 Please login.");
    } catch (err) {
      const msg = err.response?.data?.message;

      if (msg === "Email already registered") {
        setError("This email is already registered. Please login.");
      } else if (!err.response) {
        setError("Network error. Please check your connection.");
      } else {
        setError(err.response?.data?.message || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }

  };

  /* ================= STYLES ================= */
  const input =
    "w-full bg-white/5 border border-white/20 rounded-xl text-white px-4 py-3 text-sm placeholder:text-white/30 focus:ring-2 focus:ring-purple-500 focus:bg-white/10 outline-none transition";

  const select =
    "w-full bg-white/5 border border-white/20 rounded-xl text-white px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 focus:bg-white/10 outline-none transition appearance-none";

  const label = "text-white/80 text-xs font-medium uppercase tracking-wide";
  const errorText = "text-red-300 text-xs mt-1";

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative px-4"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-10 w-full max-w-[720px]">
        {/* BRAND */}
        <div className="text-center mb-6">
          <div className="mx-auto mb-3 w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
            <MdHomeWork className="text-white text-3xl" />
          </div>
          <h2 className="text-white text-2xl font-semibold">DreamHaven</h2>
          <p className="text-white/60 text-sm">
            Find your haven. Live your dream.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 space-y-6 shadow-2xl"
        >
          {/* GLOBAL ERROR */}
          {error && (
            <div className="flex gap-2 items-start bg-red-500/10 border border-red-400/30 text-red-200 text-sm rounded-lg p-3">
              <FaExclamationTriangle className="mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* BASIC INFO */}
          <section className="space-y-4">
            <h3 className="text-white font-semibold text-sm uppercase">
              Account Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={label}>Full Name</label>
                <input name="name" onChange={handleChange} className={input} />
                {fieldErrors.name && (
                  <p className={errorText}>{fieldErrors.name}</p>
                )}
              </div>

              <div>
                <label className={label}>Email Address</label>
                <input
                  name="email"
                  type="email"
                  onChange={handleChange}
                  className={input}
                />
                {fieldErrors.email && (
                  <p className={errorText}>{fieldErrors.email}</p>
                )}
              </div>

              <div>
                <label className={label}>Phone Number</label>
                <input
                  name="phone"
                  maxLength={10}
                  onChange={handleChange}
                  className={input}
                />
                {fieldErrors.phone && (
                  <p className={errorText}>{fieldErrors.phone}</p>
                )}
              </div>

              <div className="relative">
                <label className={label}>Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  onChange={handleChange}
                  className={input}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-[38px] text-white/60"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>

                {fieldErrors.password ? (
                  <p className={errorText}>{fieldErrors.password}</p>
                ) : (
                  <p className="text-white/40 text-xs mt-1 flex items-center gap-1">
                    <FaInfoCircle /> Minimum 6 characters
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* ROLE */}
          <div>
            <label className={label}>Register As</label>
            <select name="role" onChange={handleChange} className={select}>
              <option value="Buyer">Buyer</option>
              <option value="Seller">Seller</option>
              <option value="Agent">Agent</option>
            </select>
          </div>

          {/* SELLER */}
          {formData.role === "Seller" && (
            <section className="border border-white/20 rounded-2xl p-5 space-y-4">
              <h3 className="text-white font-semibold text-sm uppercase">
                Seller Information
              </h3>

              <div>
                <label className={label}>Company Name</label>
                <input
                  name="companyName"
                  onChange={handleChange}
                  className={input}
                />
                {fieldErrors.companyName && (
                  <p className={errorText}>{fieldErrors.companyName}</p>
                )}
              </div>

              <div>
                <label className={label}>GST Number (Optional)</label>
                <input
                  name="gstNumber"
                  onChange={handleChange}
                  className={input}
                />
              </div>
            </section>
          )}

          {/* AGENT */}
          {formData.role === "Agent" && (
            <section className="border border-white/20 rounded-2xl p-5 space-y-4">
              <h3 className="text-white font-semibold text-sm uppercase">
                Agent Information
              </h3>

              <div>
                <label className={label}>Agency Name</label>
                <input
                  name="agencyName"
                  onChange={handleChange}
                  className={input}
                />
                {fieldErrors.agencyName && (
                  <p className={errorText}>{fieldErrors.agencyName}</p>
                )}
              </div>

              <div>
                <label className={label}>License Number</label>
                <input
                  name="licenseNumber"
                  onChange={handleChange}
                  className={input}
                />
                {fieldErrors.licenseNumber && (
                  <p className={errorText}>{fieldErrors.licenseNumber}</p>
                )}
              </div>
            </section>
          )}

          <button
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-60 py-3 rounded-xl text-white font-semibold"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <div className="text-center mt-6">
            <p className="text-white/70 text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-purple-400 hover:text-purple-500 font-medium transition"
              >
                Login
              </Link>
            </p>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Register;
