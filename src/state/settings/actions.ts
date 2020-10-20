import {SetLocaleAction, SetThemeAction} from "../types";
import {Theme} from "../../types";
import {SupportedLocale} from "../../localization";
import i18n from "i18n-js";

export enum SETTINGS_ACTION_TYPES {
    SET_THEME = "SETTINGS/SET_THEME",
    SET_LOCALE = "SETTINGS/SET_LOCALE",
}

export const setTheme = (theme: Theme): SetThemeAction =>
    ({type: SETTINGS_ACTION_TYPES.SET_THEME, theme} as SetThemeAction);

export const setLocale = (locale: SupportedLocale): SetLocaleAction => {
    i18n.locale = locale;
    return {type: SETTINGS_ACTION_TYPES.SET_THEME, locale} as SetLocaleAction;
};
