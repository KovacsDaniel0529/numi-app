import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import AllergySelector from "../components/AllergySelector";
import { saveProfile } from "../api/profileApi";
import {
  ACTIVITY_LEVELS,
  DIETARY_PREFERENCES,
  DIGESTIVE_ISSUES,
  GENDERS,
  GOALS,
} from "../constants/profile";

// A nemek színe (a feliratot a közös GENDERS lista adja)
const GENDER_STYLES = {
  male: "bg-blue-500/20 border-blue-500 text-blue-400",
  female: "bg-pink-500/20 border-pink-500 text-pink-400",
};

const TOTAL_STEPS = 5;

const NEXT_BUTTON =
  "w-full py-4 bg-[#68D391] text-[#1a1f26] rounded-2xl font-bold uppercase tracking-widest hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer";

const BackButton = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full py-3 rounded-2xl border border-white/10 text-slate-400 hover:border-white/20 hover:text-white transition-all"
  >
    Vissza
  </button>
);

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, refreshUser, loading } = useContext(UserContext);
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    gender: "female",
    age: "",
    height: "",
    weight: "",
    goal: "maintain",
    activityLevel: 1.2,
    dietaryPreference: "omnivore",
    allergies: [],
    digestiveIssues: [],
  });

  // Nincs bejelentkezve -> belépés. Már van profilja -> nincs mit kitölteni, a Naplóra megyünk.
  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/login");
    else if (user.profileDetail) navigate("/diary");
  }, [user, loading, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(""); // ha gépel, eltűnik a hibaüzenet
  };

  const toggleList = (listName, item) => {
    setFormData((prev) => ({
      ...prev,
      [listName]: prev[listName].includes(item)
        ? prev[listName].filter((i) => i !== item)
        : [...prev[listName], item],
    }));
  };

  // Validáció az 1. lépés "Tovább" gombjához
  const handleNextStep1 = () => {
    const { firstName, age, height, weight } = formData;
    const numAge = Number(age);
    const numHeight = Number(height);
    const numWeight = Number(weight);

    if (!firstName.trim()) {
      setError("Kérlek, add meg a keresztneved!");
      return;
    }

    if (!age || !height || !weight) {
      setError("Kérlek, töltsd ki a kor, magasság és súly mezőt!");
      return;
    }

    // Kamu adatok (pl. 1-1-1 vagy mindegyik ugyanaz) szűrése
    if (numAge === numHeight && numHeight === numWeight) {
      setError("Kérlek, valós adatokat adj meg (nem lehet minden szám azonos)!");
      return;
    }

    // Életszerű tartományok (ugyanazok, mint a Profil oldalon)
    if (
      numAge < 10 || numAge > 120 ||
      numHeight < 50 || numHeight > 260 ||
      numWeight < 25 || numWeight > 400
    ) {
      setError("Kérlek, valós adatokat adj meg (10–120 év, 50–260 cm, 25–400 kg)!");
      return;
    }

    setError("");
    setStep(2);
  };

  const handleFinish = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    const finalData = {
      firstName: formData.firstName.trim(),
      gender: formData.gender,
      age: parseInt(formData.age, 10),
      height: parseFloat(formData.height),
      weight: parseFloat(formData.weight),
      goal: formData.goal,
      activityLevel: parseFloat(formData.activityLevel),
      dietaryPreference: formData.dietaryPreference,
      allergies: formData.allergies,
      digestiveIssues: formData.digestiveIssues,
    };

    setSaving(true);
    setError("");
    try {
      await saveProfile(user.username, finalData);
      await refreshUser();
      navigate("/diary");
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white font-lemon">
        Betöltés...
      </div>
    );
  }

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12 relative overflow-hidden text-white font-lemon">
      <div className="max-w-2xl w-full bg-[#101317]/80 backdrop-blur-xl p-8 md:p-12 rounded-[3rem] shadow-2xl border border-white/10 z-10">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-4">
            <span className={step >= 1 ? "text-[#68D391]" : ""}>Adatok</span>
            <span className={step >= 2 ? "text-[#68D391]" : ""}>Célok</span>
            <span className={step >= 3 ? "text-[#68D391]" : ""}>Aktivitás</span>
            <span className={step >= 4 ? "text-[#68D391]" : ""}>Allergiák</span>
            <span className={step >= 5 ? "text-[#68D391]" : ""}>Étrend</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#68D391] to-emerald-400 transition-all duration-700"
              style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </div>

        {/* 1. Lépés: Alapadatok */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl uppercase tracking-widest text-center mb-8">Ki vagy te?</h2>

            {error && (
              <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded-2xl border border-red-500/20 text-center">
                {error}
              </div>
            )}

            <input
              type="text"
              name="firstName"
              placeholder="Keresztneved"
              value={formData.firstName}
              onChange={handleChange}
              maxLength={40}
              className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-[#68D391] transition-colors"
            />

            <div className="flex gap-4">
              {GENDERS.map((g) => (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, gender: g.value })}
                  className={`flex-1 py-3 rounded-xl border transition-all ${
                    formData.gender === g.value ? GENDER_STYLES[g.value] : "bg-white/5 border-white/10"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { name: "age", placeholder: "Kor" },
                { name: "height", placeholder: "cm" },
                { name: "weight", placeholder: "kg" },
              ].map((field) => (
                <input
                  key={field.name}
                  type="number"
                  name={field.name}
                  min="0"
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onChange={handleChange}
                  onKeyDown={(e) => (e.key === "-" || e.key === "e") && e.preventDefault()}
                  className="bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-[#68D391] transition-colors"
                />
              ))}
            </div>

            <button type="button" onClick={handleNextStep1} className={NEXT_BUTTON}>
              Tovább
            </button>
          </div>
        )}

        {/* 2. Lépés: Cél */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl uppercase tracking-widest text-center">Mi a célod?</h2>
            <div className="grid gap-3">
              {GOALS.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, goal: item.value })}
                  className={`p-5 rounded-2xl border transition-all ${
                    formData.goal === item.value
                      ? "bg-[#68D391] text-[#1a1f26] border-[#68D391] font-bold"
                      : "bg-white/5 border-white/10 text-white hover:border-white/20"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <button type="button" onClick={() => setStep(3)} className={NEXT_BUTTON}>
              Tovább
            </button>
            <BackButton onClick={() => setStep(1)} />
          </div>
        )}

        {/* 3. Lépés: Aktivitási szint */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl uppercase tracking-widest text-center">Aktivitás</h2>
            <div className="grid gap-3">
              {ACTIVITY_LEVELS.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, activityLevel: item.value })}
                  className={`p-4 rounded-2xl border transition-all ${
                    formData.activityLevel === item.value
                      ? "bg-[#68D391] text-[#1a1f26] border-[#68D391] font-bold"
                      : "bg-white/5 border-white/10 text-white hover:border-white/20"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <button type="button" onClick={() => setStep(4)} className={NEXT_BUTTON}>
              Tovább
            </button>
            <BackButton onClick={() => setStep(2)} />
          </div>
        )}

        {/* 4. Lépés: Allergiák */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-2xl uppercase tracking-widest text-center mb-4">
              Allergiák és intoleranciák
            </h2>
            <AllergySelector
              selectedAllergies={formData.allergies}
              onToggle={(item) => toggleList("allergies", item)}
              onClear={() => setFormData((prev) => ({ ...prev, allergies: [] }))}
            />
            <button type="button" onClick={() => setStep(5)} className={`${NEXT_BUTTON} mt-6`}>
              Tovább
            </button>
            <BackButton onClick={() => setStep(3)} />
          </div>
        )}

        {/* 5. Lépés: Étkezési szokások és küldés */}
        {step === 5 && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-2xl uppercase tracking-widest text-center mb-4">Étkezési szokásaid</h2>

            {error && (
              <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded-2xl border border-red-500/20 text-center">
                {error}
              </div>
            )}

            <div>
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">Étrend</p>
              <div className="grid grid-cols-2 gap-3">
                {DIETARY_PREFERENCES.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, dietaryPreference: item.value })}
                    className={`p-4 rounded-2xl border transition-all ${
                      formData.dietaryPreference === item.value
                        ? "bg-[#68D391] text-[#1a1f26] border-[#68D391] font-bold"
                        : "bg-white/5 border-white/10 text-white hover:border-white/20"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">
                Emésztési panaszok (nem kötelező)
              </p>

              {/* "Nincs panaszom": egy kattintással törli a választásokat, ugyanúgy, mint az allergiáknál */}
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, digestiveIssues: [] }))}
                className={`w-full p-4 rounded-2xl border transition-all mb-3 ${
                  formData.digestiveIssues.length === 0
                    ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                    : "bg-white/5 border-white/10 text-slate-400"
                }`}
              >
                Nincs panaszom
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {DIGESTIVE_ISSUES.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => toggleList("digestiveIssues", item.value)}
                    className={`p-3 rounded-xl border text-sm transition-all ${
                      formData.digestiveIssues.includes(item.value)
                        ? "bg-amber-500/20 border-amber-500 text-amber-300"
                        : "bg-white/5 border-white/10 text-slate-300 hover:border-white/20"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-3">
                Ezek csak a receptjavaslatokat befolyásolják. Később a Profilban bármikor módosíthatod.
              </p>
            </div>

            <button
              type="button"
              onClick={handleFinish}
              disabled={saving}
              className={`${NEXT_BUTTON} mt-6 shadow-[0_0_20px_rgba(104,211,145,0.3)] disabled:opacity-60`}
            >
              {saving ? "Mentés..." : "Beállítások mentése"}
            </button>
            <BackButton onClick={() => setStep(4)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;