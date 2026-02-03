import React, { useState } from 'react';
import { motion } from 'framer-motion';

const WaterTracker = () => {
  const [consumed, setConsumed] = useState(0); 
  const goal = 2.0;
  
  // Mivel a kancsóból iszunk, a vízszint 100%-ról indul és csökken
  const waterLevel = Math.max(0, 100 - (consumed / goal) * 100);

  // Közös méretezési és pozicionálási stílus a teljes átfedéshez
  const jarStyle = {
    width: '12rem', // w-48 megfelelője
    height: '18rem', // h-72 megfelelője
    backgroundImage: 'url("/water_jug.png")',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  return (
    <div className="flex flex-col items-center justify-between gap-6 pt-8 p-6 pb-12 bg-[#12161b] rounded-[40px] shadow-2xl border border-white/5 w-full h-full">
    {/* A justify-between segít elosztani a tartalmat, ha a kártya megnyúlik */}
    <h2 className="text-2xl md:text-3xl mb-6 font-lemon uppercase tracking-widest text-white text-center">Vízbevitel</h2>
      
      <div className="text-center font-lemon">
        <span className="text-5xl text-white">{consumed}L</span>
        <span className="text-slate-500 text-xl ml-2">/ {goal}L</span>
      </div>

      {/* KANCSÓ KONTÉNER */}
      <div className="relative" style={{ width: jarStyle.width, height: jarStyle.height }}>
        
        {/* 1. HÁTTÉR: A halvány kancsó (Ez most div, nem img, hogy ne csússzon el) */}
        <div 
          className="absolute inset-0 opacity-20"
          style={jarStyle}
        />

        {/* 2. VÍZ RÉTEG: Maszkolva a kancsó formájára */}
        <div 
          className="absolute inset-0"
          style={{
            ...jarStyle,
            backgroundImage: 'none', // Itt nem kell háttérkép, csak maszk
            WebkitMaskImage: 'url("/water_jug.png")',
            maskImage: 'url("/water_jug.png")',
            WebkitMaskSize: 'contain',
            WebkitMaskPosition: 'center',
            WebkitMaskRepeat: 'no-repeat',
          }}
        >
          {/* A tényleges kék vízfelület */}
          <motion.div 
            initial={{ height: "100%" }}
            animate={{ height: `${waterLevel}%` }}
            transition={{ type: "spring", stiffness: 35, damping: 15 }}
            className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-blue-600 to-cyan-400"
          >
            {/* Hullám effekt a víz tetején */}
            <div className="absolute top-0 left-0 w-full h-1 bg-white/40 shadow-[0_0_10px_white]" />
          </motion.div>
        </div>

        {/* 3. ELŐTÉR: Az élesebb körvonal (szintén div a pontos illeszkedésért) */}
        <div 
          className="absolute inset-0 opacity-50 z-20 pointer-events-none"
          style={jarStyle}
        />
      </div>

      <div className="flex gap-4 w-full px-4">
        
        <button 
          onClick={() => setConsumed(prev => +(prev + 0.25).toFixed(2))}
          className="flex-1 py-4 bg-[#1a1f26] border border-white/10 rounded-2xl text-white font-lemon hover:border-emerald-400 transition-all active:scale-95"
        >
          + 2.5 dl
        </button>
        <button 
          onClick={() => setConsumed(prev => Math.max(0, +(prev - 0.25).toFixed(2)))}
          className="flex-1 py-4 bg-[#1a1f26] border border-white/10 rounded-2xl text-white font-lemon hover:border-red-400 transition-all active:scale-95"
        >
          - 2.5 dl
        </button>
      </div>
    </div>
  );
};

export default WaterTracker;