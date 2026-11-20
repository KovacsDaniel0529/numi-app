import React from "react";
import { Flame, TriangleAlert } from "lucide-react";

// Egy recept megjelenítése. Az új és a mentett receptek is ezt használják.
// - warnings: az allergén-figyelmeztetések listája (üres = nincs)
// - children: a kártya alján megjelenő gombok (pl. Mentés, Törlés)
const RecipeCard = ({ recipe, warnings = [], children }) => (
  <div>
    {warnings.length > 0 && (
      <div className="mb-6 flex gap-3 bg-red-500/10 border border-red-500/40 text-red-300 p-4 rounded-2xl text-sm">
        <TriangleAlert className="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold mb-1">Ez a recept ütközik a jelenlegi allergiáiddal!</p>
          <p>Problémás hozzávalók: {warnings.join(", ")}</p>
        </div>
      </div>
    )}

    <h2 className="text-xl md:text-2xl text-[#68D391] mb-2">{recipe.title}</h2>
    <p className="text-slate-400 mb-6">{recipe.description}</p>

    <div className="grid grid-cols-4 gap-2 mb-6 text-center">
      <div className="bg-[#12181f] rounded-2xl p-3">
        <p className="text-xs text-slate-500 uppercase flex items-center justify-center gap-1">
          <Flame className="w-3 h-3" /> kcal
        </p>
        <p className="text-lg">{recipe.calories}</p>
      </div>
      <div className="bg-[#12181f] rounded-2xl p-3">
        <p className="text-xs text-slate-500 uppercase">Fehérje</p>
        <p className="text-lg">{recipe.protein} g</p>
      </div>
      <div className="bg-[#12181f] rounded-2xl p-3">
        <p className="text-xs text-slate-500 uppercase">Szénh.</p>
        <p className="text-lg">{recipe.carbs} g</p>
      </div>
      <div className="bg-[#12181f] rounded-2xl p-3">
        <p className="text-xs text-slate-500 uppercase">Zsír</p>
        <p className="text-lg">{recipe.fat} g</p>
      </div>
    </div>

    <h3 className="text-sm text-slate-500 uppercase tracking-widest mb-2">Hozzávalók</h3>
    <ul className="mb-6 list-disc list-inside text-slate-200 space-y-1">
      {recipe.ingredients.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>

    <h3 className="text-sm text-slate-500 uppercase tracking-widest mb-2">Elkészítés</h3>
    <ol className="mb-6 list-decimal list-inside text-slate-200 space-y-2">
      {recipe.steps.map((step, i) => (
        <li key={i}>{step}</li>
      ))}
    </ol>

    {children}

    <p className="text-xs text-slate-500 border-t border-white/5 pt-4 mt-4">
      Ez egy automatikus javaslat. Az adatok tájékoztató jellegűek, allergia esetén mindig ellenőrizd az
      alapanyagok összetételét!
    </p>
  </div>
);

export default RecipeCard;