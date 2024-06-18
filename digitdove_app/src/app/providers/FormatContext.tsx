"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import Space from "../theme/Space.json";
interface FormatContextProps {
  format: Format;
}

interface Format {
  maxSideNavbarWidth: string;
  maxTopNavbarHeight: string;
  minTopNavbarHeight: string;
  minSideNavbarWidth: string;
  sideNavbarWidth: string;
  topNavbarHeight: string;
  roundsm: string;
  roundmd: string;
  roundlg: string;
}

// Create the context with a default value
const FormatContext = createContext<FormatContextProps | undefined>(undefined);

// Define the provider component
export const FormatProvider = ({ children }: { children: ReactNode }) => {
  const [format, setFormat] = useState<Format | null>(null);

  useEffect(() => {
    // Fetch the theme.json file
    setFormat(Space);
  }, []);

  if (!format) {
    return null; // or a loading indicator
  }

  return (
    <FormatContext.Provider value={{ format }}>
      {children}
    </FormatContext.Provider>
  );
};

// Custom hook to use the ThemeContext
export const useFormat = () => {
  const context = useContext(FormatContext);
  if (!context) {
    throw new Error("useTheme must be used within a FormatProvider");
  }
  return context;
};
