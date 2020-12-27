import {SupportedLocale} from "../localization";
import {ThemeKey} from "../types";

export type CookiesPreferences = {
    auth: boolean;
    cache: boolean;
    settings: boolean;
};

export const COOKIES_PREFERENCES_KEYS = ["auth", "cache", "settings"];

export type UserSettings = {
    theme: ThemeKey;
    locale: SupportedLocale;
    cookies: CookiesPreferences;
    cookieConsentDate: Date | null;
};
