import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://cookcartai-production.up.railway.app"
});

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("cookCartUser") || "null");
  } catch (error) {
    localStorage.removeItem("cookCartUser");
    return null;
  }
};

api.interceptors.request.use((config) => {
  const user = getStoredUser();
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});

export default api;
