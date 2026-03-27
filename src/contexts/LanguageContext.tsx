"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import es from "@/helpers/i18n/es.json";
import en from "@/helpers/i18n/en.json";

export type Language = "es" | "en";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

type Dictionary = Record<string, unknown>;
const dictionaries: Record<Language, Dictionary> = {
  es: es as Dictionary,
  en: en as Dictionary,
};

// Lee claves anidadas: "login.title", "collection.categories.tshirts"
function getNestedValue(obj: Dictionary, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as Dictionary)) {
      return (acc as Dictionary)[key];
    }
    return undefined;
  }, obj);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("es");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem("language") as Language | null;
    if (saved === "es" || saved === "en") {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("language", lang);
    }
  };

  const t = (key: string): string => {
    const dict = dictionaries[language];
    const value = getNestedValue(dict, key);
    return typeof value === "string" ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx)
    throw new Error("useLanguage debe usarse dentro de LanguageProvider");
  return ctx;
}
