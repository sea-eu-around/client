import {ThemeKey} from "../../types";
import {SupportedLocale} from "../../localization";
import i18n from "i18n-js";

export enum SETTINGS_ACTION_TYPES {
    SET_THEME = "SETTINGS/SET_THEME",
    TOGGLE_THEME = "SETTINGS/TOGGLE_THEME",
    SET_LOCALE = "SETTINGS/SET_LOCALE",
}

export type SetThemeAction = {
    type: string;
    theme: ThemeKey;
};

export type ToggleThemeAction = {
    type: string;
};

export type SetLocaleAction = {
    type: string;
    locale: SupportedLocale;
};

export type SettingsAction = SetThemeAction | SetLocaleAction;

export const setTheme = (theme: ThemeKey): SetThemeAction =>
    ({type: SETTINGS_ACTION_TYPES.SET_THEME, theme} as SetThemeAction);

export const toggleTheme = (): ToggleThemeAction => ({type: SETTINGS_ACTION_TYPES.TOGGLE_THEME} as ToggleThemeAction);

export const setLocale = (locale: SupportedLocale): SetLocaleAction => {
    i18n.locale = locale;
    return {type: SETTINGS_ACTION_TYPES.SET_LOCALE, locale} as SetLocaleAction;
};
