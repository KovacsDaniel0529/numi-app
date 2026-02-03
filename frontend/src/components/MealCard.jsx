import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react'; // Ha nem használsz lucide-ot, sima SVG is jó

const MealCard = () => {
  const navigate = useNavigate();

  // Az étkezések adatai
  const meals = [
    { id: 'breakfast', name: 'Reggeli', current: 0, goal: 250, icon: '/sandwich.png' },
    { id: 'lunch', name: 'Ebéd', current: 0, goal: 250, icon: '/lunch.png' },
    { id: 'dinner', name: 'Vacsora', current: 0, goal: 250, icon: '/dinner.png' },
    { id: 'snack', name: 'Nasi', current: 0, goal: 250, icon: '/snacks.png' },
  ];

  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto p-8 bg-[#12161b] rounded-[40px] shadow-2xl border border-white/5">
       <h2 className="text-2xl md:text-3xl mb-6 text-center font-lemon uppercase tracking-widest">
          Táplálkozás
        </h2>
      {meals.map((meal) => {
        const progress = (meal.current / meal.goal) * 100;

        return (
          <div 
            key={meal.id} 
            className="flex items-center justify-between bg-[#1a1f26] p-5 rounded-[30px] border border-white/[0.03] transition-all hover:bg-[#222832]"
          >
            {/* ÉTEL IKON */}
            <div className="w-16 h-16 flex-shrink-0">
              <img src={meal.icon} alt={meal.name} className="w-full h-full object-contain drop-shadow-lg" />
            </div>

            {/* KÖZÉPSŐ RÉSZ: Név, Kcal és Progress Bar */}
            <div className="flex-1 px-6 flex flex-col items-center">
              <h3 className="text-white font-lemon text-xl tracking-wide">{meal.name}</h3>
              <p className="text-gray-400 text-sm font-medium mb-2">{meal.current}/{meal.goal} kcal</p>
              
              {/* PROGRESS BAR - Ugyanaz a stílus mint a CalorieRing */}
              <div className="w-full h-2.5 bg-gray-700/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#68D391] rounded-full shadow-[0_0_10px_rgba(104,211,145,0.5)] transition-all duration-500"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            </div>

            {/* PLUSZ GOMB */}
            <button 
              onClick={() => navigate(`/add-food/${meal.id}`)}
              className="w-12 h-12 flex items-center justify-center bg-transparent border-2 border-white/20 rounded-xl text-white hover:border-[#68D391] hover:text-[#68D391] transition-all active:scale-95 group"
            >
              <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default MealCard;