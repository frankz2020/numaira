"use client"
import React, { createContext, useContext, useState, ReactNode } from 'react';
import Color from '../theme/Color.json';
interface GlobalContextProps {
  // Define the shape of your global state here
  loggedIn: Boolean
  setLoggedIn: (loggedIn: Boolean) => void
  user: string | null;
  setUser: (user: string | null) => void;
}



const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState<Boolean>(false)
  return (
    <GlobalContext.Provider value={{ user, setUser, loggedIn, setLoggedIn }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  }
  return context;
};
