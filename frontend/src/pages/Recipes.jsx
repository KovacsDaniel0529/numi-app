import React, { useContext, useState } from "react";
import { Sparkles, ShieldAlert, Flame } from "lucide-react";
import { UserContext } from "../context/UserContext";
import { generateRecipe } from "../api/recipeApi";
import { allergenLabel } from "../constants/allergens";

const Recipes = () => {
  const { user } = useContext(UserContext);
  const [preferences, setPreferences] = useState("");
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const allergies = user?.profileDetail?.allergies ?? [];

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      setRecipe(await generateRecipe(user.username, preferences));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-6 text-white max-w-3xl font-lemon">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8">Receptek</h1>

      <section className="bg-[#171e27]/80 p-6 md:p-8 rounded-[2rem] border border-white/5 shadow-2xl">
        {/* Figyelembe vett allergiák */}
        <div className="mb-6">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" /> Figyelembe vett allergiák és intoleranciák
          </p>
          {allergies.length === 0 ? (
            <p className="text-slate-400 text-sm">Nincs megadva. A profilodban beállíthatod.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {allergies.map((a) => (
                <span
                  key={a}
                  className="px-3 py-1 rounded-full text-sm bg-red-500/10 border border-red-500/40 text-red-300"
                >
                  {allergenLabel(a)}
                </span>
              ))}
            </div>
          )}
        </div>

        <label className="block text-xs text-slate-500 uppercase tracking-widest mb-2">
          Van külön kívánságod? (nem kötelező)
        </label>
        <textarea
          value={preferences}
          onChange={(e) => setPreferences(e.target.value)}
          rows={3}
          maxLength={300}
          placeholder="Pl. vacsora, gyors, csirkével, vagy ami otthon van: rizs, brokkoli..."
          className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-[#68D391] transition-colors resize-none"
        />

        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className="mt-4 w-full py-4 bg-[#68D391] text-[#1a1f26] rounded-2xl font-bold uppercase tracking-widest hover:brightness-105 active:scale-[0.99] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
        >
          <Sparkles className="w-5 h-5" />
          {loading ? "Recept készül..." : "Javasolj receptet"}
        </button>

        {error && (
          <div className="mt-4 text-red-400 text-sm bg-red-500/10 p-3 rounded-2xl border border-red-500/20 text-center">
            {error}
          </div>
        )}
      </section>

      {recipe && (
        <section className="mt-6 bg-[#171e27]/80 p-6 md:p-8 rounded-[2rem] border border-white/5 shadow-2xl">
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

          <p className="text-xs text-slate-500 border-t border-white/5 pt-4">
            Ez egy automatikus javaslat. Az adatok tájékoztató jellegűek, allergia esetén mindig ellenőrizd
            az alapanyagok összetételét!
          </p>
        </section>
      )}
    </main>
  );
};

export default Recipes;