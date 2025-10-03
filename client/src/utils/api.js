import axios from "axios";

const rawBase = process.env.REACT_APP_API_BASE_URL || "";
const normalizedBase = rawBase.replace(/\/+$/, "");
const baseWithApi = normalizedBase.endsWith("/api")
  ? normalizedBase
  : `${normalizedBase}/api`;

const api = axios.create({
  baseURL: baseWithApi,
});

export default api;
