import { useEffect, useState } from "react";
import { ThemeContext } from "./ThemeContext";
import type { ThemeMode } from "./ThemeContext";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Load persisted preference, default to "system"
  const [mode, setModeState] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem("theme-mode");
    return (stored as ThemeMode) ?? "system";
  });

  // Resolve "system" to the actual OS preference
  const getSystemTheme = (): "light" | "dark" =>
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

  const resolved: "light" | "dark" =
    mode === "system" ? getSystemTheme() : mode;

  // Apply theme class to <html> and persist preference
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(resolved);
    localStorage.setItem("theme-mode", mode);
  }, [mode, resolved]);

  // Re-resolve when OS preference changes (only matters when mode === "system")
  useEffect(() => {
    if (mode !== "system") return;

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(getSystemTheme());
    };

    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [mode]);

  const setMode = (newMode: ThemeMode) => setModeState(newMode);

  return (
    <ThemeContext.Provider value={{ mode, resolved, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}