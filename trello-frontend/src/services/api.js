import axios from "axios";

const API = axios.create({
  baseURL: "https://group-project1-5ai9.onrender.com/api",
  withCredentials: true
});

export default API;