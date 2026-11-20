import React, { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { UserContext } from "../context/UserContext";
import CalorieRing from "../components/CalorieRing";
import MacroBar from "../components/MacroBar";
import MealCard from "../components/MealCard";
import WaterTracker from "../components/WaterTracker";
import { getDay } from "../api/calendarApi";
import { deleteFoodLog } from "../api/logApi";
import { addDays, formatDateHu, resolveDate, todayLocal } from "../utils/date";

const Diary = () => {
  const { user, loading } = useContext(UserContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [day, setDay] = useState(null); // a backend napi összesítése
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");

  const username = user?.username;

  // A nézett nap az URL-ből jön (/diary?date=2026-11-16), hiba vagy jövő esetén a mai nap
  const today = todayLocal();
  const date = resolveDate(searchParams.get("date"));
  const isToday = date === today;

  const goToDate = (target) => {
    setSearchParams(target === today ? {} : { date: target });
  };

  // Az adott nap betöltése, amikor megvan a felhasználó, vagy változik a nap
  useEffect(() => {
    if (!username) return;
    let cancelled = false;

    setFetching(true);
    setError("");
    getDay(username, date)
      .then((data) => {
        if (!cancelled) setDay(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setFetching(false);
      });

    return () => {
      cancelled = true;
    };
  }, [username, date]);

  // Étel törlése a naplóból, utána újratöltjük a napot
  const handleDeleteEntry = async (id) => {
    try {
      await deleteFoodLog(id);
      setDay(await getDay(username, date));
    } catch (err) {
      setError(err.message);
    }
  };

  // A WaterTracker a friss vízösszeget adja vissza (ml)
  const handleWaterChange = (totalMl) => {
    setDay((prev) => ({ ...prev, waterMl: totalMl }));
  };

  if (loading || (!day && !error)) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white font-lemon">
        Betöltés...
      </div>
    );
  }

  if (!day) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400 font-lemon px-4 text-center">
        {error}
      </div>
    );
  }

  // A backend BigDecimal-t ad (pl. 135.00), kerekítjük a megjelenítéshez
  const goal = Math.round(day.calorieGoal ?? 0);
  const consumed = Math.round(day.totalCalories ?? 0);

  // Makrócélok: a kalóriacél 25% fehérje / 45% szénhidrát / 30% zsír
  // (1 g fehérje és szénhidrát = 4 kcal, 1 g zsír = 9 kcal)
  const proteinGoal = Math.round((goal * 0.25) / 4);
  const carbsGoal = Math.round((goal * 0.45) / 4);
  const fatGoal = Math.round((goal * 0.3) / 9);

  return (
    <main className="container mx-auto px-4 py-6 text-white max-w-6xl">
      <header className="flex flex-col items-center justify-center mb-6 text-center">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white font-lemon mb-1">
          Szia, {user?.profileDetail?.firstName || user?.username}!
        </h1>
        <p className="text-slate-500 font-lemon italic text-sm md:text-base">
          "Az egészség a konyhában kezdődik."
        </p>
      </header>

      {/* NAPVÁLASZTÓ */}
      <div className="flex flex-col items-center gap-2 mb-8 font-lemon">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => goToDate(addDays(date, -1))}
            className="p-2 rounded-xl border border-white/10 hover:border-[#68D391] hover:text-[#68D391] transition-colors"
            aria-label="Előző nap"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="text-center min-w-[16rem]">
            <p className="text-lg text-white">{isToday ? "Ma" : formatDateHu(date)}</p>
            {isToday && <p className="text-xs text-slate-500">{formatDateHu(date)}</p>}
          </div>

          <button
            type="button"
            onClick={() => goToDate(addDays(date, 1))}
            disabled={isToday}
            className="p-2 rounded-xl border border-white/10 hover:border-[#68D391] hover:text-[#68D391] transition-colors disabled:opacity-30 disabled:hover:border-white/10 disabled:hover:text-white"
            aria-label="Következő nap"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {!isToday && (
          <button
            type="button"
            onClick={() => goToDate(today)}
            className="text-xs text-[#68D391] underline"
          >
            Vissza a mai napra
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 text-red-400 text-sm bg-red-500/10 p-3 rounded-2xl border border-red-500/20 text-center font-lemon">
          {error}
        </div>
      )}

      {/* Napváltáskor a régi adat halványan marad, amíg az új betölt */}
      <div className={`transition-opacity duration-200 ${fetching ? "opacity-50" : "opacity-100"}`}>
        <div className="bg-[#171e27]/80 backdrop-blur-md p-6 md:p-8 rounded-[2rem] shadow-2xl border border-white/5">
          <h2 className="text-lg md:text-xl mb-8 text-center font-lemon uppercase tracking-widest text-[#68D391]">
            {isToday ? "napi összefoglaló" : "a nap összefoglalója"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center mb-10">
            <div className="flex flex-col items-center justify-center text-center order-2 md:order-1">
              <p className="text-slate-500 font-lemon text-xs uppercase tracking-tighter">Bevitt</p>
              <p className="text-xl md:text-2xl font-lemon">
                {consumed} <span className="text-xs">kcal</span>
              </p>
            </div>

            <div className="flex justify-center order-1 md:order-2 scale-90 md:scale-100">
              <CalorieRing consumed={consumed} goal={goal} />
            </div>

            <div className="flex flex-col items-center justify-center text-center order-3">
              <p className="text-slate-500 font-lemon text-xs uppercase tracking-tighter">Cél</p>
              <p className="text-xl md:text-2xl font-lemon">
                {goal} <span className="text-xs">kcal</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8 pt-6 border-t border-white/5">
            <MacroBar
              label="Szénhidrát"
              current={Math.round(day.totalCarbs ?? 0)}
              target={carbsGoal}
              colorClass="bg-gradient-to-r from-blue-500 to-cyan-400"
            />
            <MacroBar
              label="Zsír"
              current={Math.round(day.totalFat ?? 0)}
              target={fatGoal}
              colorClass="bg-gradient-to-r from-yellow-500 to-orange-400"
            />
            <MacroBar
              label="Fehérje"
              current={Math.round(day.totalProtein ?? 0)}
              target={proteinGoal}
              colorClass="bg-gradient-to-r from-emerald-500 to-teal-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <MealCard
            meals={day.meals}
            calorieGoal={goal}
            date={date}
            onDeleteEntry={handleDeleteEntry}
          />
          <WaterTracker
            username={username}
            date={date}
            waterMl={day.waterMl ?? 0}
            goalMl={day.waterGoalMl ?? 0}
            onChange={handleWaterChange}
          />
        </div>
      </div>
    </main>
  );
};

export default Diary;