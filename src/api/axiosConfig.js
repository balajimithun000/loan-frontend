import axios from "axios";

const API = axios.create({
  baseURL: "https://loan-backend-production-8c32.up.railway.app",
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

    // ✅ DO NOT attach token for public APIs
    if (
      token &&
      !publicEndpoints.some((url) => config.url.includes(url))
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
