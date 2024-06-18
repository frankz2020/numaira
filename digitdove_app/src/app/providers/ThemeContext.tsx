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
  // highlightTextColor: string;
  [key: string]: string; // To support additional colors
}

interface ColorType {
  primaryColor: string;
  secondaryColor: string;
  thridaryColor: string;
  fourthColor: string;
  backgroundColor: string;
  themeColor: string;
  backgroundGray: string;
  white: string;
  textColor: string;
}

const colors: ColorType = Color as unknown as ColorType;
// Create the context with a default value
const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

// Define the provider component
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {

    const detectColorScheme = () => {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // Dark mode colors
        setTheme({
          primaryColor: colors.primaryColor as string, // Ensure these keys exist in your JSON
          secondaryColor: colors.secondaryColor,
          backgroundColor: colors.backgroundColor,
          thridaryColor: colors.thridaryColor,
          textColor: colors.textColor,
          fourthColor: colors.fourthColor,
          // Add other colors as needed
        });
      } else {
        // Light mode colors
        setTheme({
          primaryColor: colors.primaryColor, // Ensure these keys exist in your JSON
          secondaryColor: colors.secondaryColor,
          backgroundColor: colors.backgroundColor,
          thridaryColor: colors.thridaryColor,
          textColor: colors.textColor,
          fourthColor: colors.fourthColor,
          // Add other colors as needed
        });
      }
    };
    detectColorScheme();

    // Listen for changes in color scheme
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', detectColorScheme);
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', detectColorScheme);

    // Cleanup event listeners on unmount
    return () => {
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', detectColorScheme);
      window.matchMedia('(prefers-color-scheme: light)').removeEventListener('change', detectColorScheme);
    };
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
