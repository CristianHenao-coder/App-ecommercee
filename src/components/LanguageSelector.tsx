"use client";

import { useI18n } from "@/contexts/I18nContext";

export default function LanguageSelector() {
  const { language, setLanguage } = useI18n();

  return (
    <div className="relative">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as "es" | "en" | "pt")}
        className="bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="es">ES</option>
        <option value="en">EN</option>
        <option value="pt">PT</option>
      </select>
    </div>
  );
}

