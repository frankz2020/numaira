"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import Color from "../theme/Color.json";
interface ThemeContextProps {
  theme: Theme;
}

interface Theme {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
}

// Create the context with a default value
const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

// Define the provider component
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    // Fetch the theme.json file
    setTheme(Color);
  }, []);

  // set base theme
  if (theme) {
    document.documentElement.style.setProperty(
      "--primary-color",
      theme.primaryColor
    );
    document.documentElement.style.setProperty(
      "--secondary-color",
      theme.secondaryColor
    );
    document.documentElement.style.setProperty(
      "--background-color",
      theme.backgroundColor
    );
    document.documentElement.style.setProperty("--text-color", theme.textColor);
  }

  if (!theme) {
    return null; // or a loading indicator
  }

  return (
    <ThemeContext.Provider value={{ theme }}>{children}</ThemeContext.Provider>
  );
};

// Custom hook to use the ThemeContext
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
