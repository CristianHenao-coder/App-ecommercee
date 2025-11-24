"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "es" | "en" | "pt";

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const translations: Record<Language, any> = {
  es: {},
  en: {},
  pt: {},
};

// Cargar traducciones
const loadTranslations = async (lang: Language) => {
  try {
    const module = await import(`@/i18n/${lang}.json`);
    return module.default;
  } catch (error) {
    console.error(`Error loading translations for ${lang}:`, error);
    return {};
  }
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("es");
  const [translationsData, setTranslationsData] = useState<any>({});

  useEffect(() => {
    loadTranslations(language).then(setTranslationsData);
    const stored = localStorage.getItem("lookgod_language") as Language;
    if (stored && ["es", "en", "pt"].includes(stored)) {
      setLanguageState(stored);
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("lookgod_language", lang);
    loadTranslations(lang).then(setTranslationsData);
  };

  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = translationsData;
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) return key;
    }
    return typeof value === "string" ? value : key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}

