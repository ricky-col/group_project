import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3333/api",
  withCredentials: true
});

export default API;