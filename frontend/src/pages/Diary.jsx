import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import CalorieRing from '../components/CalorieRing';
import MacroBar from '../components/MacroBar'; 
import MealCard from '../components/MealCard';
import WaterTracker from '../components/WaterTracker';

const Diary = () => {
  const { user, loading } = useContext(UserContext);
  const [stats, setStats] = useState({
    consumed: 0,
    goal: 2000,
    protein: 0, proteinGoal: 0,
    carbs: 0, carbsGoal: 0,
    fat: 0, fatGoal: 0
  });

  useEffect(() => {
    if (user) {
      const goal = user.profileDetail?.dailyCalorieGoal || 2000;
      setStats({
        goal: goal,
        consumed: user.currentCalories || 0,
        protein: user.currentProtein || 0,
        carbs: user.currentCarbs || 0,
        fat: user.currentFat || 0,
        proteinGoal: Math.round((goal * 0.25) / 4),
        carbsGoal: Math.round((goal * 0.45) / 4),
        fatGoal: Math.round((goal * 0.30) / 9)
      });
    }
  }, [user]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Betöltés...</div>;

  return (
    <main className="container mx-auto px-4 py-6 text-white max-w-6xl">
      {/* 1. Header: Kisebb betűméret és szorosabb spacing */}
      <header className="flex flex-col items-center justify-center mb-8 text-center">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white font-lemon mb-1">
          Szia, {user?.profileDetail?.firstName || user?.username}!
        </h1>
        <p className="text-slate-500 font-lemon italic text-sm md:text-base">
          "Az egészség a konyhában kezdődik."
        </p>
      </header>

      {/* 2. Fő kártya: Kisebb padding és lekerekítés a "profi" hatáshoz */}
      <div className="bg-[#171e27]/80 backdrop-blur-md p-6 md:p-8 rounded-[2rem] shadow-2xl border border-white/5">
        <h2 className="text-lg md:text-xl mb-8 text-center font-lemon uppercase tracking-widest text-[#68D391]">
          napi összefoglaló
        </h2>

        {/* Kalória szekció: Kompaktabb grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center mb-10">
          <div className="flex flex-col items-center justify-center text-center order-2 md:order-1">
            <p className="text-slate-500 font-lemon text-xs uppercase tracking-tighter">Bevitt</p>
            <p className="text-xl md:text-2xl font-lemon">{stats.consumed} <span className="text-xs">kcal</span></p>
          </div>

          {/* CalorieRing: Itt érdemes a komponensen belül is csökkenteni a méretet, ha túl nagy */}
          <div className="flex justify-center order-1 md:order-2 scale-90 md:scale-100">
            <CalorieRing consumed={stats.consumed} goal={stats.goal} />
          </div>

          <div className="flex flex-col items-center justify-center text-center order-3">
             <p className="text-slate-500 font-lemon text-xs uppercase tracking-tighter">Cél</p>
             <p className="text-xl md:text-2xl font-lemon">{stats.goal} <span className="text-xs">kcal</span></p>
          </div>
        </div>

        {/* Makrók: Kisebb gap és szövegméret */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8 pt-6 border-t border-white/5">
          <MacroBar label="Szénhidrát" current={stats.carbs} target={stats.carbsGoal} colorClass="bg-gradient-to-r from-blue-500 to-cyan-400" />
          <MacroBar label="Zsír" current={stats.fat} target={stats.fatGoal} colorClass="bg-gradient-to-r from-yellow-500 to-orange-400" />
          <MacroBar label="Fehérje" current={stats.protein} target={stats.proteinGoal} colorClass="bg-gradient-to-r from-emerald-500 to-teal-400" />
        </div>
      </div>

      {/* 3. Alsó kártyák: Rugalmas elrendezés */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
  
  {/* TÁPLÁLKOZÁS (MealCard) */}
    <MealCard />
  {/* VÍZBEVITEL (WaterTracker) */}
    <WaterTracker />
</div>
    </main>
  );
};

export default Diary;