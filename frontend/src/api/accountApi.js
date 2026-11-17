import { apiFetch } from "./client";

export const changePassword = (username, currentPassword, newPassword) =>
  apiFetch(`/account/${encodeURIComponent(username)}/password`, {
    method: "PATCH",
    body: { currentPassword, newPassword },
  });

export const deleteAccount = (username, password) =>
  apiFetch(`/account/${encodeURIComponent(username)}`, {
    method: "DELETE",
    body: { password },
  });