import { apiFetch } from "./client";

export const getFoods = (username, search = "") => {
  const params = new URLSearchParams();
  if (username) params.set("username", username);
  if (search) params.set("search", search);
  const query = params.toString();
  return apiFetch(`/foods${query ? `?${query}` : ""}`);
};