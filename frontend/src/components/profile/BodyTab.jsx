import React, { useState } from "react";
import { Shield } from "lucide-react";
import AllergySelector from "../AllergySelector";
import { saveProfile, updateWeight } from "../../api/profileApi";
import { buildProfilePayload, calculateBmi, bmiCategory } from "../../utils/profile";
import {
  FieldLabel,
  inputClass,
  SaveButton,
  StatusMessage,
  TabTitle,
} from "./ProfileUI";

// Testalkat és súly: súly, magasság, BMI és az allergiák szerkesztése
const BodyTab = ({ user, refreshUser }) => {
  const profile = user.profileDetail ?? {};
  const currentAllergies = profile.allergies ?? [];

  // Súly
  const [newWeight, setNewWeight] = useState("");
  const [weightSaving, setWeightSaving] = useState(false);
  const [weightStatus, setWeightStatus] = useState(null);

  // Magasság
  const [height, setHeight] = useState(profile.height?.toString() ?? "");
  const [heightSaving, setHeightSaving] = useState(false);
  const [heightStatus, setHeightStatus] = useState(null);

  // Allergiák (helyi másolat, amit a Mentés gombbal küldünk el)
  const [allergies, setAllergies] = useState(currentAllergies);
  const [allergySaving, setAllergySaving] = useState(false);
  const [allergyStatus, setAllergyStatus] = useState(null);

  const bmi = calculateBmi(profile.weight, profile.height);

  const handleWeightSave = async () => {
    const value = parseFloat(newWeight);
    if (!value || value < 25 || value > 400) {
      setWeightStatus({ type: "error", text: "Kérlek, valós testsúlyt adj meg (25–400 kg)!" });
      return;
    }
    setWeightSaving(true);
    setWeightStatus(null);
    try {
      await updateWeight(user.username, value);
      await refreshUser();
      setNewWeight("");
      setWeightStatus({ type: "ok", text: "Elmentve! A napi célok újraszámolódtak." });
    } catch (err) {
      setWeightStatus({ type: "error", text: err.message });
    } finally {
      setWeightSaving(false);
    }
  };

  const handleHeightSave = async () => {
    const value = parseFloat(height);
    if (!value || value < 50 || value > 260) {
      setHeightStatus({ type: "error", text: "Kérlek, valós magasságot adj meg (50–260 cm)!" });
      return;
    }
    setHeightSaving(true);
    setHeightStatus(null);
    try {
      await saveProfile(user.username, buildProfilePayload(profile, { height: value }));
      await refreshUser();
      setHeightStatus({ type: "ok", text: "Elmentve! A napi célok újraszámolódtak." });
    } catch (err) {
      setHeightStatus({ type: "error", text: err.message });
    } finally {
      setHeightSaving(false);
    }
  };

  const toggleAllergy = (value) => {
    setAllergyStatus(null);
    setAllergies((prev) =>
      prev.includes(value) ? prev.filter((a) => a !== value) : [...prev, value]
    );
  };

  // Az allergiák sorrendje nem számít, ezért rendezve hasonlítjuk össze
  const allergiesChanged =
    [...allergies].sort().join(",") !== [...currentAllergies].sort().join(",");

  const handleAllergySave = async () => {
    setAllergySaving(true);
    setAllergyStatus(null);
    try {
      await saveProfile(user.username, buildProfilePayload(profile, { allergies }));
      await refreshUser();
      setAllergyStatus({ type: "ok", text: "Elmentve! A Kajapédia és a receptek már ezt veszik figyelembe." });
    } catch (err) {
      setAllergyStatus({ type: "error", text: err.message });
    } finally {
      setAllergySaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <TabTitle>Testalkat, súly és allergiák</TabTitle>

      {/* SÚLY ÉS BMI */}
      <div className="bg-[#12181f] p-6 rounded-2xl border border-gray-800 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400 mb-1">Jelenlegi testsúly</p>
            <p className="text-4xl font-black text-white">
              {profile.weight ?? "--"} <span className="text-lg text-gray-500">kg</span>
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">BMI</p>
            {bmi ? (
              <>
                <p className="text-4xl font-black text-white">{bmi.toFixed(1)}</p>
                <p className="text-sm text-gray-400">{bmiCategory(bmi)}</p>
              </>
            ) : (
              <p className="text-4xl font-black text-white">--</p>
            )}
          </div>
        </div>
        <p className="text-xs text-gray-500">
          A BMI csak tájékoztató jellegű mutató, nem helyettesíti az orvosi vagy dietetikusi értékelést.
        </p>

        <div>
          <FieldLabel>Súly frissítése (kg)</FieldLabel>
          <div className="flex gap-3">
            <input
              type="number"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              placeholder={profile.weight?.toString() ?? "80"}
              className={inputClass}
            />
            <SaveButton onClick={handleWeightSave} saving={weightSaving}>
              Mentés
            </SaveButton>
          </div>
          <div className="mt-2">
            <StatusMessage status={weightStatus} />
          </div>
        </div>

        <div>
          <FieldLabel>Magasság (cm)</FieldLabel>
          <div className="flex gap-3">
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className={inputClass}
            />
            <SaveButton
              onClick={handleHeightSave}
              saving={heightSaving}
              disabled={Number(height) === profile.height}
            >
              Mentés
            </SaveButton>
          </div>
          <div className="mt-2">
            <StatusMessage status={heightStatus} />
          </div>
        </div>
      </div>

      {/* ALLERGIÁK */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Shield className="text-red-400" size={20} />
          Allergiák és ételérzékenységek
        </h3>
        <p className="text-sm text-gray-400">
          Ezeket a Kajapédia figyelmeztetésekhez és az AI receptjavaslatokhoz használjuk.
        </p>

        <AllergySelector
          selectedAllergies={allergies}
          onToggle={toggleAllergy}
          onClear={() => {
            setAllergyStatus(null);
            setAllergies([]);
          }}
        />

        <div className="flex items-center gap-4">
          <SaveButton onClick={handleAllergySave} saving={allergySaving} disabled={!allergiesChanged}>
            Allergiák mentése
          </SaveButton>
          <StatusMessage status={allergyStatus} />
        </div>
      </div>
    </div>
  );
};

export default BodyTab;