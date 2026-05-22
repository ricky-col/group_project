import axios from "axios";

const API = axios.create({
  baseURL: "https://group-project1-5ai9.onrender.com/api",
  withCredentials: true
});

API.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;