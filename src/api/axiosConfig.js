import axios from "axios";

const API = axios.create({
  baseURL: "https://loan-backend-production-8c32.up.railway.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔑 PUBLIC ENDPOINTS (NO TOKEN)
// ⚠️ IMPORTANT: /api REMOVE pannu
const publicEndpoints = [
  "/users/register",
  "/users/admin/register",
  "/users/login",
];

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const url = config.url || "";

    // ✅ Attach token ONLY if NOT public endpoint
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
