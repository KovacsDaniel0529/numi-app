import React from "react";

const ALLERGENS = [
  "Glutén",
  "Rákfélék",
  "Tojás",
  "Hal",
  "Földimogyoró",
  "Szójabab",
  "Tej és tejtermékek (kazein)",
  "Diófélék",
  "Zeller",
  "Mustár",
  "Szezámmag",
  "Kén-dioxid",
  "Csillagfürt",
  "Puhatestűek",
];
const AllergySelector = ({ selectedAllergies, onToggle, onClear }) => {
  return (
    <div className="space-y-4">
      {/* "Nincs allergiám" opció */}
      <button
        type="button"
        onClick={onClear}
        className={`w-full p-4 rounded-2xl border transition-all ${
          selectedAllergies.length === 0
            ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
            : "bg-white/5 border-white/10 text-slate-400"
        }`}
      >
        Nincs allergiám
      </button>

      <div className="grid grid-cols-2 gap-3">
        {ALLERGENS.map((allergy) => (
          <button
            key={allergy}
            type="button"
            onClick={() => onToggle(allergy)}
            className={`p-3 rounded-xl border text-sm font-lemon transition-all ${
              selectedAllergies.includes(allergy)
                ? "bg-red-500/20 border-red-500 text-red-400"
                : "bg-white/5 border-white/10 text-slate-300 hover:border-white/20"
            }`}
          >
            {allergy}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AllergySelector;
