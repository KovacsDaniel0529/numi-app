import React, { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import {
  User,
  Scale,
  Shield,
  LogOut,
  Trash2,
  ChevronRight,
  ChartSpline,
} from "lucide-react";

const Profile = () => {
  const { user, refreshUser, loading, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  // 1. Definiáljuk az aktív fület
  const [activeTab, setActiveTab] = useState("general");

  // 2. Menüpontok definíciója (ezzel rajzoljuk ki a bal oldalt)
  const menuItems = [
    { id: "general", label: "Fiók adatai", icon: <User size={20} /> },
    { id: "stats", label: "Testalkat & Súly", icon: <Scale size={20} /> },
    { id: "security", label: "Biztonság", icon: <Shield size={20} /> },
    { id: "goals", label: "Céljaim", icon: <ChartSpline size={20} /> },
  ];

  // 3. Kijelentkezés kezelése
  const handleLogout = () => {
    localStorage.removeItem("user"); // Töröljük a tárolóból
    setUser(null); // Töröljük a "hűtőből" (Context)
    navigate("/login"); // Irány a bejelentkezés
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#12181f] flex items-center justify-center text-white">
        Betöltés...
      </div>
    );
  if (!user)
    return (
      <div className="min-h-screen bg-[#12181f] flex items-center justify-center text-white">
        Kérlek jelentkezz be!
      </div>
    );

  return (
    <div className="min-h-screen bg-[#12181f] text-gray-200 p-4 md:p-8">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
        {/* BAL OLDAL: MENÜ (SIDEBAR) */}
        <aside className="w-full md:w-64 space-y-2">
          <h2 className="text-2xl font-bold text-white mb-6 px-2 text-[#22c55e]">
            Beállítások
          </h2>
          <nav>
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                  activeTab === item.id
                    ? "bg-[#1c252e] text-[#22c55e] border-l-4 border-[#22c55e]"
                    : "hover:bg-[#1c252e]/50 text-gray-400"
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </div>
                <ChevronRight
                  size={16}
                  className={
                    activeTab === item.id ? "opacity-100" : "opacity-0"
                  }
                />
              </button>
            ))}
          </nav>

          <hr className="border-gray-800 my-6" />

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-4 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-xl transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium">Kijelentkezés</span>
          </button>
        </aside>

        {/* JOBB OLDAL: TARTALOM */}
        <main className="flex-1 bg-[#1c252e] rounded-3xl p-6 md:p-10 border border-gray-800 shadow-2xl">
          {/* 1. ÁLTALÁNOS ADATOK */}
          {activeTab === "general" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h3 className="text-xl font-bold text-white border-b border-gray-800 pb-4">
                Fiók részletei
              </h3>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Felhasználónév
                  </label>
                  <p className="text-lg text-white mt-1">{user.username}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Email cím
                  </label>
                  <p className="text-lg text-white mt-1">
                    {user.email || "Nincs megadva"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Becenév / megszólítás
                  </label>
                  <p className="text-lg text-white mt-1">
                    {user.profileDetail?.firstName || "Nincs megadva"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Neme
                  </label>
                  <p className="text-lg text-white mt-1">
                    {user.profileDetail?.gender === "male"
                      ? "Férfi"
                      : user.profileDetail?.gender === "female"
                        ? "Nő"
                        : "Nincs megadva"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Kor
                  </label>
                  <p className="text-lg text-white mt-1">
                    {user.profileDetail?.age || "Nincs megadva"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Cél
                  </label>
                  <p className="text-lg text-white mt-1">
                    {user.profileDetail?.goal === "lose"
                      ? "Fogyás"
                      : user.profileDetail?.gender === "maintain"
                        ? "Súlytartás"
                        : user.profileDetail?.goal === "gain"
                          ? "Izomépítés"
                          : "Nincs megadva"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 2. TESTALKAT ÉS SÚLY */}
          {activeTab === "stats" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h3 className="text-xl font-bold text-white border-b border-gray-800 pb-4">
                Testsúly, Allergiák és Emésztési zavarok
              </h3>

              <div className="bg-[#12181f] p-6 rounded-2xl border border-gray-800">
                <p className="text-sm text-gray-400 mb-2">Jelenlegi testsúly</p>
                <div className="flex items-end gap-3 mb-6">
                  <span className="text-4xl font-black text-white">
                    {user.profileDetail?.weight || "--"}
                  </span>
                  <span className="text-gray-500 font-bold mb-1">kg</span>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-300">
                    Súly frissítése manuálisan
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      placeholder={
                        user.profileDetail?.weight?.toString() || "80"
                      }
                      className="flex-1 bg-[#1c252e] border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-[#22c55e] transition-all text-white"
                    />
                    <button className="bg-[#22c55e] text-[#12181f] font-bold px-6 py-3 rounded-xl hover:bg-[#1da850] transition-colors">
                      Mentés
                    </button>
                  </div>
                </div>
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-white border-b border-gray-800 pb-4 mb-4 flex items-center gap-2">
                    <Shield className="text-red-400" size={20} />
                    Saját allergiák és ételérzékenységek
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {user.profileDetail?.allergies &&
                    user.profileDetail.allergies.length > 0 ? (
                      user.profileDetail.allergies.map((allergy, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-full text-sm font-lemon uppercase tracking-wider"
                        >
                          {allergy}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">
                        Nincsenek megadott allergiák.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. BIZTONSÁG */}
          {activeTab === "security" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h3 className="text-xl font-bold text-white border-b border-gray-800 pb-4">
                Biztonság
              </h3>
              <p className="text-gray-400">Jelszó módosítás hamarosan...</p>
            </div>
          )}

          {/*4. CÉLJAIM*/}
          {activeTab === "goals" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h3 className="text-xl font-bold text-white border-b border-gray-800 pb-4">
                Céljaim
              </h3>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Cél
                </label>
                <p className="text-lg text-white mt-1">
                  {user.profileDetail?.goal === "lose"
                    ? "Fogyás"
                    : user.profileDetail?.gender === "maintain"
                      ? "Súlytartás"
                      : user.profileDetail?.goal === "gain"
                        ? "Izomépítés"
                        : "Nincs megadva"}
                </p>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Aktivitási szint
                </label>
                <p className="text-lg text-white mt-1">
                  {user.profileDetail?.activityLevel === 1.2
                    ? "Ülőmunka"
                    : user.profileDetail?.activityLevel === 1.375
                      ? "Mérsékelt"
                      : user.profileDetail?.activityLevel === 1.55
                        ? "Aktív"
                        : user.profileDetail?.activityLevel === 1.725
                          ? "Nagyon aktív"
                          : "Nincs megadva"}
                </p>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Cél kalória bevitel
                </label>
                <p className="text-lg text-white mt-1">
                  {user.profileDetail?.dailyCalorieGoal}
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Profile;
