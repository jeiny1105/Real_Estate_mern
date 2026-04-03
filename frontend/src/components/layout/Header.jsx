import {
  FaHeart,
  FaBell,
  FaCalendarCheck,
  FaBars,
  FaTimes,
  FaUserCircle,
  FaChevronDown,
  FaHome,
} from "react-icons/fa";

import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const notificationCount = 2;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) =>
    location.pathname === path
      ? "text-purple-400 font-semibold"
      : "text-slate-300 hover:text-white transition";

  const getNavLinks = () => {
    const links = [
      { name: "Home", path: "/" },
      { name: "Properties", path: "/properties" },
      { name: "About", path: "/about" },
    ];

    if (!user) return links;

    // 🔥 BUYER NAV
    if (user.role === "Buyer") {
      links.push(
        { name: "Wishlist", path: "/wishlist", icon: <FaHeart /> },

        // ✅ NEW: INQUIRIES
        { name: "Inquiries", path: "/buyer/inquiries" },

        {
          name: "Visits",
          icon: <FaCalendarCheck />,
          dropdown: [
            { name: "Scheduled Visits", path: "/visits/scheduled" },
            { name: "Visit History", path: "/visits/booked" },
          ],
        },

        {
          name: "Notifications",
          path: "/notifications",
          badge: notificationCount,
          icon: <FaBell />,
        }
      );
    }

    // SELLER
    if (user.role === "Seller") {
      links.push({ name: "Dashboard", path: "/seller/dashboard" });
    }

    // AGENT
    if (user.role === "Agent") {
      links.push({ name: "Dashboard", path: "/agent/dashboard" });
    }

    // ADMIN
    if (user.role === "Admin") {
      links.push({ name: "Admin Panel", path: "/admin" });
    }

    return links;
  };

  const navLinks = getNavLinks();

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-slate-950/90 backdrop-blur-xl border-b border-white/10 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-purple-600/20 border border-purple-500/30 backdrop-blur-md">
            <FaHome className="text-white text-lg" />
          </div>

          <div className="text-2xl font-black tracking-tight text-black">
            Dream<span className="text-purple-500">Haven</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-8 text-sm">
          {navLinks.map((link, idx) =>
            link.dropdown ? (
              <li key={idx} className="relative group">
                <div className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white transition">
                  {link.icon}
                  {link.name}
                  <FaChevronDown size={12} />
                </div>

                {/* Dropdown */}
                <ul className="absolute top-8 left-0 bg-slate-900 border border-white/10 rounded-xl shadow-xl w-56 text-sm z-50 backdrop-blur-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  {link.dropdown.map((d, i) => (
                    <Link key={i} to={d.path}>
                      <li className="px-4 py-3 hover:bg-white/5 transition">
                        {d.name}
                      </li>
                    </Link>
                  ))}
                </ul>
              </li>
            ) : (
              <Link key={idx} to={link.path} className={isActive(link.path)}>
                <li className="flex items-center gap-2">
                  {link.icon}
                  {link.name}

                  {link.badge && (
                    <span className="ml-1 bg-red-500 text-xs px-1.5 rounded-full">
                      {link.badge}
                    </span>
                  )}
                </li>
              </Link>
            )
          )}
        </ul>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-4">
          {!user ? (
            <>
              <button
                onClick={() => navigate("/login")}
                className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition text-sm text-white"
              >
                Login
              </button>

              <button
                onClick={() => navigate("/register")}
                className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 transition text-sm font-bold shadow-lg shadow-purple-600/20"
              >
                Get Started
              </button>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl hover:bg-white/10 transition"
              >
                <FaUserCircle size={20} />
                <FaChevronDown size={12} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-44 bg-slate-900 border border-white/10 rounded-xl shadow-xl backdrop-blur-xl">
                  <Link to="/profile">
                    <div className="px-4 py-3 hover:bg-white/5 cursor-pointer">
                      Profile
                    </div>
                  </Link>

                  <div
                    onClick={handleLogout}
                    className="px-4 py-3 hover:bg-white/5 cursor-pointer text-red-400"
                  >
                    Logout
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-white/10 px-6 py-6">
          <ul className="flex flex-col gap-4 text-sm">
            {navLinks.map((link, idx) =>
              link.dropdown ? (
                <li key={idx}>
                  <div className="flex items-center gap-2 text-slate-300">
                    {link.icon}
                    {link.name}
                  </div>

                  <ul className="pl-4 mt-2 flex flex-col gap-2">
                    {link.dropdown.map((d, i) => (
                      <Link
                        key={i}
                        to={d.path}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <li>{d.name}</li>
                      </Link>
                    ))}
                  </ul>
                </li>
              ) : (
                <Link
                  key={idx}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <li className="flex items-center gap-2 text-slate-300">
                    {link.icon}
                    {link.name}
                  </li>
                </Link>
              )
            )}
          </ul>
        </div>
      )}
    </header>
  );
}

export default Header;