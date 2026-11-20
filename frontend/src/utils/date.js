const pad = (n) => String(n).padStart(2, "0");

// Date -> "YYYY-MM-DD" a HELYI időzóna szerint
// (a toISOString() UTC-t használna, éjfél környékén ezért tévedne egy napot)
const toIso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const todayLocal = () => toIso(new Date());

// "2026-11-17" alakú, létező dátum-e
export const isValidDate = (value) =>
  /^\d{4}-\d{2}-\d{2}$/.test(value ?? "") &&
  !Number.isNaN(new Date(`${value}T00:00:00`).getTime());

// A kapott dátumhoz hozzáad (vagy kivon) napokat: addDays("2026-11-17", -1) -> "2026-11-16"
export const addDays = (iso, delta) => {
  const [y, m, d] = iso.split("-").map(Number);
  return toIso(new Date(y, m - 1, d + delta));
};

// "2026. november 17., kedd"
export const formatDateHu = (iso) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("hu-HU", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
};

// Az URL-ből érkező ?date= értékből biztonságos dátumot csinál:
// hibás vagy jövőbeli érték esetén a mai napot adja vissza.
export const resolveDate = (param) => {
  const today = todayLocal();
  return isValidDate(param) && param <= today ? param : today;
};