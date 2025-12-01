"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2 text-sm">
      <button
        type="button"
        onClick={() => setLanguage("es")}
        className={
          language === "es"
            ? "font-semibold underline"
            : "opacity-60 hover:opacity-100"
        }
      >
        ES
      </button>
      <span>|</span>
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={
          language === "en"
            ? "font-semibold underline"
            : "opacity-60 hover:opacity-100"
        }
      >
        EN
      </button>
    </div>
  );
}
