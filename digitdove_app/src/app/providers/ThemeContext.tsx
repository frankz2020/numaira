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
  primary: string;
  neutral: string;
  neutral100: string;
  neutral200: string;
  neutral300: string;
  neutral700: string;
  neutral1000: string;
  brand: string;
  brand200: string;
  brand500: string;
  brand800: string;
  brand1000: string;
  // highlightTextColor: string;
  [key: string]: string; // To support additional colors
}

interface ColorType {
  primary: string;
  neutral: string;
  neutral100: string;
  neutral200: string;
  neutral700: string;
  neutral1000: string;
  primary_dark: string;
  neutral_dark: string;
  neutral100_dark: string;
  neutral200_dark: string;
  neutral700_dark: string;
  neutral1000_dark: string;
  [key: string]: string;
}

const colors: ColorType = Color as unknown as ColorType;
// Create the context with a default value
const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

// Define the provider component
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const detectColorScheme = () => {
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        // Dark mode colors
        setTheme({
          primary: colors.primary,
          neutral100: colors.neutral100,
          neutral: colors.neutral,
          neutral700: colors.neutral700,
          neutral1000: colors.neutral1000,
          neutral200: colors.neutral200,
          neutral300: colors.neutral300, // Add the missing property

          brand: colors.brand,
          brand200: colors.brand200,
          brand500: colors.brand500,
          brand800: colors.brand800,
          brand1000: colors.brand1000,
          // Add other colors as needed
        });
      } else {
        // Light mode colors
        setTheme({
          primary: colors.primary,
          neutral100: colors.neutral100,
          neutral: colors.neutral,
          neutral700: colors.neutral700,
          neutral1000: colors.neutral1000,
          neutral200: colors.neutral200,
          neutral300: colors.neutral300, // Add the missing property
          brand: colors.brand,
          brand200: colors.brand200,
          brand500: colors.brand500,
          brand800: colors.brand800,
          brand1000: colors.brand1000,
          // Add other colors as needed
        });
      }
    };
    detectColorScheme();

    // Listen for changes in color scheme
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", detectColorScheme);
    window
      .matchMedia("(prefers-color-scheme: light)")
      .addEventListener("change", detectColorScheme);

    // Cleanup event listeners on unmount
    return () => {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", detectColorScheme);
      window
        .matchMedia("(prefers-color-scheme: light)")
        .removeEventListener("change", detectColorScheme);
    };
  }, []);

  // set base theme
  if (theme) {
    document.documentElement.style.setProperty(
      "--primary-color",
      theme.primary
    );
    document.documentElement.style.setProperty(
      "--secondary-color",
      theme.neutral100
    );
    document.documentElement.style.setProperty(
      "--background-color",
      theme.neutral
    );
    document.documentElement.style.setProperty(
      "--text-color",
      theme.neutral1000
    );
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
