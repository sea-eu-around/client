import {ThemeKey} from "../../types";
import {SupportedLocale} from "../../localization";
import i18n from "i18n-js";
import {CookiesPreferences} from "../../model/user-settings";
import {AppThunk} from "../types";

export enum SETTINGS_ACTION_TYPES {
    SET_THEME = "SETTINGS/SET_THEME",
    TOGGLE_THEME = "SETTINGS/TOGGLE_THEME",
    SET_LOCALE = "SETTINGS/SET_LOCALE",
    LOAD_COOKIES_PREFERENCES = "SETTINGS/LOAD_COOKIES_PREFERENCES",
    SAVE_COOKIES_PREFERENCES = "SETTINGS/SAVE_COOKIES_PREFERENCES",
    LOAD_VERSION_INFO = "SETTINGS/LOAD_VERSION_INFO",
}

export type SetThemeAction = {
    type: string;
    theme: ThemeKey;
    fromCache?: boolean;
};

export type ToggleThemeAction = {
    type: string;
};

export type SetLocaleAction = {
    type: string;
    locale: SupportedLocale;
    fromCache?: boolean;
};

export type LoadCookiesPreferencesAction = {
    type: string;
    preferences: CookiesPreferences;
    consentDate: Date;
};

export type SaveCookiesPreferencesAction = {
    type: string;
    preferences: CookiesPreferences;
};

export type LoadVersionInfoAction = {
    type: string;
    version: string | null;
};

export type SettingsAction = SetThemeAction | SetLocaleAction | LoadCookiesPreferencesAction | LoadVersionInfoAction;

export const setTheme = (theme: ThemeKey, fromCache?: boolean): SetThemeAction =>
    ({type: SETTINGS_ACTION_TYPES.SET_THEME, theme, fromCache} as SetThemeAction);

export const toggleTheme = (): ToggleThemeAction => ({type: SETTINGS_ACTION_TYPES.TOGGLE_THEME} as ToggleThemeAction);

export const setLocale = (locale: SupportedLocale, fromCache?: boolean): SetLocaleAction => {
    i18n.locale = locale;
    return {type: SETTINGS_ACTION_TYPES.SET_LOCALE, locale, fromCache} as SetLocaleAction;
};

export const loadCookiesPreferences = (
    preferences: CookiesPreferences,
    consentDate: Date,
): LoadCookiesPreferencesAction => ({
    type: SETTINGS_ACTION_TYPES.LOAD_COOKIES_PREFERENCES,
    preferences,
    consentDate,
});

export const saveCookiesPreferences = (preferences: CookiesPreferences): SaveCookiesPreferencesAction => ({
    type: SETTINGS_ACTION_TYPES.SAVE_COOKIES_PREFERENCES,
    preferences,
});

export const loadVersionInfo = (version: string | null): LoadVersionInfoAction => ({
    type: SETTINGS_ACTION_TYPES.LOAD_VERSION_INFO,
    version,
});

export const acceptAllCookies = (): AppThunk => async (dispatch) => {
    dispatch(saveCookiesPreferences({auth: true, cache: true, settings: true}));
};
