import React, { useState } from 'react';

const WaterTracker = () => {
  // A vízszint százalékban (100 = tele, 0 = üres)
  const [waterLevel, setWaterLevel] = useState(100);
  // Megivott mennyiség literben (példa)
  const [drankAmount, setDrankAmount] = useState(0);

  const handleDrink = () => {
    if (waterLevel > 0) {
      setWaterLevel(prev => Math.max(0, prev - 10)); // 10%-kal csökken
      setDrankAmount(prev => +(prev + 0.25).toFixed(2)); // +2.5 dl
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-10">
      {/* KANCSÓ KONTÉNER */}
      <div className="relative w-64 h-80 overflow-hidden" 
           style={{ clipPath: 'inset(0 0 0 0 round 20px)' }}> 
        
        {/* 1. VÍZ RÉTEG (Hátul) */}
        <div 
          className="absolute bottom-0 left-0 w-full bg-blue-500 transition-all duration-700 ease-in-out"
          style={{ height: `${waterLevel}%` }}
        >
          {/* Opcionális: Hullám effekt a víz tetejére */}
          <div className="absolute top-0 left-0 w-full h-4 bg-blue-400 opacity-50 animate-pulse"></div>
        </div>

        {/* 2. KANCSÓ PNG (Elöl) */}
        <img 
          src="/pitcher.png" 
          alt="Kancsó"
          className="absolute inset-0 w-full h-full object-contain z-10 pointer-events-none"
        />
      </div>

      {/* ADATOK ÉS GOMB */}
      <div className="text-white text-center">
        <p className="text-2xl font-bold">{drankAmount} L elfogyasztva</p>
        <p className="text-gray-400">{waterLevel}% maradt</p>
        <button 
          onClick={handleDrink}
          className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-full transition-colors"
        >
          Ittam egy pohárral (2.5 dl)
        </button>
      </div>
    </div>
  );
};

export default WaterTracker;