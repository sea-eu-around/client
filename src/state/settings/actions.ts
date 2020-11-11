import {SetLocaleAction, SetThemeAction, SETTINGS_ACTION_TYPES, ToggleThemeAction} from "../types";
import {ThemeKey} from "../../types";
import {SupportedLocale} from "../../localization";
import i18n from "i18n-js";

export const setTheme = (theme: ThemeKey): SetThemeAction =>
    ({type: SETTINGS_ACTION_TYPES.SET_THEME, theme} as SetThemeAction);

export const toggleTheme = (): ToggleThemeAction => ({type: SETTINGS_ACTION_TYPES.TOGGLE_THEME} as ToggleThemeAction);

export const setLocale = (locale: SupportedLocale): SetLocaleAction => {
    i18n.locale = locale;
    return {type: SETTINGS_ACTION_TYPES.SET_THEME, locale} as SetLocaleAction;
};
