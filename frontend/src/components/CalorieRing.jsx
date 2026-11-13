import React, { useState, useEffect } from "react";

const CalorieRing = ({ consumed, goal }) => {
  const [displayPercent, setDisplayPercent] = useState(0);
  // Ha nincs cél (0), ne osszunk nullával
  const targetPercent = goal > 0 ? Math.min(Math.round((consumed / goal) * 100), 100) : 0;
  const duration = 2000;

  useEffect(() => {
    let startTimestamp = null;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setDisplayPercent(Math.floor(easeOut * targetPercent));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    const delayTimer = setTimeout(() => {
      window.requestAnimationFrame(step);
    }, 200);

    return () => clearTimeout(delayTimer);
  }, [targetPercent]);

  return (
    <div className="relative w-80 h-80 flex items-center justify-center mx-auto">
      <img
        src="/gray-leaves.png"
        className="absolute inset-0 w-full h-full object-contain opacity-30"
        style={{ zIndex: 1 }}
      />

      <div
        className="absolute inset-0 w-full h-full"
        style={{
          zIndex: 2,
          "--p": displayPercent,
          WebkitMaskImage: `conic-gradient(black calc(var(--p) * 1%), transparent 0)`,
          maskImage: `conic-gradient(black calc(var(--p) * 1%), transparent 0)`,
        }}
      >
        <img src="/colored_leaves.png" className="w-full h-full object-contain" />
      </div>

      <div className="relative z-10 text-center flex flex-col items-center">
        <h2 className="text-5xl font-black italic text-white leading-none tracking-tighter">
          {displayPercent}%
        </h2>
        <div className="px-3 py-1 mt-3">
          <p className="text-[16px] font-bold text-white tracking-[0.2em] font-lemon">
            Teljesítve
          </p>
        </div>
      </div>
    </div>
  );
};

export default CalorieRing;