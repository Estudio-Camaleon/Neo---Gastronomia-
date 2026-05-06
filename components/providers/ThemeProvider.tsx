"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

// 1. Creamos el contexto para NEO con tipos explícitos para evitar warnings
interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Inicialización perezosa: El estado nace directamente con el valor correcto
  const [theme, setThemeState] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("neo-theme") || "light";
    }
    return "light";
  });

  // Este efecto solo se encarga de sincronizar el DOM externo (el HTML) cuando cambia el tema
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const setTheme = (newTheme: string) => {
    setThemeState(newTheme);
    localStorage.setItem("neo-theme", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook personalizado para usar en la aplicación
export const useTheme = () => useContext(ThemeContext);
