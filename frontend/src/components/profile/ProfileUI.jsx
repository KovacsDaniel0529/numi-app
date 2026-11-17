import React from "react";

// Kis, többször használt elemek a profil fülekhez

export const inputClass =
  "w-full bg-[#12181f] border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-[#22c55e] transition-all text-white";

export const FieldLabel = ({ children }) => (
  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
    {children}
  </label>
);

export const TabTitle = ({ children }) => (
  <h3 className="text-xl font-bold text-white border-b border-gray-800 pb-4">{children}</h3>
);

// status: { type: "ok" | "error", text: "..." } vagy null
export const StatusMessage = ({ status }) =>
  status ? (
    <p className={`text-sm ${status.type === "ok" ? "text-emerald-400" : "text-red-400"}`}>
      {status.text}
    </p>
  ) : null;

export const SaveButton = ({ onClick, disabled, saving, children = "Mentés" }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled || saving}
    className="bg-[#22c55e] text-[#12181f] font-bold px-6 py-3 rounded-xl hover:bg-[#1da850] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
  >
    {saving ? "Mentés..." : children}
  </button>
);

// Választógomb (nem, cél, aktivitás)
export const OptionButton = ({ selected, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-4 py-3 rounded-xl border transition-all text-left ${
      selected
        ? "bg-[#22c55e]/15 border-[#22c55e] text-[#22c55e] font-bold"
        : "bg-[#12181f] border-gray-700 text-gray-300 hover:border-gray-500"
    }`}
  >
    {children}
  </button>
);

export const ReadOnlyField = ({ label, value }) => (
  <div>
    <FieldLabel>{label}</FieldLabel>
    <p className="text-lg text-white">{value || "Nincs megadva"}</p>
  </div>
);