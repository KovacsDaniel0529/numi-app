export const ALLERGENS = [
  { value: "GLUTEN", label: "Glutén" },
  { value: "SHELLFISH", label: "Rákfélék" },
  { value: "EGG", label: "Tojás" },
  { value: "FISH", label: "Hal" },
  { value: "PEANUT", label: "Földimogyoró" },
  { value: "SOY", label: "Szójabab" },
  { value: "LACTOSE", label: "Tej és tejtermékek" },
  { value: "NUTS", label: "Diófélék" },
  { value: "CELERY", label: "Zeller" },
  { value: "MUSTARD", label: "Mustár" },
  { value: "SESAME", label: "Szezámmag" },
  { value: "SULPHITES", label: "Kén-dioxid" },
  { value: "LUPIN", label: "Csillagfürt" },
  { value: "MOLLUSCS", label: "Puhatestűek" },
];

export const allergenLabel = (value) =>
  ALLERGENS.find((a) => a.value === value)?.label ?? value;
