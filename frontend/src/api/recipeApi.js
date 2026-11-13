import { apiFetch } from "./client";

// Az AI recept kérése. Lassú lehet (néhány másodperc), ezért a hívó oldalon kell egy "töltés" állapot.
export const generateRecipe = (username, preferences) =>
  apiFetch(`/recipes/${encodeURIComponent(username)}`, {
    method: "POST",
    body: { preferences },
  });