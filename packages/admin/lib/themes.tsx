"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type ThemeName = "crimson" | "ocean" | "sunset";

export interface ThemeColors {
  name: string;
  displayName: string;
  description: string;
  // Primary gradient colors
  primary: string;
  secondary: string;
  accent: string;
  // Surface colors (HSL values)
  surfaceBase: string;
  surfaceCard: string;
  surfaceElevated: string;
  surfaceInset: string;
  surfaceOverlay: string;
  surfaceSidebar: string;
  surfaceHeader: string;
  // Text
  foreground: string;
  muted: string;
  // CSS gradient
  gradient: string;
  gradientButton: string;
  // Glow color for shadows
  glowColor: string;
}

export const themes: Record<ThemeName, ThemeColors> = {
  crimson: {
    name: "crimson",
    displayName: "Crimson Night",
    description: "Агрессивный красно-изумрудный градиент",
    primary: "hsl(0, 72%, 51%)",
    secondary: "hsl(160, 84%, 39%)",
    accent: "hsl(45, 93%, 47%)",
    surfaceBase: "hsl(240, 15%, 6%)",
    surfaceCard: "hsl(240, 10%, 13%)",
    surfaceElevated: "hsl(240, 10%, 16%)",
    surfaceInset: "hsl(240, 10%, 10%)",
    surfaceOverlay: "hsl(240, 12%, 14%)",
    surfaceSidebar: "hsl(240, 12%, 8%)",
    surfaceHeader: "hsl(240, 12%, 9%)",
    foreground: "hsl(0, 0%, 98%)",
    muted: "hsl(240, 5%, 55%)",
    gradient: "linear-gradient(135deg, hsl(0, 72%, 51%) 0%, hsl(350, 80%, 45%) 40%, hsl(160, 84%, 39%) 100%)",
    gradientButton: "linear-gradient(135deg, hsl(0, 72%, 51%) 0%, hsl(350, 80%, 50%) 50%, hsl(160, 84%, 39%) 100%)",
    glowColor: "hsl(0, 72%, 51%)",
  },
  ocean: {
    name: "ocean",
    displayName: "Ocean Depths",
    description: "Глубокий синий с бирюзовыми акцентами",
    primary: "hsl(210, 100%, 50%)",
    secondary: "hsl(180, 100%, 40%)",
    accent: "hsl(280, 80%, 60%)",
    surfaceBase: "hsl(220, 25%, 6%)",
    surfaceCard: "hsl(220, 20%, 12%)",
    surfaceElevated: "hsl(220, 18%, 16%)",
    surfaceInset: "hsl(220, 22%, 9%)",
    surfaceOverlay: "hsl(220, 20%, 14%)",
    surfaceSidebar: "hsl(220, 25%, 7%)",
    surfaceHeader: "hsl(220, 22%, 8%)",
    foreground: "hsl(200, 20%, 98%)",
    muted: "hsl(210, 15%, 55%)",
    gradient: "linear-gradient(135deg, hsl(210, 100%, 50%) 0%, hsl(220, 90%, 45%) 40%, hsl(180, 100%, 40%) 100%)",
    gradientButton: "linear-gradient(135deg, hsl(210, 100%, 50%) 0%, hsl(195, 95%, 45%) 50%, hsl(180, 100%, 40%) 100%)",
    glowColor: "hsl(210, 100%, 50%)",
  },
  sunset: {
    name: "sunset",
    displayName: "Sunset Glow",
    description: "Тёплый закатный градиент",
    primary: "hsl(25, 95%, 53%)",
    secondary: "hsl(330, 80%, 55%)",
    accent: "hsl(50, 100%, 50%)",
    surfaceBase: "hsl(15, 20%, 6%)",
    surfaceCard: "hsl(15, 15%, 12%)",
    surfaceElevated: "hsl(15, 12%, 16%)",
    surfaceInset: "hsl(15, 18%, 9%)",
    surfaceOverlay: "hsl(15, 15%, 14%)",
    surfaceSidebar: "hsl(15, 20%, 7%)",
    surfaceHeader: "hsl(15, 18%, 8%)",
    foreground: "hsl(30, 20%, 98%)",
    muted: "hsl(20, 10%, 55%)",
    gradient: "linear-gradient(135deg, hsl(25, 95%, 53%) 0%, hsl(350, 85%, 50%) 40%, hsl(330, 80%, 55%) 100%)",
    gradientButton: "linear-gradient(135deg, hsl(25, 95%, 53%) 0%, hsl(15, 90%, 50%) 50%, hsl(330, 80%, 55%) 100%)",
    glowColor: "hsl(25, 95%, 53%)",
  },
};

interface ThemeContextType {
  theme: ThemeName;
  themeColors: ThemeColors;
  setTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "voicekeeper_theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>("crimson");

  useEffect(() => {
    // Load saved theme
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeName | null;
    if (saved && themes[saved]) {
      setThemeState(saved);
    }
  }, []);

  const setTheme = (newTheme: ThemeName) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, themeColors: themes[theme], setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

// CSS variable injector component
export function ThemeStyles() {
  const { themeColors } = useTheme();

  return (
    <style jsx global>{`
      :root {
        --theme-primary: ${themeColors.primary};
        --theme-secondary: ${themeColors.secondary};
        --theme-accent: ${themeColors.accent};
        --theme-surface-base: ${themeColors.surfaceBase};
        --theme-surface-card: ${themeColors.surfaceCard};
        --theme-surface-elevated: ${themeColors.surfaceElevated};
        --theme-surface-inset: ${themeColors.surfaceInset};
        --theme-surface-overlay: ${themeColors.surfaceOverlay};
        --theme-surface-sidebar: ${themeColors.surfaceSidebar};
        --theme-surface-header: ${themeColors.surfaceHeader};
        --theme-foreground: ${themeColors.foreground};
        --theme-muted: ${themeColors.muted};
        --theme-gradient: ${themeColors.gradient};
        --theme-gradient-button: ${themeColors.gradientButton};
        --theme-glow: ${themeColors.glowColor};
      }
    `}</style>
  );
}

