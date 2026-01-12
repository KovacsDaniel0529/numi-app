import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Napló', href: '/diary' },
    { name: 'Naptár', href: '/calendar' },
    { name: 'Receptek', href: '/recipes' },
    { name: 'Profil', href: '/profile' },
  ];

  return (
    <nav className="bg-[#1e1e1e]/80 backdrop-blur-xl sticky top-0 z-50 
                    border-b border-white/[0.05] shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
      {/* A fenti osztályok titka:
        - border-white/[0.05]: Hajszálvékony, 5%-os átlátszóságú fehér vonal.
        - backdrop-blur-xl: Erős üveghatás.
        - shadow: Nagyon lágy, szétterülő árnyék.
      */}
      
      <div className="max-w-7xl mx-auto px-8 h-20 flex justify-between items-center">
        
        {/* BAL OLDAL: Csak a Logó */}
        <Link to="/diary" className="group flex items-center focus:outline-none shrink-0">
          <img 
            src="/numi.png" 
            alt="numi logo" 
            className="h-12 w-auto object-contain group-hover:scale-110 transition-transform duration-500 ease-in-out" 
          />
        </Link>

        {/* JOBB OLDAL: Menüpontok */}
        <div className="hidden md:flex items-center gap-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`relative px-4 py-2 text-lg font-lemon transition-all duration-300 group ${
                  isActive ? 'text-[#68D391]' : 'text-slate-400 hover:text-white'
                }`}
              >
                {item.name}
                {/* Elegáns aláhúzás animáció */}
                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] bg-[#68D391] transition-all duration-500 
                  ${isActive ? 'w-1/2 opacity-100' : 'w-0 opacity-0 group-hover:w-1/2 group-hover:opacity-100'}`} 
                />
              </Link>
            );
          })}
        </div>

        {/* MOBIL GOMB */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="text-white p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* MOBIL MENÜ */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-screen border-t border-white/5 bg-[#1a1f26]' : 'max-h-0'}`}>
        <div className="flex flex-col p-6 space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setIsOpen(false)}
              className={`text-xl font-lemon text-center py-3 rounded-xl ${
                location.pathname === item.href ? 'text-[#68D391] bg-white/5' : 'text-white'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;