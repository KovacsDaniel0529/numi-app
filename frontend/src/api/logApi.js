import { apiFetch } from "./client";

export const addFoodLog = (username, data) =>
  apiFetch(`/food-logs/${encodeURIComponent(username)}`, { method: "POST", body: data });

export const deleteFoodLog = (id) =>
  apiFetch(`/food-logs/${id}`, { method: "DELETE" });