import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Scale, Shield, LogOut, ChevronRight, ChartSpline } from "lucide-react";
import { UserContext } from "../context/UserContext";
import GeneralTab from "../components/profile/GeneralTab";
import BodyTab from "../components/profile/BodyTab";
import GoalsTab from "../components/profile/GoalsTab";
import SecurityTab from "../components/profile/SecurityTab";

// A Profil oldal csak a keretet és a fülek váltását adja,
// a tartalom a components/profile mappában lévő külön fülekben van.
const MENU_ITEMS = [
  { id: "general", label: "Fiók adatai", icon: <User size={20} /> },
  { id: "stats", label: "Testalkat & Súly", icon: <Scale size={20} /> },
  { id: "goals", label: "Céljaim", icon: <ChartSpline size={20} /> },
  { id: "security", label: "Biztonság", icon: <Shield size={20} /> },
];

const Profile = () => {
  const { user, refreshUser, loading, logout } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("general");
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#12181f] flex items-center justify-center text-white">
        Betöltés...
      </div>
    );
  }
  if (!user) {
    return (
      <div className="min-h-screen bg-[#12181f] flex items-center justify-center text-white">
        Kérlek jelentkezz be!
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#12181f] text-gray-200 p-4 md:p-8">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
        {/* BAL OLDAL: MENÜ */}
        <aside className="w-full md:w-64 space-y-2">
          <h2 className="text-2xl font-bold mb-6 px-2 text-[#22c55e]">Beállítások</h2>
          <nav>
            {MENU_ITEMS.map((item) => (
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
                  className={activeTab === item.id ? "opacity-100" : "opacity-0"}
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

        {/* JOBB OLDAL: AZ AKTÍV FÜL */}
        <main className="flex-1 bg-[#1c252e] rounded-3xl p-6 md:p-10 border border-gray-800 shadow-2xl">
          {activeTab === "general" && <GeneralTab user={user} refreshUser={refreshUser} />}
          {activeTab === "stats" && <BodyTab user={user} refreshUser={refreshUser} />}
          {activeTab === "goals" && <GoalsTab user={user} refreshUser={refreshUser} />}
          {activeTab === "security" && <SecurityTab user={user} onAccountDeleted={handleLogout} />}
        </main>
      </div>
    </div>
  );
};

export default Profile;