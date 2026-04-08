import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CalorieRing from '../components/CalorieRing';
import MacroBar from '../components/MacroBar'; 
import MealCard from '../components/MealCard';
import WaterTracker from '../components/WaterTracker';

const Diary = () => {
  // Alaphelyzetben üres adatok
  const [userData, setUserData] = useState({ name: 'Betöltés...', dailyGoal: 2000 });
  const [stats, setStats] = useState({
    consumed: 0,
    goal: 2000,
    protein: 0, proteinGoal: 0,
    carbs: 0, carbsGoal: 0,
    fat: 0, fatGoal: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Megkeressük, ki van bejelentkezve (localStorage-ból)
        const savedUser = JSON.parse(localStorage.getItem('user'));
        const username = savedUser?.username || savedUser?.profileDetail?.username;

        if (!username) {
          console.error("Nincs bejelentkezett felhasználó!");
          return;
        }

        // 2. Kérés a Java backendhez (Spring Boot alapértelmezett portja: 8080)
        const response = await axios.get(`http://localhost:8080/api/auth/stats/${username}`);
        const data = response.data;
        
        console.log("Backend válasz érkezett:", data);

        // 3. Adatok kinyerése (figyelembe véve a profileDetail struktúrát)
        const goal = data.profileDetail?.dailyCalorieGoal || 2000;
        const firstName = data.profileDetail?.firstName || data.username || "Felhasználó";

        // 4. State-ek frissítése
        setUserData({
          name: firstName,
          dailyGoal: goal
        });

        setStats({
          goal: goal,
          consumed: data.currentCalories || 0, // Ha van ilyen meződ a backendben
          protein: data.currentProtein || 0,
          carbs: data.currentCarbs || 0,
          fat: data.currentFat || 0,
          // Makró számítások a cél alapján
          proteinGoal: Math.round((goal * 0.25) / 4),
          carbsGoal: Math.round((goal * 0.45) / 4),
          fatGoal: Math.round((goal * 0.30) / 9)
        });

      } catch (error) {
        console.error("Hiba történt az adatok lekérésekor:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="container mx-auto px-4 py-8 text-white">
      {/* DEBUG SOR - CSAK TESZTELÉSHEZ, TÖRÖLHETŐ */}
      <div className="text-xs text-gray-500 mb-4">Adatforrás: {userData.name} ({stats.goal} kcal)</div>

      <header className="flex flex-col items-center justify-center mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white font-lemon mb-2">
          Szia, {userData.name}! Itt tartasz ma:
        </h1>
        <p className="text-slate-500 font-lemon italic text-lg">
          "Az egészség a konyhában kezdődik."
        </p>
      </header>

      <div className="bg-[#101317] p-6 md:p-12 rounded-[3rem] shadow-2xl border border-white/5">
        <h2 className="text-2xl md:text-3xl mb-12 text-center font-lemon uppercase tracking-widest">
          napi összefoglaló
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center mb-16">
          <div className="flex flex-col items-center justify-center text-center order-2 lg:order-1">
            <p className="text-slate-400 font-lemon text-sm uppercase">Bevitt</p>
            <p className="text-3xl font-lemon">{stats.consumed} kcal</p>
          </div>

          <div className="flex justify-center order-1 lg:order-2">
            <CalorieRing consumed={stats.consumed} goal={stats.goal} />
          </div>

          <div className="flex flex-col items-center justify-center text-center order-3">
             <p className="text-slate-400 font-lemon text-sm uppercase">Cél</p>
             <p className="text-3xl font-lemon">{stats.goal} kcal</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-white/10">
          <MacroBar label="Szénhidrát" current={stats.carbs} target={stats.carbsGoal} colorClass="bg-gradient-to-r from-blue-500 to-cyan-400" />
          <MacroBar label="Zsír" current={stats.fat} target={stats.fatGoal} colorClass="bg-gradient-to-r from-yellow-500 to-orange-400" />
          <MacroBar label="Fehérje" current={stats.protein} target={stats.proteinGoal} colorClass="bg-gradient-to-r from-emerald-500 to-teal-400" />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 mt-12">
        <div className="w-full lg:w-1/2"><MealCard /></div>
        <div className="w-full lg:w-1/2"><WaterTracker /></div>
      </div>
    </main>
  );
};

export default Diary;