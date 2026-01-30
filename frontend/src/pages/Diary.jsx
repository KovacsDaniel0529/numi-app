import React, { useState } from 'react';
import CalorieRing from '../components/CalorieRing';
import MacroBar from '../components/MacroBar'; 
import MealCard from '../components/MealCard';

const Diary = () => {
  const [stats, setStats] = useState({
    consumed: 1450,
    goal: 2000,
    protein: 80,
    proteinGoal: 150,
    carbs: 150,
    carbsGoal: 250,
    fat: 45,
    fatGoal: 70
  });

  return (
    <main className="container mx-auto px-4 py-8 text-white">
      <header className="flex flex-col items-center justify-center mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white font-lemon mb-2">
          Szia! Itt tartasz ma:
        </h1>
        <p className="text-slate-500 font-lemon italic text-lg">
          "Az egészség a konyhában kezdődik."
        </p>
      </header>

      <div className="bg-[#101317] p-6 md:p-12 rounded-[3rem] shadow-2xl border border-white/5">
        <h2 className="text-2xl md:text-3xl mb-12 text-center font-lemon uppercase tracking-widest">
          napi összefoglaló
        </h2>

        {/* Kalória rész */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center mb-16">
          <div className="flex flex-col items-center justify-center order-2 lg:order-1 text-center">
            <p className="text-slate-400 font-lemon text-sm uppercase tracking-tighter">Bevitt</p>
            <p className="text-3xl font-lemon">{stats.consumed} kcal</p>
          </div>

          <div className="flex justify-center order-1 lg:order-2">
            <CalorieRing consumed={stats.consumed} goal={stats.goal} />
          </div>

          <div className="flex flex-col items-center justify-center order-3 text-center">
             <p className="text-slate-400 font-lemon text-sm uppercase tracking-tighter">Cél</p>
             <p className="text-3xl font-lemon">{stats.goal} kcal</p>
          </div>
        </div>

        {/* MAKRO CSÍKOK - Itt használjuk az új komponenst */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-white/10">
          <MacroBar 
            label="Szénhidrát" 
            current={stats.carbs} 
            target={stats.carbsGoal} 
            colorClass="bg-gradient-to-r from-blue-500 to-cyan-400" 
          />
          <MacroBar 
            label="Zsír" 
            current={stats.fat} 
            target={stats.fatGoal} 
            colorClass="bg-gradient-to-r from-yellow-500 to-orange-400" 
          />
          <MacroBar 
            label="Fehérje" 
            current={stats.protein} 
            target={stats.proteinGoal} 
            colorClass="bg-gradient-to-r from-emerald-500 to-teal-400" 
          />
        </div>
      </div>
      <div className="w-full pt-9"> 
  <div className="w-full max-w-[1000px] flex justify-start pl-4">
    <div className="w-full max-w-md">
       <MealCard />
    </div>
  </div>
  </div>
   <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-white/10">
   
   </div>
    </main>
  );
};

export default Diary;