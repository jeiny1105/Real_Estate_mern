import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * 🔐 REQUEST INTERCEPTOR
 */
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * 🚨 RESPONSE INTERCEPTOR
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || "";

    const isAuthLogin = requestUrl.includes("/auth/login");

    if (status === 401 && !isAuthLogin) {
      console.warn("JWT expired or invalid. Logging out...");

      // Clear stored auth data
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("refreshToken");
      sessionStorage.removeItem("user");

      // Redirect to login
      window.location.replace("/login");
    }

    return Promise.reject(error);
  }
);

export default api;