import axios from "axios";

const API = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔑 PUBLIC ENDPOINTS (NO TOKEN)
const publicEndpoints = [
  "/api/users/register",
  "/api/users/admin/register",
  "/api/users/login",
];

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // Normalize URL (important)
    const url = config.url || "";

    // ✅ Attach token ONLY for protected APIs
    if (
      token &&
      !publicEndpoints.some((endpoint) => url.startsWith(endpoint))
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
