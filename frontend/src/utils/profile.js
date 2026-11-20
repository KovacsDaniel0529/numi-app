// A backend a profil mentésekor a TELJES profilt várja (a POST /api/profile/{username}
// kalória- és vízcélt is újraszámol belőle). Ezért módosításkor a jelenlegi értékekből
// összeállítjuk a teljes csomagot, és csak azt írjuk felül, ami változott.
export const buildProfilePayload = (profile, overrides = {}) => ({
  firstName: profile.firstName,
  gender: profile.gender,
  age: profile.age,
  height: profile.height,
  weight: profile.weight,
  goal: profile.goal,
  activityLevel: profile.activityLevel,
  dietaryPreference: profile.dietaryPreference ?? "omnivore",
  allergies: profile.allergies ?? [],
  // Korábban itt üres lista volt, ezért minden mentés kitörölte volna a panaszokat
  digestiveIssues: profile.digestiveIssues ?? [],
  ...overrides,
});

// BMI = testsúly (kg) / magasság (m) négyzete
export const calculateBmi = (weightKg, heightCm) => {
  if (!weightKg || !heightCm) return null;
  const meters = heightCm / 100;
  return weightKg / (meters * meters);
};

export const bmiCategory = (bmi) => {
  if (bmi < 18.5) return "Alacsony testsúly";
  if (bmi < 25) return "Normál testsúly";
  if (bmi < 30) return "Túlsúly";
  return "Elhízás";
};