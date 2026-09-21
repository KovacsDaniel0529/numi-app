import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import AllergySelector from "../components/AllergySelector";

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, refreshUser, loading } = useContext(UserContext);
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

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

  // Ha a felhasználó nincs bejelentkezve, visszairányítjuk a login oldalra
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
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

    // 1. Név és mezők kitöltöttségének ellenőrzése
    if (!firstName.trim()) {
      setError("Kérlek, add meg a keresztneved!");
      return;
    }

    if (
      !age ||
      !height ||
      !weight ||
      numAge <= 0 ||
      numHeight <= 0 ||
      numWeight <= 0
    ) {
      setError("Minden számadatot kötelező 0-nál nagyobb értékkel kitölteni!");
      return;
    }

    // 2. Kamu adatok (pl. 1-1-1 vagy mindegyik ugyanaz) szűrése
    if (numAge === numHeight && numHeight === numWeight) {
      setError(
        "Kérlek, valós adatokat adj meg (nem lehet minden szám azonos)!",
      );
      return;
    }

    // 3. Életszerű minimumok (hogy ne lehessen 1 éves, 1 cm vagy 1 kg)
    if (numAge < 10 || numHeight < 50 || numWeight < 25) {
      setError(
        "Kérlek, valós fizikai adatokat adj meg (min. 10 év, 50 cm, 25 kg)!",
      );
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
      firstName: formData.firstName,
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

    try {
      const response = await fetch(
        `http://localhost:8080/api/profile/${user.username}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(finalData),
        },
      );

      if (response.ok) {
        await refreshUser();
        navigate("/diary");
      } else {
        console.error("Hiba történt a profil mentésekor:", response.statusText);
      }
    } catch (error) {
      console.error("Hálózati hiba:", error);
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
            <span className={step >= 4 ? "text-[#68D391]" : ""}>Egészség</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#68D391] to-emerald-400 transition-all duration-700"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* 1. Lépés: Alapadatok */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl uppercase tracking-widest text-center mb-8">
              Ki vagy te?
            </h2>

            {/* Hibaüzenet sáv */}
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
              className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-[#68D391] transition-colors"
            />
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, gender: "male" })}
                className={`flex-1 py-3 rounded-xl border transition-all ${
                  formData.gender === "male"
                    ? "bg-blue-500/20 border-blue-500 text-blue-400"
                    : "bg-white/5 border-white/10"
                }`}
              >
                Férfi
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, gender: "female" })}
                className={`flex-1 py-3 rounded-xl border transition-all ${
                  formData.gender === "female"
                    ? "bg-pink-500/20 border-pink-500 text-pink-400"
                    : "bg-white/5 border-white/10"
                }`}
              >
                Nő
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <input
                type="number"
                name="age"
                min="0"
                placeholder="Kor"
                value={formData.age}
                onChange={handleChange}
                onKeyDown={(e) =>
                  (e.key === "-" || e.key === "e") && e.preventDefault()
                }
                className="bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-[#68D391] transition-colors"
              />
              <input
                type="number"
                name="height"
                min="0"
                placeholder="cm"
                value={formData.height}
                onChange={handleChange}
                onKeyDown={(e) =>
                  (e.key === "-" || e.key === "e") && e.preventDefault()
                }
                className="bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-[#68D391] transition-colors"
              />
              <input
                type="number"
                name="weight"
                min="0"
                placeholder="kg"
                value={formData.weight}
                onChange={handleChange}
                onKeyDown={(e) =>
                  (e.key === "-" || e.key === "e") && e.preventDefault()
                }
                className="bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-[#68D391] transition-colors"
              />
            </div>
            <button
              type="button"
              onClick={handleNextStep1}
              className="w-full py-4 bg-[#68D391] text-[#1a1f26] rounded-2xl font-bold uppercase tracking-widest hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer"
            >
              Tovább
            </button>
          </div>
        )}

        {/* 2. Lépés: Cél */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl uppercase tracking-widest text-center">
              Mi a célod?
            </h2>
            <div className="grid gap-3">
              {[
                { key: "lose", label: "Fogyás" },
                { key: "maintain", label: "Súlytartás" },
                { key: "gain", label: "Izomépítés" },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setFormData({ ...formData, goal: item.key })}
                  className={`p-5 rounded-2xl border transition-all ${
                    formData.goal === item.key
                      ? "bg-[#68D391] text-[#1a1f26] border-[#68D391] font-bold"
                      : "bg-white/5 border-white/10 text-white hover:border-white/20"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="w-full py-4 bg-[#68D391] text-[#1a1f26] rounded-2xl font-bold uppercase tracking-widest hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer"
            >
              Tovább
            </button>
          </div>
        )}

        {/* 3. Lépés: Aktivitási szint */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl uppercase tracking-widest text-center">
              Aktivitás
            </h2>
            <div className="grid gap-3">
              {[
                { label: "Ülőmunka", value: 1.2 },
                { label: "Mérsékelt", value: 1.375 },
                { label: "Aktív", value: 1.55 },
                { label: "Nagyon aktív", value: 1.725 },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, activityLevel: item.value })
                  }
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
            <button
              type="button"
              onClick={() => setStep(4)}
              className="w-full py-4 bg-[#68D391] text-[#1a1f26] rounded-2xl font-bold uppercase tracking-widest hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer"
            >
              Tovább
            </button>
          </div>
        )}

        {/* 4. Lépés: Allergiák és küldés */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-2xl uppercase tracking-widest text-center mb-4">
              Allergiák és panaszok
            </h2>
            <AllergySelector
              selectedAllergies={formData.allergies}
              onToggle={(item) => toggleList("allergies", item)}
              onClear={() =>
                setFormData((prev) => ({ ...prev, allergies: [] }))
              }
            />
            <button
              type="button"
              onClick={handleFinish}
              className="w-full py-4 bg-[#68D391] text-[#1a1f26] rounded-2xl font-bold uppercase tracking-widest mt-6 hover:brightness-105 active:scale-[0.99] transition-all shadow-[0_0_20px_rgba(104,211,145,0.3)] cursor-pointer"
            >
              Beállítások mentése
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
