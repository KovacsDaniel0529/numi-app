// A profil választható értékei egy helyen, hogy ne kelljen mindenhol megismételni.
// A value az, amit a backend vár, a label az, amit a felhasználó lát.

export const GENDERS = [
  { value: "male", label: "Férfi" },
  { value: "female", label: "Nő" },
];

export const GOALS = [
  { value: "lose", label: "Fogyás" },
  { value: "maintain", label: "Súlytartás" },
  { value: "gain", label: "Izomépítés" },
];

export const ACTIVITY_LEVELS = [
  { value: 1.2, label: "Ülőmunka" },
  { value: 1.375, label: "Mérsékelt" },
  { value: 1.55, label: "Aktív" },
  { value: 1.725, label: "Nagyon aktív" },
];

// Az értékeknek egyezniük kell a backend ProfileRequestDTO-ban engedélyezettekkel
export const DIETARY_PREFERENCES = [
  { value: "omnivore", label: "Mindenevő" },
  { value: "vegetarian", label: "Vegetáriánus" },
  { value: "vegan", label: "Vegán" },
  { value: "pescatarian", label: "Pescetáriánus" },
];

export const DIGESTIVE_ISSUES = [
  { value: "bloating", label: "Puffadás" },
  { value: "reflux", label: "Reflux" },
  { value: "ibs", label: "Irritábilis bélrendszer (IBS)" },
  { value: "constipation", label: "Székrekedés" },
  { value: "diarrhea", label: "Hasmenésre való hajlam" },
];

// Visszaadja egy érték feliratát, vagy "Nincs megadva" szöveget
export const labelOf = (list, value) =>
  list.find((item) => item.value === value)?.label ?? "Nincs megadva";