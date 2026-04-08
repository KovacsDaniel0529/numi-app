import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Scale, Shield, LogOut, Trash2, ChevronRight,  } from 'lucide-react'; // Ikonokhoz

const Profile = () => {
  const [activeTab, setActiveTab] = useState('general');

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  // Menüpontok definíciója
  const menuItems = [
    { id: 'general', label: 'Fiók adatai', icon: <User size={20} /> },
    { id: 'stats', label: 'Testalkat & Súly', icon: <Scale size={20} /> },
    { id: 'security', label: 'Biztonság', icon: <Shield size={20} /> },
  ];

  const navigate = useNavigate(); // Ez kell az átirányításhoz

  const handleLogout = () => {
    // 1. Töröljük a 'user' kulcsot a localStorage-ból
    localStorage.removeItem('user');
    
    // 2. Opcionális: Ha használsz sessionStorage-t vagy tokeneket, azokat is itt töröld
    // localStorage.clear(); // Ez mindent töröl, ha biztosra akarsz menni

    // 3. Átirányítjuk a felhasználót a Login oldalra
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#12181f] text-gray-200 p-4 md:p-8">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* BAL OLDAL: MENÜ (SIDEBAR) */}
        <aside className="w-full md:w-64 space-y-2">
          <h2 className="text-2xl font-bold text-white mb-6 px-2 text-[#22c55e]">Beállítások</h2>
          <nav>
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                  activeTab === item.id 
                    ? 'bg-[#1c252e] text-[#22c55e] border-l-4 border-[#22c55e]' 
                    : 'hover:bg-[#1c252e]/50 text-gray-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </div>
                <ChevronRight size={16} opacity={activeTab === item.id ? 1 : 0} />
              </button>
            ))}
          </nav>

          <hr className="border-gray-800 my-6" />

          {/* KIJELENTKEZÉS GOMB */}
          <button onClick={handleLogout} className="w-full flex items-center gap-3 p-4 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-xl transition-all">
            <LogOut size={20} />
            <span className="font-medium">Kijelentkezés</span>
          </button>
        </aside>

        {/* JOBB OLDAL: TARTALOM */}
        <main className="flex-1 bg-[#1c252e] rounded-3xl p-6 md:p-10 border border-gray-800 shadow-2xl">
          
          {/* 1. ÁLTALÁNOS ADATOK */}
          {activeTab === 'general' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h3 className="text-xl font-bold text-white border-b border-gray-800 pb-4">Fiók részletei</h3>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Felhasználónév</label>
                  <p className="text-lg text-white mt-1">NumiUser_01</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email cím</label>
                  <p className="text-lg text-white mt-1">user@example.com</p>
                </div>
              </div>
            </div>
          )}

          {/* 2. TESTALKAT ÉS SÚLY */}
          {activeTab === 'stats' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h3 className="text-xl font-bold text-white border-b border-gray-800 pb-4">Testalkat & Célok</h3>
              
              <div className="bg-[#12181f] p-6 rounded-2xl border border-gray-800">
                <p className="text-sm text-gray-400 mb-2">Jelenlegi testsúly</p>
                <div className="flex items-end gap-3 mb-6">
                  <span className="text-4xl font-black text-white"></span>
                  <span className="text-gray-500 font-bold mb-1">kg</span>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-300">Súly frissítése manuálisan</label>
                  <div className="flex gap-3">
                    <input 
                      type="number" 
                      placeholder="84.2"
                      className="flex-1 bg-[#1c252e] border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-[#22c55e] transition-all"
                    />
                    <button className="bg-[#22c55e] text-[#12181f] font-bold px-6 py-3 rounded-xl hover:bg-[#1da850] transition-colors">
                      Mentés
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 italic leading-relaxed">
                    A súlyod frissítése után a rendszer automatikusan újraszámolja a napi kalória-szükségletedet a Dashboard-on.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 3. BIZTONSÁG */}
          {activeTab === 'security' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h3 className="text-xl font-bold text-white border-b border-gray-800 pb-4">Biztonsági beállítások</h3>
              
              <div className="space-y-4">
                <button className="w-full text-left p-4 rounded-xl border border-gray-800 hover:border-gray-700 hover:bg-[#12181f] transition-all flex justify-between items-center group">
                  <div>
                    <p className="font-bold text-white">Jelszó megváltoztatása</p>
                    <p className="text-xs text-gray-500">Utoljára 3 hónapja frissítve</p>
                  </div>
                  <ChevronRight size={18} className="text-gray-600 group-hover:text-[#22c55e]" />
                </button>

                <div className="mt-12 pt-8 border-t border-gray-800">
                  <h4 className="text-red-500 font-bold mb-2 flex items-center gap-2">
                    <Trash2 size={18} /> Veszélyzóna
                  </h4>
                  <p className="text-sm text-gray-500 mb-4">
                    A fiók törlése végleges, minden mentett adatod (naplók, receptek) elveszik.
                  </p>
                  <button className="text-red-500 text-sm font-bold hover:underline">
                    Felhasználói fiók végleges törlése
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default Profile;