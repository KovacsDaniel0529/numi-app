import React, { useContext, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Droplets } from "lucide-react";
import { UserContext } from "../context/UserContext";
import { getDay, getMonth } from "../api/calendarApi";
import { todayLocal } from "../utils/date";
import { Link } from "react-router-dom";

const MONTH_NAMES = [
  "Január", "Február", "Március", "Április", "Május", "Június",
  "Július", "Augusztus", "Szeptember", "Október", "November", "December",
];
const WEEKDAYS = ["H", "K", "Sze", "Cs", "P", "Szo", "V"];
const MEAL_NAMES = {
  BREAKFAST: "Reggeli",
  LUNCH: "Ebéd",
  DINNER: "Vacsora",
  SNACK: "Nasi",
};

const pad = (n) => String(n).padStart(2, "0");
const toIso = (year, month, day) => `${year}-${pad(month)}-${pad(day)}`;

// 1250 ml -> "1,25"
const toLiters = (ml) => (ml / 1000).toFixed(2).replace(".", ",");

// Egy nap értékelése a kalóriacél alapján:
//  - nincs rögzített étel  -> "empty" (szürke)
//  - cél ±10%-án belül     -> "good"  (zöld)
//  - cél ±25%-án belül     -> "okay"  (sárga)
//  - ennél messzebb        -> "off"   (piros)
const dayStatus = (day, calorieGoal) => {
  const cal = Number(day?.totalCalories ?? 0);
  if (!day || cal <= 0 || !calorieGoal) return "empty";
  const diff = Math.abs(cal - calorieGoal) / calorieGoal;
  if (diff <= 0.1) return "good";
  if (diff <= 0.25) return "okay";
  return "off";
};

const STATUS_STYLE = {
  empty: "bg-white/5 text-slate-500 border-white/5",
  good: "bg-emerald-500/20 text-emerald-300 border-emerald-500/60",
  okay: "bg-yellow-500/20 text-yellow-300 border-yellow-500/60",
  off: "bg-red-500/20 text-red-300 border-red-500/60",
};

