import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
export function getToken() { return localStorage.getItem("token") || ""; }
export function setToken(t) { localStorage.setItem("token", t); }

export const api = axios.create({ baseURL: API_URL });
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export async function register(payload) {
  const { data } = await api.post("/api/auth/register", payload);
  return data;
}

export async function login(payload) {
  const { data } = await api.post("/api/auth/login", payload);
  return data;
}

export async function fetchIssues(params) {
  const { data } = await api.get("/api/issues", { params });
  return data;
}

export async function createIssue(formData) {
  const { data } = await api.post("/api/issues", formData, { headers: { "Content-Type": "multipart/form-data" } });
  return data;
}

export async function updateIssueStatus(id, payload) {
  const { data } = await api.patch(`/api/issues/${id}/status`, payload);
  return data;
}

export async function analyticsSummary() {
  const { data } = await api.get("/api/analytics/summary");
  return data;
}
