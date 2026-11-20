import React, { useState, useContext, useEffect, useMemo } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Check,
  Flame,
  ShieldAlert,
  Utensils,
  Info,
} from "lucide-react";
import { UserContext } from "../context/UserContext";
import { getFoods } from "../api/foodApi";
import { addFoodLog } from "../api/logApi";
import { allergenLabel } from "../constants/allergens";
import { formatDateHu, resolveDate, todayLocal } from "../utils/date";

// Ennél nagyobb mennyiséget egy tételnél nem engedünk (elgépelés ellen)
const MAX_AMOUNT = 5000;

const MEALS = [
  { id: "breakfast", name: "Reggeli", icon: "🍳" },
  { id: "lunch", name: "Ebéd", icon: "🥗" },
  { id: "dinner", name: "Vacsora", icon: "🍲" },
  { id: "snack", name: "Nassolás", icon: "🍎" },
];

// Ékezet- és kis-nagybetű nélküli összehasonlításhoz ("tejfol" megtalálja a "Tejföl"-t)
const normalize = (text) =>
  text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export default function AddFood() {
  const { user } = useContext(UserContext);
  const { mealId } = useParams();
  const [searchParams] = useSearchParams();

  // Melyik napra rögzítünk? Alapból a mai napra, de a Napló a ?date= értékkel
  // egy korábbi napot is átadhat (pl. /add-food/lunch?date=2026-11-16).
  const logDate = resolveDate(searchParams.get("date"));
  const isToday = logDate === todayLocal();

  const [selectedMeal, setSelectedMeal] = useState(
    MEALS.some((m) => m.id === mealId) ? mealId : "breakfast",
  );
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reloadCount, setReloadCount] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedFood, setSelectedFood] = useState(null);
  const [amount, setAmount] = useState(100);
  const [allergyAck, setAllergyAck] = useState(false); // tudomásul vette-e az allergén figyelmeztetést

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const currentMealObj = MEALS.find((m) => m.id === selectedMeal);

  // Az ételek betöltése egyszer (a felhasználó allergiáival együtt)
  useEffect(() => {
    if (!user?.username) return;
    let cancelled = false; // ha az oldal közben bezárul, ne írjunk állapotot

    setLoading(true);
    setLoadError("");
    getFoods(user.username)
      .then((data) => {
        if (!cancelled) setFoods(data);
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user?.username, reloadCount]);

  const categories = useMemo(
    () =>
      [...new Set(foods.map((f) => f.category).filter(Boolean))].sort((a, b) =>
        a.localeCompare(b, "hu"),
      ),
    [foods],
  );

  const filteredFoods = useMemo(() => {
    const query = normalize(searchQuery.trim());
    return foods.filter(
      (food) =>
        (activeCategory === "all" || food.category === activeCategory) &&
        normalize(food.name).includes(query),
    );
  }, [foods, searchQuery, activeCategory]);

  // Tápérték újraszámolása a megadott mennyiségre (az alapértékek 100 g-ra vannak)
  const calc = (base) => Math.round(((base ?? 0) * (amount || 0)) / 10) / 10;

  const handleSelectFood = (food) => {
    setSelectedFood(food);
    setAmount(100);
    setAllergyAck(false);
    setSaveError("");
    setSuccessMessage("");
  };

  // Akkor lehet hozzáadni, ha van kiválasztott étel, érvényes a mennyiség,
  // és allergén esetén a felhasználó tudomásul vette a figyelmeztetést
  const amountValid = amount > 0 && amount <= MAX_AMOUNT;
  const needsAck = Boolean(selectedFood?.allergyWarning);
  const canAdd = Boolean(selectedFood) && amountValid && (!needsAck || allergyAck);

  const handleAdd = async () => {
    if (!canAdd) return;

    setSaving(true);
    setSaveError("");
    setSuccessMessage("");
    try {
      await addFoodLog(user.username, {
        foodId: selectedFood.id,
        quantityGrams: amount,
        mealType: selectedMeal.toUpperCase(), // breakfast -> BREAKFAST
        logDate,
      });
      setSuccessMessage(
        `Hozzáadva: ${selectedFood.name} (${amount} g) – ${currentMealObj.name}`,
      );
      setSelectedFood(null);
      setAmount(100);
      setAllergyAck(false);
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl text-white relative z-10">
      {/* 1. FEJLÉC */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{currentMealObj?.icon}</span>
            <h1 className="text-2xl md:text-3xl font-bold font-lemon text-white">
              Étel hozzáadása
            </h1>
          </div>
          <p className="text-slate-400 font-lemon text-xs md:text-sm">
            Válassz az alapanyagok közül, és add meg a mennyiséget.
          </p>
          {!isToday && (
            <p className="mt-2 inline-block text-xs font-lemon text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-xl">
              Rögzítés dátuma: {formatDateHu(logDate)}
            </p>
          )}
        </div>

        <div className="bg-[#171e27]/80 backdrop-blur-md border border-white/5 px-5 py-3 rounded-2xl flex items-center gap-4">
          <div className="p-2 bg-[#68D391]/10 rounded-xl">
            <Flame className="w-5 h-5 text-[#68D391]" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-lemon tracking-widest text-slate-400">
              Napi kalóriacél
            </p>
            <p className="font-lemon text-base text-white">
              {user?.profileDetail?.dailyCalorieGoal || 2000} kcal
            </p>
          </div>
        </div>
      </header>

      {/* 2. ÉTKEZÉSTÍPUS VÁLASZTÓ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {MEALS.map((meal) => (
          <button
            key={meal.id}
            type="button"
            onClick={() => setSelectedMeal(meal.id)}
            className={`p-4 rounded-2xl font-lemon text-xs uppercase tracking-wider flex items-center justify-center gap-2 border transition-all ${
              selectedMeal === meal.id
                ? "bg-[#1c252e] border-[#68D391] text-[#68D391] shadow-[0_0_15px_rgba(104,211,145,0.2)]"
                : "bg-[#171e27]/80 border-white/5 text-slate-400 hover:text-white hover:bg-[#171e27]"
            }`}
          >
            <span>{meal.icon}</span>
            <span>{meal.name}</span>
          </button>
        ))}
      </div>

      {/* 3. KERESŐ ÉS KATEGÓRIÁK */}
      <div className="bg-[#171e27]/80 backdrop-blur-md p-4 md:p-6 rounded-[2rem] shadow-2xl border border-white/5 mb-8 space-y-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Keresés alapanyag szerint..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#12181f] border border-white/10 p-3.5 pl-12 rounded-2xl text-white outline-none focus:border-[#68D391] transition-all font-lemon text-xs md:text-sm"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {["all", ...categories].map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2.5 rounded-xl font-lemon text-xs uppercase tracking-wider transition-all whitespace-nowrap ${
                activeCategory === category
                  ? "bg-[#68D391] text-[#12181f] font-bold shadow-[0_0_15px_rgba(104,211,145,0.3)]"
                  : "bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {category === "all" ? "Összes" : category}
            </button>
          ))}
        </div>
      </div>

      {/* 4. TARTALOM */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* BAL OSZLOP: ételek listája */}
        <div className="lg:col-span-7 space-y-3">
          {loading && (
            <p className="text-center py-16 font-lemon text-slate-400 text-sm">
              Betöltés...
            </p>
          )}

          {!loading && loadError && (
            <div className="text-center py-12 bg-red-500/10 rounded-3xl border border-red-500/20 space-y-4">
              <p className="font-lemon text-red-400 text-sm">{loadError}</p>
              <button
                onClick={() => setReloadCount((c) => c + 1)}
                className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 font-lemon text-xs uppercase tracking-wider transition-all"
              >
                Újrapróbálom
              </button>
            </div>
          )}

          {!loading && !loadError && filteredFoods.length === 0 && (
            <div className="text-center py-16 bg-[#171e27]/40 rounded-3xl border border-white/5">
              <Utensils className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="font-lemon text-slate-400 text-sm">
                Nem található ilyen étel.
              </p>
            </div>
          )}

          {!loading &&
            !loadError &&
            filteredFoods.map((food) => {
              const isSelected = selectedFood?.id === food.id;

              return (
                <motion.div
                  key={food.id}
                  onClick={() => handleSelectFood(food)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer backdrop-blur-sm ${
                    isSelected
                      ? "bg-[#1c252e] border-[#68D391] ring-1 ring-[#68D391] shadow-[0_0_20px_rgba(104,211,145,0.15)]"
                      : "bg-[#171e27]/80 border-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-bold font-lemon text-white">
                        {food.name}
                      </h3>
                      <p className="text-xs text-slate-400 font-lemon mt-0.5">
                        {food.category}
                      </p>
                    </div>
                    <span className="font-lemon text-sm text-[#68D391] font-bold">
                      {food.calories}{" "}
                      <span className="text-[10px] text-slate-400 font-normal">
                        kcal / 100g
                      </span>
                    </span>
                  </div>

                  {/* Allergén-figyelmeztetés a backendtől */}
                  {food.allergyWarning && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-xl font-lemon">
                      <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                      <span>
                        Figyelem: {food.matchedAllergens.map(allergenLabel).join(", ")}{" "}
                        – a profilodban szereplő allergén!
                      </span>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/5 text-[11px] font-lemon text-slate-400">
                    <div>
                      Fehérje:{" "}
                      <span className="text-teal-400 font-bold">{food.protein}g</span>
                    </div>
                    <div>
                      Szénhidrát:{" "}
                      <span className="text-cyan-400 font-bold">{food.carbs}g</span>
                    </div>
                    <div>
                      Zsír:{" "}
                      <span className="text-yellow-400 font-bold">{food.fat}g</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
        </div>

        {/* JOBB OSZLOP: adagolás és hozzáadás */}
        <div className="lg:col-span-5 sticky top-6">
          <div className="bg-[#171e27]/90 backdrop-blur-xl p-6 md:p-8 rounded-[2.5rem] shadow-2xl border border-white/10">
            <h2 className="text-lg font-lemon text-[#68D391] uppercase tracking-wider mb-6 pb-3 border-b border-white/5 flex items-center justify-between">
              <span>Étkezés rögzítése</span>
              <span className="text-sm text-slate-400">{currentMealObj?.name}</span>
            </h2>

            {successMessage && (
              <div className="mb-6 text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-2xl font-lemon space-y-2">
                <p>{successMessage}</p>
                <Link
                  to={isToday ? "/diary" : `/diary?date=${logDate}`}
                  className="underline text-xs"
                >
                  Megnyitom a Naplót
                </Link>
              </div>
            )}

            {saveError && (
              <div className="mb-6 text-sm text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-2xl font-lemon">
                {saveError}
              </div>
            )}

            {selectedFood ? (
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-lemon text-slate-400 uppercase tracking-widest">
                    Kiválasztott étel
                  </label>
                  <p className="text-lg font-bold font-lemon text-white mt-1">
                    {selectedFood.name}
                  </p>
                  <span className="text-xs text-slate-400 font-lemon">
                    {selectedFood.category}
                  </span>
                </div>

                {selectedFood.allergens?.length > 0 && (
                  <p className="text-xs text-slate-400 font-lemon">
                    Allergének: {selectedFood.allergens.map(allergenLabel).join(", ")}
                  </p>
                )}

                {selectedFood.allergyWarning && (
                  <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-xl font-lemon">
                    <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                    <span>
                      Ez az étel a profilodban szereplő allergént tartalmaz:{" "}
                      {selectedFood.matchedAllergens.map(allergenLabel).join(", ")}
                    </span>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-lemon text-slate-300">Mennyiség (g)</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max={MAX_AMOUNT}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
                      className="w-full bg-[#12181f] border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-[#68D391] transition-all font-lemon text-lg"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-lemon text-slate-400 uppercase">
                      g
                    </span>
                  </div>
                </div>

                {!amountValid && (
                  <p className="text-xs text-red-400 font-lemon">
                    A mennyiség 1 és {MAX_AMOUNT} gramm között legyen!
                  </p>
                )}

                <div className="bg-[#12181f]/70 border border-white/5 p-4 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center font-lemon">
                    <span className="text-xs text-slate-400 uppercase tracking-wider">
                      Számított kalória
                    </span>
                    <span className="text-xl text-[#68D391] font-bold">
                      {Math.round(calc(selectedFood.calories))} kcal
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/5 text-xs font-lemon text-center">
                    <div className="bg-white/5 p-2 rounded-xl">
                      <span className="block text-[10px] text-slate-500">FEHÉRJE</span>
                      <span className="text-teal-400 font-bold">{calc(selectedFood.protein)}g</span>
                    </div>
                    <div className="bg-white/5 p-2 rounded-xl">
                      <span className="block text-[10px] text-slate-500">SZÉNHIDRÁT</span>
                      <span className="text-cyan-400 font-bold">{calc(selectedFood.carbs)}g</span>
                    </div>
                    <div className="bg-white/5 p-2 rounded-xl">
                      <span className="block text-[10px] text-slate-500">ZSÍR</span>
                      <span className="text-yellow-400 font-bold">{calc(selectedFood.fat)}g</span>
                    </div>
                  </div>
                </div>

                {needsAck && (
                  <label className="flex items-start gap-3 text-xs font-lemon text-red-300 bg-red-500/5 border border-red-500/30 p-3 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allergyAck}
                      onChange={(e) => setAllergyAck(e.target.checked)}
                      className="mt-0.5 accent-red-500"
                    />
                    <span>
                      Tudomásul veszem, hogy ez az étel a profilomban szereplő allergént tartalmaz, és
                      mégis szeretném rögzíteni.
                    </span>
                  </label>
                )}

                <button
                  type="button"
                  disabled={!canAdd || saving}
                  onClick={handleAdd}
                  className="w-full bg-gradient-to-r from-[#68D391] to-teal-500 text-[#12181f] py-4 rounded-2xl font-lemon text-sm uppercase tracking-widest font-bold shadow-[0_0_20px_rgba(104,211,145,0.3)] hover:shadow-[0_0_30px_rgba(104,211,145,0.5)] transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  <Check className="w-5 h-5" />
                  {saving ? "Mentés..." : `Hozzáadás (${currentMealObj?.name})`}
                </button>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 font-lemon text-xs space-y-2">
                <Info className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p>
                  Kattints egy ételre a bal oldali listából az adagoláshoz és
                  hozzáadáshoz.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}