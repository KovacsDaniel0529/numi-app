import React, { useState, useEffect } from 'react';

const MacroBar = ({ label, current, target, colorClass }) => {
const [barWidth, setBarWidth] = useState(0);
  const percentage = Math.min(Math.round((current / target) * 100), 100);

    useEffect(() => {
    // 2. Egy apró késleltetés, hogy a szemünk lássa a mozgást az oldal betöltése után
    const timer = setTimeout(() => {
      setBarWidth(percentage);
    }, 200);

    return () => clearTimeout(timer);
  }, [percentage]);


  return (
    <div className="flex flex-col w-full px-4">
      {/* Feliratok: Név és érték */}
      <div className="flex justify-between items-end mb-2">
        <span className="text-slate-400 text-[20px] uppercase font-lemon tracking-widest">{label}</span>
        <span className="text-white font-lemon text-xl">{current} / {target}g</span>
      </div>

      {/* A csík háttere */}
      <div className="h-5 w-full bg-white/10 rounded-full overflow-hidden shadow-inner">
        {/* Az animált gradiens csík */}
        <div 
          className={`h-full rounded-full transition-all duration-[1500ms] ease-out ${colorClass}`}
          style={{ width: `${barWidth}%` }}
        ></div>
      </div>
    </div>
  );
};

export default MacroBar;