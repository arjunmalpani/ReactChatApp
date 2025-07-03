// src/contexts/ThemeProvider.jsx
import { useEffect } from "react";
import { useThemeStore } from "../store/useThemeStore";

export default function ThemeProvider({ children }) {
  const { theme } = useThemeStore();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return <>{children}</>;
}
