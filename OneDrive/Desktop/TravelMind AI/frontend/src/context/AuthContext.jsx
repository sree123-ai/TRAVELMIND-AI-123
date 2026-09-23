import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('travelmind_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [tripData, setTripData] = useState(() => {
    try {
      const stored = localStorage.getItem('travelmind_trip');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('travelmind_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('travelmind_user');
  };

  const saveTripData = (data) => {
    setTripData(data);
    localStorage.setItem('travelmind_trip', JSON.stringify(data));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, tripData, saveTripData, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
