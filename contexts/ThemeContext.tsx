import React from "react";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: "light" | "dark";
};

export function ThemeProvider({ children, defaultTheme = "light" }: ThemeProviderProps) {
  return <div className={defaultTheme === "dark" ? "dark" : ""}>{children}</div>;
}
