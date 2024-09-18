"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import Color from "../theme/Color.json";
interface GlobalContextProps {
  // Define the shape of your global state here
  loggedIn: Boolean;
  setLoggedIn: (loggedIn: Boolean) => void;
  user: string | null;
  setUser: (user: string | null) => void;
  backendUrl: string;
  syncSpaceTargetFile: any;
  setSyncSpaceTargetFile: (syncSpaceTargetFile: any) => void;
  setSyncSpaceOutputFile: (syncSpaceOutputFile: any) => void;
  syncSpaceOutputFile: any;
}

const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState<Boolean>(false);
  const [syncSpaceTargetFile, setSyncSpaceTargetFile] = useState<any>(null);
  const [syncSpaceTargetHTML, setSyncSpaceTargetHTML] = useState<any>(null);
  const [syncSpaceOutputFile, setSyncSpaceOutputFile] = useState<any>(null);
  
  const backendUrl = "http://127.0.0.1:8000/";

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch(`${backendUrl}/user/current_user`, {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.username); // Adjust based on your user object structure
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
      setLoggedIn(false);
      setUser(null);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        user,
        setUser,
        loggedIn,
        setLoggedIn,
        backendUrl,
        syncSpaceTargetFile,
        setSyncSpaceTargetFile,
        setSyncSpaceOutputFile,
        syncSpaceOutputFile,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};
