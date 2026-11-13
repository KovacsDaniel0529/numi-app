import React, { useState, useEffect } from "react";

const MacroBar = ({ label, current, target, colorClass }) => {
  const [barWidth, setBarWidth] = useState(0);
  // Ha nincs cél (0), ne osszunk nullával
  const percentage = target > 0 ? Math.min(Math.round((current / target) * 100), 100) : 0;

  useEffect(() => {
    const timer = setTimeout(() => {
      setBarWidth(percentage);
    }, 200);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className="flex flex-col w-full px-4">
      <div className="flex justify-between items-end mb-2">
        <span className="text-slate-400 text-[20px] uppercase font-lemon tracking-widest">{label}</span>
        <span className="text-white font-lemon text-xl">
          {current} / {target}g
        </span>
      </div>

      <div className="h-5 w-full bg-white/10 rounded-full overflow-hidden shadow-inner">
        <div
          className={`h-full rounded-full transition-all duration-[1500ms] ease-out ${colorClass}`}
          style={{ width: `${barWidth}%` }}
        ></div>
      </div>
    </div>
  );
};

export default MacroBar;