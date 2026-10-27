"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { SupportedLocale, translations, Translations } from "@/lib/translations";

interface AppContextType {
  locale: SupportedLocale;
  setLocale: (l: SupportedLocale) => void;
  t: Translations;
  theme: "light" | "dark";
  toggleTheme: () => void;
  notificationsCount: number;
  refreshNotificationsCount: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<SupportedLocale>("en");
  const [theme, setThemeState] = useState<"light" | "dark">("light");
  const [notificationsCount, setNotificationsCount] = useState<number>(2);

  // Initialize from localStorage safely
  useEffect(() => {
    try {
      const savedLocale = localStorage.getItem("mediconnect_locale") as SupportedLocale;
      if (savedLocale === "en" || savedLocale === "hi") {
        setLocaleState(savedLocale);
      }

      const savedTheme = localStorage.getItem("mediconnect_theme") as "light" | "dark";
      if (savedTheme === "dark" || savedTheme === "light") {
        setThemeState(savedTheme);
        if (savedTheme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      } else {
        // System preference
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (prefersDark) {
          setThemeState("dark");
          document.documentElement.classList.add("dark");
        }
      }
    } catch {
      // ignore SSR or storage exceptions
    }
  }, []);

  const setLocale = (newLocale: SupportedLocale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem("mediconnect_locale", newLocale);
      document.documentElement.setAttribute("lang", newLocale);
    } catch {
      // ignore
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setThemeState(nextTheme);
    try {
      localStorage.setItem("mediconnect_theme", nextTheme);
      if (nextTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } catch {
      // ignore
    }
  };

  const refreshNotificationsCount = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        const unread = data.filter((n: { read: boolean }) => !n.read).length;
        setNotificationsCount(unread);
      }
    } catch {
      // fallback
    }
  };

  useEffect(() => {
    refreshNotificationsCount();
  }, []);

  return (
    <AppContext.Provider
      value={{
        locale,
        setLocale,
        t: translations[locale],
        theme,
        toggleTheme,
        notificationsCount,
        refreshNotificationsCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