const Calendar = () => {
  const { user } = useContext(UserContext);
  const username = user?.username;

  const today = todayLocal(); // "2026-11-13"
  const [year, setYear] = useState(Number(today.slice(0, 4)));
  const [month, setMonth] = useState(Number(today.slice(5, 7)));
  const [monthData, setMonthData] = useState(null);
  const [selected, setSelected] = useState(today); // kijelölt nap (YYYY-MM-DD)
  const [dayData, setDayData] = useState(null);
  const [error, setError] = useState("");

  // Hónap betöltése, amikor változik a hónap
  useEffect(() => {
    if (!username) return;
    let cancelled = false;
    setMonthData(null);

    getMonth(username, year, month)
      .then((data) => {
        if (!cancelled) setMonthData(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, [username, year, month]);

  // A kijelölt nap részleteinek betöltése
  useEffect(() => {
    if (!username) return;
    let cancelled = false;
    setDayData(null);

    getDay(username, selected)
      .then((data) => {
        if (!cancelled) setDayData(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, [username, selected]);

  // A backend csak az adatos napokat adja vissza, ezért dátum szerinti kereséshez map-et építünk
  const daysByDate = useMemo(() => {
    const map = {};
    (monthData?.days ?? []).forEach((d) => {
      map[d.date] = d;
    });
    return map;
  }, [monthData]);

  const calorieGoal = monthData?.calorieGoal ?? 0;
  const waterGoal = monthData?.waterGoalMl ?? 0;

  const daysInMonth = new Date(year, month, 0).getDate();
  // A hét hétfővel kezdődik: a JS getDay() vasárnap = 0, ezért kell az eltolás
  const offset = (new Date(year, month - 1, 1).getDay() + 6) % 7;

  const isCurrentMonth = year === Number(today.slice(0, 4)) && month === Number(today.slice(5, 7));

  const changeMonth = (delta) => {
    let m = month + delta;
    let y = year;
    if (m < 1) {
      m = 12;
      y -= 1;
    } else if (m > 12) {
      m = 1;
      y += 1;
    }
    setYear(y);
    setMonth(m);
    // Új hónapban az 1. napot jelöljük ki (vagy a mai napot, ha az aktuális hónapra lépünk)
    const isNowMonth = y === Number(today.slice(0, 4)) && m === Number(today.slice(5, 7));
    setSelected(isNowMonth ? today : toIso(y, m, 1));
  };

  // Összesítő a hónapról
  const goodDays = (monthData?.days ?? []).filter(
    (d) => dayStatus(d, calorieGoal) === "good"
  ).length;
  const loggedDays = (monthData?.days ?? []).filter(
    (d) => dayStatus(d, calorieGoal) !== "empty"
  ).length;

  return (
    <main className="container mx-auto px-4 py-6 text-white max-w-5xl font-lemon">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8">Naptár</h1>

      {error && (
        <div className="mb-6 text-red-400 text-sm bg-red-500/10 p-3 rounded-2xl border border-red-500/20 text-center">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BAL: HAVI NÉZET */}
        <section className="bg-[#171e27]/80 p-6 rounded-[2rem] border border-white/5 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              className="p-2 rounded-xl border border-white/10 hover:border-[#68D391] hover:text-[#68D391] transition-colors"
              aria-label="Előző hónap"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg md:text-xl uppercase tracking-widest text-[#68D391]">
              {year}. {MONTH_NAMES[month - 1]}
            </h2>
            <button
              type="button"
              onClick={() => changeMonth(1)}
              disabled={isCurrentMonth}
              className="p-2 rounded-xl border border-white/10 hover:border-[#68D391] hover:text-[#68D391] transition-colors disabled:opacity-30 disabled:hover:border-white/10 disabled:hover:text-white"
              aria-label="Következő hónap"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-2">
            {WEEKDAYS.map((w) => (
              <div key={w} className="text-center text-xs text-slate-500 uppercase">
                {w}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {/* Üres cellák a hónap első napja előtt */}
            {Array.from({ length: offset }).map((_, i) => (
              <div key={`blank-${i}`} />
            ))}

            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
              const iso = toIso(year, month, day);
              const data = daysByDate[iso];
              const status = dayStatus(data, calorieGoal);
              const isFuture = iso > today;
              const isSelected = iso === selected;
              const waterReached = waterGoal > 0 && (data?.waterMl ?? 0) >= waterGoal;

              return (
                <button
                  key={iso}
                  type="button"
                  disabled={isFuture}
                  onClick={() => setSelected(iso)}
                  className={`relative aspect-square rounded-xl border text-sm flex items-center justify-center transition-all
                    ${STATUS_STYLE[status]}
                    ${isFuture ? "opacity-30 cursor-not-allowed" : "hover:brightness-125 active:scale-95"}
                    ${isSelected ? "ring-2 ring-white" : ""}
                    ${iso === today ? "font-bold" : ""}`}
                >
                  {day}
                  {/* Kék pötty: a vízcél teljesült */}
                  {waterReached && (
                    <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-cyan-400" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Jelmagyarázat */}
          <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-400">
            <span className="flex items-center gap-2">
              <i className="w-3 h-3 rounded bg-emerald-500/60 inline-block" /> Cél ±10%
            </span>
            <span className="flex items-center gap-2">
              <i className="w-3 h-3 rounded bg-yellow-500/60 inline-block" /> Cél ±25%
            </span>
            <span className="flex items-center gap-2">
              <i className="w-3 h-3 rounded bg-red-500/60 inline-block" /> Ennél messzebb
            </span>
            <span className="flex items-center gap-2">
              <i className="w-3 h-3 rounded bg-white/10 inline-block" /> Nincs adat
            </span>
            <span className="flex items-center gap-2">
              <i className="w-2 h-2 rounded-full bg-cyan-400 inline-block" /> Vízcél teljesítve
            </span>
          </div>

          <p className="mt-6 text-center text-slate-300">
            {loggedDays > 0 ? (
              <>
                <span className="text-[#68D391] text-xl">{goodDays}</span> / {loggedDays} napon
                tartottad a kalóriacélt
              </>
            ) : (
              "Ebben a hónapban még nincs rögzített nap."
            )}
          </p>
        </section>

        {/* JOBB: A KIJELÖLT NAP RÉSZLETEI */}
        <section className="bg-[#171e27]/80 p-6 rounded-[2rem] border border-white/5 shadow-2xl">
          <h2 className="text-lg md:text-xl uppercase tracking-widest text-[#68D391] text-center mb-6">
            {selected.replace(/-/g, ". ")}.
          </h2>

          {!dayData ? (
            <p className="text-center text-slate-500">Betöltés...</p>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[#12181f] rounded-2xl p-4 text-center">
                  <p className="text-xs text-slate-500 uppercase">Kalória</p>
                  <p className="text-xl">
                    {Math.round(dayData.totalCalories ?? 0)}
                    <span className="text-xs text-slate-500">
                      {" "}/ {Math.round(dayData.calorieGoal ?? 0)} kcal
                    </span>
                  </p>
                </div>
                <div className="bg-[#12181f] rounded-2xl p-4 text-center">
                  <p className="text-xs text-slate-500 uppercase flex items-center justify-center gap-1">
                    <Droplets className="w-3 h-3" /> Víz
                  </p>
                  <p className="text-xl">
                    {toLiters(dayData.waterMl ?? 0)}
                    <span className="text-xs text-slate-500">
                      {" "}/ {toLiters(dayData.waterGoalMl ?? 0)} L
                    </span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-6 text-center text-sm">
                <div>
                  <p className="text-xs text-slate-500 uppercase">Szénhidrát</p>
                  <p>{Math.round(dayData.totalCarbs ?? 0)} g</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase">Zsír</p>
                  <p>{Math.round(dayData.totalFat ?? 0)} g</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase">Fehérje</p>
                  <p>{Math.round(dayData.totalProtein ?? 0)} g</p>
                </div>
              </div>

              {/* Étkezések tételei (csak olvasható, törlés a Napló oldalon van) */}
              {(dayData.meals ?? []).every((m) => m.entries.length === 0) ? (
                <p className="text-center text-slate-500">Ezen a napon nincs rögzített étel.</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {dayData.meals
                    .filter((m) => m.entries.length > 0)
                    .map((meal) => (
                      <div key={meal.mealType}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white">{MEAL_NAMES[meal.mealType]}</span>
                          <span className="text-slate-400">{Math.round(meal.calories)} kcal</span>
                        </div>
                        <ul className="bg-[#12181f] rounded-2xl divide-y divide-white/5">
                          {meal.entries.map((entry) => (
                            <li
                              key={entry.id}
                              className="flex justify-between gap-3 px-4 py-2 text-sm"
                            >
                              <span className="truncate">{entry.foodName}</span>
                              <span className="text-slate-500 whitespace-nowrap">
                                {Math.round(entry.quantityGrams)} g · {Math.round(entry.calories)} kcal
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
};

export default Calendar;