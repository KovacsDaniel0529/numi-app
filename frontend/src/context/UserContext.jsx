import React, { createContext, useState, useEffect } from "react";
import { getUser } from "../api/authApi";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const refreshUser = async () => {
    let savedUser = null;
    try {
      savedUser = JSON.parse(localStorage.getItem("user"));
    } catch {
      localStorage.removeItem("user");
    }

    if (!savedUser?.username) {
      setLoading(false);
      return;
    }

    try {
      const freshData = await getUser(savedUser.username);
      setUser(freshData);
      localStorage.setItem("user", JSON.stringify(freshData));
    } catch (err) {
      if (err.status === 404) logout();
      else console.error("Hiba a felhasználó frissítésekor:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <UserContext.Provider
      value={{ user, setUser, refreshUser, logout, loading }}
    >
      {children}
    </UserContext.Provider>
  );
};
