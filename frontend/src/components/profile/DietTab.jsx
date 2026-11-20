import React, { useState } from "react";
import { saveProfile } from "../../api/profileApi";
import { DIETARY_PREFERENCES, DIGESTIVE_ISSUES } from "../../constants/profile";
import { buildProfilePayload } from "../../utils/profile";
import { FieldLabel, OptionButton, SaveButton, StatusMessage, TabTitle } from "./ProfileUI";

// Étkezési szokások: étrendi preferencia és emésztési panaszok.
// Az AI-receptek ezeket is figyelembe veszik (az allergiákat a "Testalkat & Súly" fülön lehet állítani).
const DietTab = ({ user, refreshUser }) => {
  const profile = user.profileDetail ?? {};

  const [diet, setDiet] = useState(profile.dietaryPreference ?? "omnivore");
  const [issues, setIssues] = useState(profile.digestiveIssues ?? []);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  // Változott-e valami a mentett állapothoz képest (a sorrend nem számít)
  const savedIssues = profile.digestiveIssues ?? [];
  const changed =
    diet !== (profile.dietaryPreference ?? "omnivore") ||
    issues.length !== savedIssues.length ||
    issues.some((i) => !savedIssues.includes(i));

  const toggleIssue = (value) => {
    setStatus(null);
    setIssues((prev) => (prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value]));
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);
    try {
      await saveProfile(
        user.username,
        buildProfilePayload(profile, { dietaryPreference: diet, digestiveIssues: issues })
      );
      await refreshUser();
      setStatus({ type: "ok", text: "Elmentve! A következő receptekben már figyelembe vesszük." });
    } catch (err) {
      setStatus({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <TabTitle>Étkezési szokások</TabTitle>

      <div>
        <FieldLabel>Étrendi preferencia</FieldLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DIETARY_PREFERENCES.map((d) => (
            <OptionButton
              key={d.value}
              selected={diet === d.value}
              onClick={() => {
                setStatus(null);
                setDiet(d.value);
              }}
            >
              {d.label}
            </OptionButton>
          ))}
        </div>
      </div>

      <div>
        <FieldLabel>Emésztési panaszok (többet is választhatsz)</FieldLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DIGESTIVE_ISSUES.map((i) => (
            <OptionButton key={i.value} selected={issues.includes(i.value)} onClick={() => toggleIssue(i.value)}>
              {i.label}
            </OptionButton>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Ezek csak a receptjavaslatokat befolyásolják, nem helyettesítik az orvosi tanácsot.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <SaveButton onClick={handleSave} saving={saving} disabled={!changed}>
          Mentés
        </SaveButton>
        <StatusMessage status={status} />
      </div>
    </div>
  );
};

export default DietTab;