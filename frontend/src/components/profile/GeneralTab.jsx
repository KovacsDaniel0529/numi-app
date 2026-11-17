import React, { useState } from "react";
import { saveProfile } from "../../api/profileApi";
import { GENDERS } from "../../constants/profile";
import { buildProfilePayload } from "../../utils/profile";
import {
  FieldLabel,
  inputClass,
  OptionButton,
  ReadOnlyField,
  SaveButton,
  StatusMessage,
  TabTitle,
} from "./ProfileUI";

// Fiók adatai: a név, a nem és a kor módosítható, a felhasználónév és az email nem
const GeneralTab = ({ user, refreshUser }) => {
  const profile = user.profileDetail ?? {};

  const [firstName, setFirstName] = useState(profile.firstName ?? "");
  const [gender, setGender] = useState(profile.gender ?? "female");
  const [age, setAge] = useState(profile.age?.toString() ?? "");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  const changed =
    firstName.trim() !== (profile.firstName ?? "") ||
    gender !== profile.gender ||
    Number(age) !== profile.age;

  const handleSave = async () => {
    const numAge = Number(age);
    if (!firstName.trim()) {
      setStatus({ type: "error", text: "A név nem lehet üres!" });
      return;
    }
    if (!Number.isInteger(numAge) || numAge < 10 || numAge > 120) {
      setStatus({ type: "error", text: "A kor 10 és 120 év között legyen!" });
      return;
    }

    setSaving(true);
    setStatus(null);
    try {
      await saveProfile(
        user.username,
        buildProfilePayload(profile, { firstName: firstName.trim(), gender, age: numAge })
      );
      await refreshUser();
      setStatus({ type: "ok", text: "Elmentve! A napi célok újraszámolódtak." });
    } catch (err) {
      setStatus({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <TabTitle>Fiók adatai</TabTitle>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ReadOnlyField label="Felhasználónév" value={user.username} />
        <ReadOnlyField label="Email cím" value={user.email} />
      </div>

      <div>
        <FieldLabel>Becenév / megszólítás</FieldLabel>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          maxLength={40}
          className={inputClass}
        />
      </div>

      <div>
        <FieldLabel>Neme</FieldLabel>
        <div className="grid grid-cols-2 gap-3">
          {GENDERS.map((g) => (
            <OptionButton key={g.value} selected={gender === g.value} onClick={() => setGender(g.value)}>
              {g.label}
            </OptionButton>
          ))}
        </div>
      </div>

      <div>
        <FieldLabel>Kor</FieldLabel>
        <input
          type="number"
          min="10"
          max="120"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          onKeyDown={(e) => (e.key === "-" || e.key === "e" || e.key === ".") && e.preventDefault()}
          className={inputClass}
        />
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

export default GeneralTab;