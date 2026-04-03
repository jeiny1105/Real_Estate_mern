import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../app/apiClient";
import { useNavigate } from "react-router-dom";
import { validateLogin } from "./loginValidation";
import { useAuth } from "../../context/AuthContext";
import {
  MdHomeWork,
  MdLockOutline,
  MdVisibility,
  MdVisibilityOff,
  MdErrorOutline,
  MdMail,
} from "react-icons/md";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setError("");
    setFieldErrors({});
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const { isValid, errors } = validateLogin(formData);
    if (!isValid) {
      setFieldErrors(errors);
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/login", formData);

      const { accessToken, refreshToken, user } = res.data;

      // Save tokens
      sessionStorage.setItem("accessToken", accessToken);
      sessionStorage.setItem("refreshToken", refreshToken);
      sessionStorage.setItem("user", JSON.stringify(user));

      // Update AuthContext
      setUser(user);

      // Redirect to central dashboard router
      navigate("/dashboard");

    } catch (err) {
      console.log("LOGIN ERROR HIT");
      console.log("FULL ERROR:", err);
      console.log("BACKEND MESSAGE:", err.response?.data?.message);

      setError(
        err.response?.data?.message || "Fallback error message"
      );
    } finally {
      setLoading(false);
    }
  };

  const input =
    "w-full bg-white/5 border border-white/20 rounded-xl text-white placeholder:text-white/30 pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 focus:bg-white/10 outline-none transition";

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative px-4"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-black/75" />

      <div className="relative z-10 w-full max-w-[380px]">

        {/* Brand */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shadow-xl">
            <MdHomeWork className="text-white text-4xl" />
          </div>
          <h1 className="mt-3 text-white text-3xl font-semibold">
            DreamHaven
          </h1>
          <p className="text-white/60 text-sm">
            Find your Haven, Live your Dream
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-7 shadow-2xl">
          <div className="mb-6 text-center">
            <h2 className="text-white text-2xl font-semibold">
              Welcome Back
            </h2>
            <p className="text-white/70 text-sm">
              Sign in to continue
            </p>
          </div>

          {error && (
            <div className="mb-4 flex gap-2 text-sm text-red-200 bg-red-500/10 border border-red-400/30 rounded-lg p-3">
              <MdErrorOutline className="text-lg mt-0.5" />
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>

            {/* Email */}
            <div>
              <label className="text-white/80 text-xs uppercase">
                Email Address
              </label>

              <div className="relative mt-2">
                <MdMail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-xl" />
                <input
                  type="email"
                  name="email"
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className={input}
                />
              </div>

              {fieldErrors.email && (
                <p className="text-red-300 text-xs mt-1">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="text-white/80 text-xs uppercase">
                Password
              </label>

              <div className="relative mt-2">
                <MdLockOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-xl" />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/20 rounded-xl text-white pl-11 pr-11 py-3 text-sm focus:ring-2 focus:ring-purple-500 focus:bg-white/10 outline-none transition"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                >
                  {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                </button>
              </div>

              {fieldErrors.password && (
                <p className="text-red-300 text-xs mt-1">
                  {fieldErrors.password}
                </p>
              )}

              <div className="flex justify-end mt-2">
                <Link
                  to="/forgot-password"
                  className="text-xs text-purple-300 hover:text-purple-400 transition"
                >
                  Forgot password?
                </Link>
              </div>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 py-3.5 rounded-xl text-white font-semibold transition disabled:opacity-60"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

            <div className="mt-6 text-center">
              <p className="text-white/70 text-sm">
                Don’t have an account?{" "}
                <Link
                  to="/register"
                  className="text-purple-400 hover:text-purple-500 font-medium transition"
                >
                  Register
                </Link>
              </p>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;