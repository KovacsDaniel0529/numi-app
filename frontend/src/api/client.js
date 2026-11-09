const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api";

export async function apiFetch(path, { method = "GET", body } = {}) {
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: body !== undefined ? { "Content-Type": "application/json" } : {},
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("A szerver nem érhető el. Fut a backend?");
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    // üres vagy nem JSON válasz
  }

  if (!response.ok) {
    const error = new Error(data?.message || "Ismeretlen hiba történt.");
    error.status = response.status;
    throw error;
  }
  return data;
}
