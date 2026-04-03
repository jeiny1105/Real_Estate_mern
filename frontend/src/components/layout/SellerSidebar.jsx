import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaHome,
  FaPlusCircle,
  FaChartLine,
  FaUserCircle,
  FaSignOutAlt,
  FaFileInvoice,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const SellerSidebar = ({ isSubscriptionValid }) => {
  const { logout } = useAuth();

  const linkStyle =
    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium";

  const activeStyle = "bg-purple-600 text-white shadow-lg";
  const inactiveStyle =
    "text-slate-300 hover:bg-white/5 hover:text-white";
  const lockedStyle = "opacity-40 cursor-not-allowed pointer-events-none";

  return (
    <div className="w-64 h-screen bg-slate-950 border-r border-white/10 p-6 fixed flex flex-col justify-between">

      {/* Top Section */}
      <div>
        {/* Logo */}
        <div className="text-2xl font-black mb-10 text-white">
          Dream<span className="text-purple-500">Haven</span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-3">

          {/* Dashboard */}
          <NavLink
            to="/seller/dashboard"
            className={({ isActive }) =>
              `${linkStyle} ${isActive ? activeStyle : inactiveStyle}`
            }
          >
            <FaTachometerAlt /> Dashboard
          </NavLink>

          {/* My Listings */}
          <NavLink
            to="/seller/listings"
            className={({ isActive }) =>
              `${linkStyle} ${isActive ? activeStyle : inactiveStyle}`
            }
          >
            <FaHome /> My Listings
          </NavLink>

          {/* Add Property */}
          <NavLink
            to={isSubscriptionValid ? "/seller/add-property" : "#"}
            className={({ isActive }) =>
              `${linkStyle} ${isActive ? activeStyle : inactiveStyle
              } ${!isSubscriptionValid ? lockedStyle : ""}`
            }
          >
            <FaPlusCircle />
            Add Property
            {!isSubscriptionValid && (
              <span className="ml-auto text-xs text-purple-400">
                🔒
              </span>
            )}
          </NavLink>

          {/* Analytics */}
          <NavLink
            to={isSubscriptionValid ? "/seller/analytics" : "#"}
            className={({ isActive }) =>
              `${linkStyle} ${isActive ? activeStyle : inactiveStyle
              } ${!isSubscriptionValid ? lockedStyle : ""}`
            }
          >
            <FaChartLine />
            Analytics
            {!isSubscriptionValid && (
              <span className="ml-auto text-xs text-purple-400">
                🔒
              </span>
            )}
          </NavLink>

          {/* Subscription */}
          <NavLink
            to="/seller/subscription"
            className={({ isActive }) =>
              `${linkStyle} ${isActive ? activeStyle : inactiveStyle}`
            }
          >
            💎 Subscription
          </NavLink>

          {/* Billing */}
          <NavLink
            to="/seller/billing"
            className={({ isActive }) =>
              `${linkStyle} ${isActive ? activeStyle : inactiveStyle}`
            }
          >
            <FaFileInvoice /> Billing
          </NavLink>

          {/* Profile */}
          <NavLink
            to="/seller/profile"
            className={({ isActive }) =>
              `${linkStyle} ${isActive ? activeStyle : inactiveStyle}`
            }
          >
            <FaUserCircle /> Profile
          </NavLink>

        </nav>
      </div>

      {/* Bottom Section */}
      <div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>

    </div>
  );
};

export default SellerSidebar;