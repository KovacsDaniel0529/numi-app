import { apiFetch } from "./client";

// Az AI recept kérése. Lassú lehet (néhány másodperc), ezért a hívó oldalon kell egy "töltés" állapot.
export const generateRecipe = (username, preferences) =>
  apiFetch(`/recipes/${encodeURIComponent(username)}`, {
    method: "POST",
    body: { preferences },
  });

// Mentett receptek
export const saveRecipe = (username, recipe) =>
  apiFetch(`/saved-recipes/${encodeURIComponent(username)}`, {
    method: "POST",
    body: {
      title: recipe.title,
      description: recipe.description,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      calories: recipe.calories,
      protein: recipe.protein,
      carbs: recipe.carbs,
      fat: recipe.fat,
    },
  });

export const getSavedRecipes = (username) =>
  apiFetch(`/saved-recipes/${encodeURIComponent(username)}`);

export const deleteSavedRecipe = (username, id) =>
  apiFetch(`/saved-recipes/${encodeURIComponent(username)}/${id}`, { method: "DELETE" });