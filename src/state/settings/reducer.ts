import {getDefaultLocale, SupportedLocale} from "../../localization";
import {LANGUAGES_CODES} from "../../model/languages";
import {SettingsState, SettingsAction, SetThemeAction, SetLocaleAction, SETTINGS_ACTION_TYPES} from "../types";
import translations from "../../constants/translations";

function getLocalizedLanguageItems(locale: SupportedLocale) {
    const trans = (translations as {[key: string]: {[key: string]: unknown}})[locale];
    const languageNames = trans.languageNames as {[key: string]: string};
    return LANGUAGES_CODES.slice(0, 20).map((code: string) => ({
        label: languageNames[code], //i18n.t(`languageNames.${code}`), // Cannot rely on i18n as it is not initialized yet
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
