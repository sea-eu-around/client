import {getDefaultLocale, SupportedLocale} from "../../localization";
import {LANGUAGES_CODES} from "../../model/languages";
import translations from "../../constants/translations";
import {SetLocaleAction, SetThemeAction, SettingsAction, SETTINGS_ACTION_TYPES} from "./actions";
import {SettingsState} from "../types";

function getLocalizedLanguageItems(locale: SupportedLocale) {
    const trans = (translations as {[key: string]: {[key: string]: unknown}})[locale];
    const languageNames = trans.languageNames as {[key: string]: string};
    return LANGUAGES_CODES.map((code: string) => ({
        label: languageNames[code] || `Missing translation (${code})`, //i18n.t(`languageNameM${code}`${code})s, // Cannot rely on i18n as it is not initialized yet
        value: code,
    }));
}

export const initialState: SettingsState = {
    theme: "light",
    locale: getDefaultLocale(),
    localizedLanguageItems: getLocalizedLanguageItems(getDefaultLocale()),
};

export const settingsReducer = (state: SettingsState = initialState, action: SettingsAction): SettingsState => {
    switch (action.type) {
        case SETTINGS_ACTION_TYPES.SET_THEME: {
            const {theme} = <SetThemeAction>action;
            return {...state, theme};
        }
        case SETTINGS_ACTION_TYPES.TOGGLE_THEME: {
            return {...state, theme: state.theme == "light" ? "dark" : "light"};
        }
        case SETTINGS_ACTION_TYPES.SET_LOCALE: {
            const {locale} = <SetLocaleAction>action;
            return {...state, locale, localizedLanguageItems: getLocalizedLanguageItems(locale)};
        }
        default:
            return state;
    }
};
