import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_APP_URL,
});

export default api;
