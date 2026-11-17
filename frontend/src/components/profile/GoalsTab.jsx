import React, { useState } from "react";
import { saveProfile } from "../../api/profileApi";
import { ACTIVITY_LEVELS, GOALS } from "../../constants/profile";
import { buildProfilePayload } from "../../utils/profile";
import {
  FieldLabel,
  OptionButton,
  SaveButton,
  StatusMessage,
  TabTitle,
} from "./ProfileUI";

// Céljaim: cél és aktivitási szint módosítása, a kiszámolt napi célok megjelenítése
const GoalsTab = ({ user, refreshUser }) => {
  const profile = user.profileDetail ?? {};

  const [goal, setGoal] = useState(profile.goal ?? "maintain");
  const [activityLevel, setActivityLevel] = useState(profile.activityLevel ?? 1.2);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  const changed = goal !== profile.goal || activityLevel !== profile.activityLevel;

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);
    try {
      await saveProfile(user.username, buildProfilePayload(profile, { goal, activityLevel }));
      await refreshUser();
      setStatus({ type: "ok", text: "Elmentve! A napi kalória- és vízcél újraszámolódott." });
    } catch (err) {
      setStatus({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <TabTitle>Céljaim</TabTitle>

      {/* A backend által kiszámolt napi célok */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#12181f] p-5 rounded-2xl border border-gray-800">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Napi kalóriacél</p>
          <p className="text-3xl font-black text-white">
            {profile.dailyCalorieGoal ?? "--"} <span className="text-base text-gray-500">kcal</span>
          </p>
        </div>
        <div className="bg-[#12181f] p-5 rounded-2xl border border-gray-800">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Napi vízcél</p>
          <p className="text-3xl font-black text-white">
            {profile.dailyWaterGoalMl ? (profile.dailyWaterGoalMl / 1000).toFixed(2).replace(".", ",") : "--"}{" "}
            <span className="text-base text-gray-500">L</span>
          </p>
        </div>
      </div>

      <div>
        <FieldLabel>Mi a célod?</FieldLabel>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {GOALS.map((g) => (
            <OptionButton key={g.value} selected={goal === g.value} onClick={() => setGoal(g.value)}>
              {g.label}
            </OptionButton>
          ))}
        </div>
      </div>

      <div>
        <FieldLabel>Aktivitási szint</FieldLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ACTIVITY_LEVELS.map((a) => (
            <OptionButton
              key={a.value}
              selected={activityLevel === a.value}
              onClick={() => setActivityLevel(a.value)}
            >
              {a.label}
            </OptionButton>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-500">
        A mentés újraszámolja a napi kalória- és vízcélt. A korábbi napokat a Naptár is az aktuális céllal értékeli.
      </p>

      <div className="flex items-center gap-4">
        <SaveButton onClick={handleSave} saving={saving} disabled={!changed}>
          Mentés
        </SaveButton>
        <StatusMessage status={status} />
      </div>
    </div>
  );
};

export default GoalsTab;