import axios from "axios";

const api = axios.create({
  baseURL: "https://spendgrid-2.onrender.com/api/v0",
  withCredentials: true,
});

export default api;
