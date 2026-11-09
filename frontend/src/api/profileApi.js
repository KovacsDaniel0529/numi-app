import { apiFetch } from "./client";

export const saveProfile = (username, data) =>
  apiFetch(`/profile/${encodeURIComponent(username)}`, {
    method: "POST",
    body: data,
  });

export const updateWeight = (username, weight) =>
  apiFetch(`/profile/${encodeURIComponent(username)}/weight`, {
    method: "PATCH",
    body: { weight },
  });
