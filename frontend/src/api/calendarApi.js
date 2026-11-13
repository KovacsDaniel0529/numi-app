import { apiFetch } from "./client";

// Egy nap összesítése: kalória, makrók, étkezések, víz
export const getDay = (username, date) =>
  apiFetch(`/calendar/${encodeURIComponent(username)}/day?date=${date}`);

// Egy hónap összesítése: csak azok a napok szerepelnek, amelyeken van étel vagy víz
export const getMonth = (username, year, month) =>
  apiFetch(`/calendar/${encodeURIComponent(username)}/month?year=${year}&month=${month}`);