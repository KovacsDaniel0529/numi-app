import { apiFetch } from "./client";

// +2,5 dl (250 ml) hozzáadása. A válasz: { date, totalAmountMl, goalMl }
export const addWater = (username, amountMl, date) =>
  apiFetch(`/water-logs/${encodeURIComponent(username)}`, {
    method: "POST",
    body: { amountMl, logDate: date },
  });

// Az adott nap utolsó vízbejegyzésének törlése. Ugyanazt az összesítést adja vissza.
export const undoWater = (username, date) =>
  apiFetch(`/water-logs/${encodeURIComponent(username)}/last?date=${date}`, {
    method: "DELETE",
  });