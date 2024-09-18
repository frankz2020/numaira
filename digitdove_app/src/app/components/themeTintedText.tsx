"use client";
import React from "react";
import { useTheme } from "../providers/ThemeContext";

type ThemeTintedTextProps = {
  text: string;
  themeColor: string;
};

const ThemeTintedText = ({ text, themeColor }: ThemeTintedTextProps) => {
  const { theme } = useTheme();
  return (
    <div
      className="px-2 py-1 flex items-center justify-center"
      style={{
        backgroundColor: themeColor,
        color: theme.neutral,
        borderRadius: "4px",
      }}
    >
      {text}
    </div>
  );
};

export default ThemeTintedText;
