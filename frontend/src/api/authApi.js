import { apiFetch } from "./client";

export const register = (data) =>
  apiFetch("/register", { method: "POST", body: data });
export const login = (data) =>
  apiFetch("/login", { method: "POST", body: data });
export const getUser = (username) =>
  apiFetch(`/stats/${encodeURIComponent(username)}`);
