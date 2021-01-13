import * as Localization from "expo-localization";
import i18n from "i18n-js";
import translations from "./constants/translations";

export type SupportedLocale = "en" | "fr";
export const SUPPORTED_LOCALES: SupportedLocale[] = ["en", "fr"];

export function getDefaultLocale(): SupportedLocale {
    const loc = Localization.locale.substr(0, 2);
    return loc === "fr" ? "fr" : "en";
}

export default function configureLocalization(): void {
    // Set the key-value pairs for the supported languages.
    i18n.translations = translations;

    // Set the locale on startup
    i18n.locale = getDefaultLocale();

    // When a value is missing from a language, fallback to another language with the key present.
    i18n.fallbacks = true;
}
