
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  isDarkMode: false,
  toggleDarkMode: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function useTheme() {
  return useContext(ThemeProviderContext);
}

export default function ThemeProvider({
  children,
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check for stored preference
    const storedTheme = localStorage.getItem("theme") as Theme | null;
    if (storedTheme) {
      return storedTheme;
    }
    // Otherwise use system preference
    return "system";
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return theme === "dark";
  });

  // Full theme application
  useEffect(() => {
    const root = window.document.documentElement;
    
    root.classList.remove("light", "dark");
    
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
      setIsDarkMode(systemTheme === "dark");
      document.body.style.colorScheme = systemTheme;
    } else {
      root.classList.add(theme);
      setIsDarkMode(theme === "dark");
      document.body.style.colorScheme = theme;
    }
    
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Listen for system preference changes
  useEffect(() => {
    if (theme !== "system") return;
    
    function handleSystemThemeChange(event: MediaQueryListEvent) {
      setIsDarkMode(event.matches);
      document.documentElement.classList.toggle("dark", event.matches);
      document.documentElement.classList.toggle("light", !event.matches);
      document.body.style.colorScheme = event.matches ? 'dark' : 'light';
    }
    
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", handleSystemThemeChange);
    
    return () => mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, [theme]);

  const toggleDarkMode = () => {
    setTheme(isDarkMode ? "light" : "dark");
  };

  const value = {
    theme,
    setTheme,
    isDarkMode,
    toggleDarkMode,
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
