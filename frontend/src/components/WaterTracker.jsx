import React, { useState } from "react";
import { motion } from "framer-motion";
import { addWater, undoWater } from "../api/waterApi";
import { todayLocal } from "../utils/date";

const STEP_ML = 250; // 2,5 dl

// 1250 ml -> "1,25"
const toLiters = (ml) => (ml / 1000).toFixed(2).replace(".", ",");

const WaterTracker = ({ username, waterMl = 0, goalMl = 0, onChange }) => {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // A kancsó 100%-ról indul, és az ivással csökken a vízszint
  const drunkPercent = goalMl > 0 ? Math.min((waterMl / goalMl) * 100, 100) : 0;
  const waterLevel = 100 - drunkPercent;

  const run = async (action) => {
    setBusy(true);
    setError("");
    try {
      const summary = await action(); // { date, totalAmountMl, goalMl }
      onChange?.(summary.totalAmountMl);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleAdd = () => run(() => addWater(username, STEP_ML, todayLocal()));
  const handleUndo = () => run(() => undoWater(username, todayLocal()));

  const jarStyle = {
    width: "12rem",
    height: "18rem",
    backgroundImage: 'url("/water_jug.png")',
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  return (
    <div className="flex flex-col items-center justify-between gap-6 pt-8 p-6 pb-12 bg-[#171e27] rounded-[40px] shadow-2xl border border-white/5 w-full h-full">
      <h2 className="text-2xl md:text-3xl mb-6 font-lemon uppercase tracking-widest text-white text-center">
        Vízbevitel
      </h2>

      <div className="text-center font-lemon">
        <span className="text-5xl text-white">{toLiters(waterMl)}L</span>
        <span className="text-slate-500 text-xl ml-2">/ {toLiters(goalMl)}L</span>
      </div>

      <div className="relative" style={{ width: jarStyle.width, height: jarStyle.height }}>
        <div className="absolute inset-0 opacity-20" style={jarStyle} />

        <div
          className="absolute inset-0"
          style={{
            ...jarStyle,
            backgroundImage: "none",
            WebkitMaskImage: 'url("/water_jug.png")',
            maskImage: 'url("/water_jug.png")',
            WebkitMaskSize: "contain",
            WebkitMaskPosition: "center",
            WebkitMaskRepeat: "no-repeat",
          }}
        >
          <motion.div
            initial={{ height: "100%" }}
            animate={{ height: `${waterLevel}%` }}
            transition={{ type: "spring", stiffness: 35, damping: 15 }}
            className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-blue-600 to-cyan-400"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-white/40 shadow-[0_0_10px_white]" />
          </motion.div>
        </div>

        <div className="absolute inset-0 opacity-50 z-20 pointer-events-none" style={jarStyle} />
      </div>

      {error && (
        <p className="text-red-400 text-sm text-center font-lemon">{error}</p>
      )}

      <div className="flex gap-4 w-full px-4">
        <button
          onClick={handleAdd}
          disabled={busy}
          className="flex-1 py-4 bg-[#12181f] border border-white/10 rounded-2xl text-white font-lemon hover:border-emerald-400 transition-all active:scale-95 disabled:opacity-50"
        >
          + 2.5 dl
        </button>
        <button
          onClick={handleUndo}
          disabled={busy || waterMl <= 0}
          className="flex-1 py-4 bg-[#12181f] border border-white/10 rounded-2xl text-white font-lemon hover:border-red-400 transition-all active:scale-95 disabled:opacity-50"
        >
          - 2.5 dl
        </button>
      </div>
    </div>
  );
};

export default WaterTracker;