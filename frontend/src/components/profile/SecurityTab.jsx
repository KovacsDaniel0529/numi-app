import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { changePassword, deleteAccount } from "../../api/accountApi";
import {
  FieldLabel,
  inputClass,
  SaveButton,
  StatusMessage,
  TabTitle,
} from "./ProfileUI";

// Biztonság: jelszócsere és fióktörlés
const SecurityTab = ({ user, onAccountDeleted }) => {
  // Jelszócsere
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  // Fióktörlés
  const [showDelete, setShowDelete] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState(null);

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword) {
      setStatus({ type: "error", text: "Töltsd ki az összes mezőt!" });
      return;
    }
    if (newPassword.length < 6) {
      setStatus({ type: "error", text: "Az új jelszó legalább 6 karakter legyen!" });
      return;
    }
    if (newPassword !== confirmPassword) {
      setStatus({ type: "error", text: "A két új jelszó nem egyezik meg!" });
      return;
    }

    setSaving(true);
    setStatus(null);
    try {
      await changePassword(user.username, currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setStatus({ type: "ok", text: "A jelszavad megváltozott!" });
    } catch (err) {
      setStatus({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletePassword) {
      setDeleteStatus({ type: "error", text: "Add meg a jelszavad a megerősítéshez!" });
      return;
    }
    setDeleting(true);
    setDeleteStatus(null);
    try {
      await deleteAccount(user.username, deletePassword);
      onAccountDeleted(); // kijelentkeztet és a belépő oldalra visz
    } catch (err) {
      setDeleteStatus({ type: "error", text: err.message });
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="space-y-6">
        <TabTitle>Jelszó módosítása</TabTitle>

        <div>
          <FieldLabel>Jelenlegi jelszó</FieldLabel>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className={inputClass}
            autoComplete="current-password"
          />
        </div>
        <div>
          <FieldLabel>Új jelszó (legalább 6 karakter)</FieldLabel>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={inputClass}
            autoComplete="new-password"
          />
        </div>
        <div>
          <FieldLabel>Új jelszó újra</FieldLabel>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={inputClass}
            autoComplete="new-password"
          />
        </div>

        <div className="flex items-center gap-4">
          <SaveButton onClick={handlePasswordChange} saving={saving}>
            Jelszó módosítása
          </SaveButton>
          <StatusMessage status={status} />
        </div>
      </div>

      {/* VESZÉLYES ZÓNA */}
      <div className="border border-red-500/30 bg-red-500/5 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-red-400 flex items-center gap-2">
          <Trash2 size={20} /> Fiók törlése
        </h3>
        <p className="text-sm text-gray-400">
          A fiókod, a profilod és az összes naplóbejegyzésed (étel és víz) véglegesen törlődik. Ez nem
          vonható vissza.
        </p>

        {!showDelete ? (
          <button
            type="button"
            onClick={() => setShowDelete(true)}
            className="px-6 py-3 rounded-xl border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-colors"
          >
            Fiók törlése...
          </button>
        ) : (
          <div className="space-y-3">
            <FieldLabel>A megerősítéshez add meg a jelszavad</FieldLabel>
            <input
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              className={inputClass}
              autoComplete="current-password"
            />
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="px-6 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {deleting ? "Törlés..." : "Végleges törlés"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDelete(false);
                  setDeletePassword("");
                  setDeleteStatus(null);
                }}
                className="px-6 py-3 rounded-xl border border-gray-700 text-gray-300 hover:border-gray-500 transition-colors"
              >
                Mégse
              </button>
            </div>
            <StatusMessage status={deleteStatus} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityTab;