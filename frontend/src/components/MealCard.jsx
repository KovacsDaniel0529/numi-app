import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Trash2, ChevronDown } from "lucide-react";

// Az étkezések: az id az URL-hez (/add-food/:mealId), a type a backend MealType enumja.
// A share azt mondja meg, a napi kalóriacél hány százalékát javasoljuk az étkezésre.
const MEALS = [
  { id: "breakfast", type: "BREAKFAST", name: "Reggeli", share: 0.25, icon: "/sandwich.png" },
  { id: "lunch", type: "LUNCH", name: "Ebéd", share: 0.35, icon: "/lunch.png" },
  { id: "dinner", type: "DINNER", name: "Vacsora", share: 0.3, icon: "/dinner.png" },
  { id: "snack", type: "SNACK", name: "Nasi", share: 0.1, icon: "/snacks.png" },
];

const MealCard = ({ meals = [], calorieGoal = 0, onDeleteEntry }) => {
  const navigate = useNavigate();
  // Melyik étkezés listája van lenyitva (egyszerre egy). null = egyik sem.
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto p-8 bg-[#171e27] rounded-[40px] shadow-2xl border border-white/5">
      <h2 className="text-2xl md:text-3xl mb-6 text-center font-lemon uppercase tracking-widest">
        Táplálkozás
      </h2>

      {MEALS.map((meal) => {
        // A backendtől kapott étkezések közül megkeressük ezt a típust
        const data = meals.find((m) => m.mealType === meal.type);
        const entries = data?.entries ?? [];
        const current = Math.round(data?.calories ?? 0);
        const goal = Math.round(calorieGoal * meal.share);
        const progress = goal > 0 ? (current / goal) * 100 : 0;
        const isOpen = openId === meal.id && entries.length > 0;

        return (
          <div key={meal.id} className="flex flex-col">
            <div className="flex items-center justify-between bg-[#12181f] p-5 rounded-[30px] border border-white/[0.03] transition-all hover:bg-[#222832]">
              <div className="w-16 h-16 flex-shrink-0">
                <img
                  src={meal.icon}
                  alt={meal.name}
                  className="w-full h-full object-contain drop-shadow-lg"
                />
              </div>

              <div className="flex-1 px-6 flex flex-col items-center">
                <h3 className="text-white font-lemon text-xl tracking-wide">{meal.name}</h3>
                <p className="text-gray-400 text-sm font-medium mb-2">
                  {current}/{goal} kcal
                </p>
                <div className="w-full h-2.5 bg-gray-700/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#68D391] rounded-full shadow-[0_0_10px_rgba(104,211,145,0.5)] transition-all duration-500"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>

                {/* Lenyitó gomb: csak akkor látszik, ha van rögzített étel */}
                {entries.length > 0 && (
                  <button
                    type="button"
                    onClick={() => toggle(meal.id)}
                    aria-expanded={isOpen}
                    className={`mt-3 flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-semibold transition-all active:scale-95 ${
                      isOpen
                        ? "bg-[#68D391] text-[#1a1f26] border-[#68D391]"
                        : "bg-[#68D391]/10 text-[#68D391] border-[#68D391]/40 hover:bg-[#68D391]/20 hover:border-[#68D391]"
                    }`}
                  >
                    Mit ettem? ({entries.length})
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                )}
              </div>

              <button
                onClick={() => navigate(`/add-food/${meal.id}`)}
                className="w-12 h-12 flex items-center justify-center bg-transparent border-2 border-white/20 rounded-xl text-white hover:border-[#68D391] hover:text-[#68D391] transition-all active:scale-95 group"
              >
                <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            {/* Lenyíló lista az étkezéshez rögzített ételekkel */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden mx-4 bg-[#0e1318] rounded-b-2xl border border-t-0 border-white/[0.03]"
                >
                  {entries.map((entry) => (
                    <li
                      key={entry.id}
                      className="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/5 last:border-b-0"
                    >
                      <div className="min-w-0">
                        <p className="text-sm text-white truncate">{entry.foodName}</p>
                        <p className="text-xs text-slate-500">
                          {Math.round(entry.quantityGrams)} g · {Math.round(entry.calories)} kcal
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onDeleteEntry?.(entry.id)}
                        className="p-2 text-slate-500 hover:text-red-400 transition-colors flex-shrink-0"
                        aria-label={`${entry.foodName} törlése`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default MealCard;