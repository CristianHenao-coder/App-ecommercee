import { Product } from "@/interfaces/interfaces";
import { Language } from "@/contexts/LanguageContext";

/**
 * Get localized product name
 * Falls back to legacy 'name' field if multilingual fields are not available
 */
export function getProductName(product: Product, language: Language): string {
  if (language === "en" && product.name_en) {
    return product.name_en;
  }
  if (language === "es" && product.name_es) {
    return product.name_es;
  }
  // Fallback to legacy field or first available
  return product.name || product.name_es || product.name_en || "";
}

/**
 * Get localized product description
 * Falls back to legacy 'descripcion' field if multilingual fields are not available
 */
export function getProductDescription(product: Product, language: Language): string {
  if (language === "en" && product.descripcion_en) {
    return product.descripcion_en;
  }
  if (language === "es" && product.descripcion_es) {
    return product.descripcion_es;
  }
  // Fallback to legacy field or first available
  return product.descripcion || product.descripcion_es || product.descripcion_en || "";
}

