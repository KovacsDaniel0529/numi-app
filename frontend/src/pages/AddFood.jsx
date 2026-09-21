import React, { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ArrowLeft,
  Check,
  Flame,
  Sparkles,
  ShieldAlert,
  Utensils,
  Info,
  ChevronRight,
  Plus,
} from "lucide-react";
import { UserContext } from "../context/UserContext";

const MEALS = [
  { id: "breakfast", name: "Reggeli", icon: "🍳" },
  { id: "lunch", name: "Ebéd", icon: "🥗" },
  { id: "dinner", name: "Vacsora", icon: "🍲" },
  { id: "snack", name: "Nassolás", icon: "🍎" },
];

export default function AddFood() {
  const { user } = useContext(UserContext);

  // Állapotok
  const [selectedMeal, setSelectedMeal] = useState(
    "breakfast",
    "lunch",
    "dinner",
    "snack",
  );
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'foods', 'recipe'
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFood, setSelectedFood] = useState(null);
  const [amount, setAmount] = useState(100);

  // Minta adatbázis tételek

  const userAllergies = user?.profileDetail?.allergies || [];
  const currentMealObj = MEALS.find((m) => m.id === selectedMeal);

  // Szűrés
  const filteredFoods = databaseFoods.filter((food) => {
    const matchesSearch =
      food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (food.brand &&
        food.brand.toLowerCase().includes(searchQuery.toLowerCase()));

    if (activeTab === "recipe") return matchesSearch && food.isRecipe;
    if (activeTab === "foods") return matchesSearch && !food.isRecipe;
    return matchesSearch;
  });

  // Tápérték újraszámolása
  const calcNutrient = (baseValue) => {
    if (!baseValue) return 0;
    if (selectedFood?.isRecipe) {
      return Math.round(baseValue * (amount || 1));
    }
    return Math.round((baseValue * (amount || 0)) / 100);
  };

  const handleSelectFood = (food) => {
    setSelectedFood(food);
    setAmount(food.isRecipe ? 1 : 100);
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl text-white relative z-10">
      {/* 1. FEJLÉC ÉS ÉTKEZÉS VÁLASZTÓ */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{currentMealObj?.icon}</span>
            <h1 className="text-2xl md:text-3xl font-bold font-lemon text-white">
              Étel hozzáadása
            </h1>
          </div>
          <p className="text-slate-400 font-lemon text-xs md:text-sm">
            Válassz az adatbázisból vagy a receptjeid közül.
          </p>
        </div>

        {/* Napi cél kitűzés infó */}
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

      {/* 2. ÉTKEZÉSTÍPUS VÁLASZTÓ SÁV */}
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

      {/* 3. KERESŐ ÉS FÜL SÁV */}
      <div className="bg-[#171e27]/80 backdrop-blur-md p-4 md:p-6 rounded-[2rem] shadow-2xl border border-white/5 mb-8">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Kereső input */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Keresés étel vagy recept szerint..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#12181f] border border-white/10 p-3.5 pl-12 rounded-2xl text-white outline-none focus:border-[#68D391] transition-all font-lemon text-xs md:text-sm"
            />
          </div>

          {/* Fülek */}
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
            {[
              { id: "all", label: "Összes" },
              { id: "foods", label: "Alapanyagok" },
              { id: "recipe", label: "Receptek" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-xl font-lemon text-xs uppercase tracking-wider transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-[#68D391] text-[#12181f] font-bold shadow-[0_0_15px_rgba(104,211,145,0.3)]"
                    : "bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. TARTALOM: BAL OLDAL (KATALÓGUS) + JOBB OLDAL (ADAGOLÓ ÉS ÖSSZESÍTŐ) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* BAL OSZLOP: Ételek listája (7 oszlop) */}
        <div className="lg:col-span-7 space-y-3">
          {filteredFoods.length > 0 ? (
            filteredFoods.map((food) => {
              const hasAllergyConflict = food.allergens.some((a) =>
                userAllergies.includes(a),
              );
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
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold font-lemon text-white">
                          {food.name}
                        </h3>
                        {food.isRecipe && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-lemon bg-amber-500/10 border border-amber-500/30 text-amber-400 px-2 py-0.5 rounded-lg">
                            <Sparkles className="w-3 h-3" /> Recept
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 font-lemon mt-0.5">
                        {food.brand}
                      </p>
                    </div>

                    <span className="font-lemon text-sm text-[#68D391] font-bold">
                      {food.calories}{" "}
                      <span className="text-[10px] text-slate-400 font-normal">
                        kcal / {food.servingUnit === "g" ? "100g" : "adag"}
                      </span>
                    </span>
                  </div>

                  {/* Allergiára figyelmeztetés */}
                  {hasAllergyConflict && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-xl font-lemon">
                      <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                      <span>
                        Figyelem: A profilodban lévő allergént tartalmaz!
                      </span>
                    </div>
                  )}

                  {/* Makrók sáv */}
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/5 text-[11px] font-lemon text-slate-400">
                    <div>
                      Fehérje:{" "}
                      <span className="text-teal-400 font-bold">
                        {food.protein}g
                      </span>
                    </div>
                    <div>
                      Szénhidrát:{" "}
                      <span className="text-cyan-400 font-bold">
                        {food.carbs}g
                      </span>
                    </div>
                    <div>
                      Zsír:{" "}
                      <span className="text-yellow-400 font-bold">
                        {food.fat}g
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-16 bg-[#171e27]/40 rounded-3xl border border-white/5">
              <Utensils className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="font-lemon text-slate-400 text-sm">
                Nem található ilyen étel.
              </p>
            </div>
          )}
        </div>

        {/* JOBB OSZLOP: Adagolás és Hozzáadás Kártya (5 oszlop - Sticky) */}
        <div className="lg:col-span-5 sticky top-6">
          <div className="bg-[#171e27]/90 backdrop-blur-xl p-6 md:p-8 rounded-[2.5rem] shadow-2xl border border-white/10">
            <h2 className="text-lg font-lemon text-[#68D391] uppercase tracking-wider mb-6 pb-3 border-b border-white/5 flex items-center justify-between">
              <span>Étkezés rögzítése</span>
              <span className="text-sm text-slate-400">
                {currentMealObj?.name}
              </span>
            </h2>

            {selectedFood ? (
              <div className="space-y-6">
                {/* Kiválasztott étel adatai */}
                <div>
                  <label className="text-[10px] font-lemon text-slate-400 uppercase tracking-widest">
                    Kiválasztott étel
                  </label>
                  <p className="text-lg font-bold font-lemon text-white mt-1">
                    {selectedFood.name}
                  </p>
                  <span className="text-xs text-slate-400 font-lemon">
                    {selectedFood.brand}
                  </span>
                </div>

                {/* Mennyiség beállítása */}
                <div className="space-y-2">
                  <label className="text-xs font-lemon text-slate-300">
                    Mennyiség ({selectedFood.servingUnit})
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full bg-[#12181f] border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-[#68D391] transition-all font-lemon text-lg"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-lemon text-slate-400 uppercase">
                      {selectedFood.servingUnit}
                    </span>
                  </div>
                </div>

                {/* Újraszámolt tápértékek erre az adagra */}
                <div className="bg-[#12181f]/70 border border-white/5 p-4 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center font-lemon">
                    <span className="text-xs text-slate-400 uppercase tracking-wider">
                      Számított kalória
                    </span>
                    <span className="text-xl text-[#68D391] font-bold">
                      {calcNutrient(selectedFood.calories)} kcal
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/5 text-xs font-lemon text-center">
                    <div className="bg-white/5 p-2 rounded-xl">
                      <span className="block text-[10px] text-slate-500">
                        FEHÉRJE
                      </span>
                      <span className="text-teal-400 font-bold">
                        {calcNutrient(selectedFood.protein)}g
                      </span>
                    </div>
                    <div className="bg-white/5 p-2 rounded-xl">
                      <span className="block text-[10px] text-slate-500">
                        SZÉNHIDRÁT
                      </span>
                      <span className="text-cyan-400 font-bold">
                        {calcNutrient(selectedFood.carbs)}g
                      </span>
                    </div>
                    <div className="bg-white/5 p-2 rounded-xl">
                      <span className="block text-[10px] text-slate-500">
                        ZSÍR
                      </span>
                      <span className="text-yellow-400 font-bold">
                        {calcNutrient(selectedFood.fat)}g
                      </span>
                    </div>
                  </div>
                </div>

                {/* Hozzáadás gomb */}
                <button
                  type="button"
                  disabled={amount <= 0}
                  onClick={() =>
                    alert(
                      `Hozzáadva a ${currentMealObj?.name}hez: ${selectedFood.name} (${amount} ${selectedFood.servingUnit})`,
                    )
                  }
                  className="w-full bg-gradient-to-r from-[#68D391] to-teal-500 text-[#12181f] py-4 rounded-2xl font-lemon text-sm uppercase tracking-widest font-bold shadow-[0_0_20px_rgba(104,211,145,0.3)] hover:shadow-[0_0_30px_rgba(104,211,145,0.5)] transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  <Check className="w-5 h-5" />
                  Hozzáadás ({currentMealObj?.name})
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
