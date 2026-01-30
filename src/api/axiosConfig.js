import axios from "axios";

const API = axios.create({
  baseURL: "https://loan-backend-production-8c32.up.railway.app",
  headers: {
    "Content-Type": "application/json",
  },
});


API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
