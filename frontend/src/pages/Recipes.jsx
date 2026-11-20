import React, { useContext, useEffect, useState } from "react";
import { Sparkles, ShieldAlert, Bookmark, BookmarkCheck, Trash2, ChevronDown, TriangleAlert } from "lucide-react";
import { UserContext } from "../context/UserContext";
import { generateRecipe, saveRecipe, getSavedRecipes, deleteSavedRecipe } from "../api/recipeApi";
import { allergenLabel } from "../constants/allergens";
import { DIETARY_PREFERENCES, DIGESTIVE_ISSUES, labelOf } from "../constants/profile";
import RecipeCard from "../components/RecipeCard";

const TABS = [
  { id: "new", label: "Új recept" },
  { id: "saved", label: "Mentett receptek" },
];

const Recipes = () => {
  const { user } = useContext(UserContext);
  const username = user?.username;
  const allergies = user?.profileDetail?.allergies ?? [];
  const diet = user?.profileDetail?.dietaryPreference ?? "omnivore";
  const digestiveIssues = user?.profileDetail?.digestiveIssues ?? [];

  const [tab, setTab] = useState("new");

  // --- Új recept ---
  const [preferences, setPreferences] = useState("");
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false); // az éppen látott receptet már elmentettük-e
  const [error, setError] = useState("");

  // --- Mentett receptek ---
  const [savedList, setSavedList] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState("");
  const [openId, setOpenId] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setSaved(false);
    try {
      setRecipe(await generateRecipe(username, preferences));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await saveRecipe(username, recipe);
      setSaved(true);
    } catch (err) {
      setError(err.message); // pl. "Ez a recept már el van mentve."
    } finally {
      setSaving(false);
    }
  };

  // A mentett receptek betöltése, amikor a fülre váltunk
  useEffect(() => {
    if (tab !== "saved" || !username) return;
    let cancelled = false;

    setListLoading(true);
    setListError("");
    getSavedRecipes(username)
      .then((data) => {
        if (!cancelled) setSavedList(data);
      })
      .catch((err) => {
        if (!cancelled) setListError(err.message);
      })
      .finally(() => {
        if (!cancelled) setListLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [tab, username]);

  const handleDelete = async (id) => {
    if (!window.confirm("Biztosan törlöd ezt a receptet?")) return;
    try {
      await deleteSavedRecipe(username, id);
      setSavedList((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      setListError(err.message);
    }
  };

  return (
    <main className="container mx-auto px-4 py-6 text-white max-w-3xl font-lemon">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6">Receptek</h1>

      {/* FÜLEK */}
      <div className="flex justify-center gap-2 mb-6">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-5 py-2 rounded-xl text-sm uppercase tracking-widest border transition-colors ${
              tab === t.id
                ? "bg-[#68D391] text-[#1a1f26] border-[#68D391] font-bold"
                : "border-white/10 text-slate-400 hover:border-[#68D391] hover:text-[#68D391]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "new" && (
        <>
          <section className="bg-[#171e27]/80 p-6 md:p-8 rounded-[2rem] border border-white/5 shadow-2xl">
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

            <div className="mb-6">
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Étrend és emésztés</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full text-sm bg-[#68D391]/10 border border-[#68D391]/40 text-[#68D391]">
                  {labelOf(DIETARY_PREFERENCES, diet)}
                </span>
                {digestiveIssues.map((i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full text-sm bg-amber-500/10 border border-amber-500/40 text-amber-300"
                  >
                    {labelOf(DIGESTIVE_ISSUES, i)}
                  </span>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-2">A profilod "Étkezési szokások" fülén módosíthatod.</p>
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
              <RecipeCard recipe={recipe}>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving || saved}
                  className="w-full py-3 rounded-2xl border border-[#68D391]/50 text-[#68D391] uppercase tracking-widest text-sm hover:bg-[#68D391]/10 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {saved ? (
                    <>
                      <BookmarkCheck className="w-5 h-5" /> Elmentve
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-5 h-5" /> {saving ? "Mentés..." : "Recept mentése"}
                    </>
                  )}
                </button>
              </RecipeCard>
            </section>
          )}
        </>
      )}

      {tab === "saved" && (
        <section className="space-y-4">
          {listLoading && <p className="text-center text-slate-400">Betöltés...</p>}

          {listError && (
            <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded-2xl border border-red-500/20 text-center">
              {listError}
            </div>
          )}

          {!listLoading && !listError && savedList.length === 0 && (
            <p className="text-center text-slate-400">
              Még nincs mentett recepted. Generálj egyet az "Új recept" fülön, és mentsd el!
            </p>
          )}

          {savedList.map((r) => {
            const open = openId === r.id;
            const hasWarning = r.allergenWarnings?.length > 0;

            return (
              <div
                key={r.id}
                className={`bg-[#171e27]/80 rounded-[2rem] border shadow-2xl overflow-hidden ${
                  hasWarning ? "border-red-500/40" : "border-white/5"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : r.id)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left"
                >
                  <div className="min-w-0">
                    <p className="text-lg truncate">{r.title}</p>
                    <p className="text-xs text-slate-500">
                      {r.calories} kcal · mentve: {new Date(r.savedAt).toLocaleDateString("hu-HU")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {hasWarning && <TriangleAlert className="w-5 h-5 text-red-400" />}
                    <ChevronDown className={`w-5 h-5 transition-transform ${open ? "rotate-180" : ""}`} />
                  </div>
                </button>

                {open && (
                  <div className="px-5 pb-5 border-t border-white/5 pt-5">
                    <RecipeCard recipe={r} warnings={r.allergenWarnings ?? []}>
                      <button
                        type="button"
                        onClick={() => handleDelete(r.id)}
                        className="w-full py-3 rounded-2xl border border-red-500/40 text-red-300 uppercase tracking-widest text-sm hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-5 h-5" /> Törlés
                      </button>
                    </RecipeCard>
                  </div>
                )}
              </div>
            );
          })}
        </section>
      )}
    </main>
  );
};

export default Recipes;