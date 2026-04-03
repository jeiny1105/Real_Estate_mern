import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const DashboardRedirect = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "Admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (user.role === "Seller") {
    return <Navigate to="/seller/dashboard" replace />;
  }

  if (user.role === "Agent") {
    return <Navigate to="/agent/dashboard" replace />;
  }

  return <Navigate to="/" replace />;
};

export default DashboardRedirect;