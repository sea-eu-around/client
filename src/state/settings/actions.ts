import {SetLocaleAction, SetThemeAction, SETTINGS_ACTION_TYPES} from "../types";
import {Theme} from "../../types";
import {SupportedLocale} from "../../localization";
import i18n from "i18n-js";

export const setTheme = (theme: Theme): SetThemeAction =>
    ({type: SETTINGS_ACTION_TYPES.SET_THEME, theme} as SetThemeAction);

export const setLocale = (locale: SupportedLocale): SetLocaleAction => {
    i18n.locale = locale;
    return {type: SETTINGS_ACTION_TYPES.SET_THEME, locale} as SetLocaleAction;
};
