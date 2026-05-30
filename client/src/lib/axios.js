import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8081/api/v0",
  withCredentials: true,
});

export default api;
