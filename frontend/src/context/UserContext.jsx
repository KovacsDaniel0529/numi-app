import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ez a függvény bármikor újratölthető a backendről
  const refreshUser = async () => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (!savedUser || !savedUser.username) {
      setLoading(false);
      return;
    }

    try {
      // Itt a te meglévő /stats/végpontodat használjuk a frissítéshez!
      const response = await fetch(`http://localhost:8080/api/auth/stats/${savedUser.username}`);
      if (response.ok) {
        const freshData = await response.json();
        setUser(freshData);
        // Frissítjük a biztonsági másolatot is
        localStorage.setItem('user', JSON.stringify(freshData));
      }
    } catch (err) {
      console.error("Hiba a felhasználó frissítésekor:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};