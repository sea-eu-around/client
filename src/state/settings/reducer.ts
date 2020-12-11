import {getDefaultLocale, SupportedLocale} from "../../localization";
import {LANGUAGES_CODES} from "../../model/languages";
import translations from "../../constants/translations";
import {SetLocaleAction, SetThemeAction, SettingsAction, SETTINGS_ACTION_TYPES} from "./actions";
import {SettingsState} from "../types";

function getLocalizedLanguageItems(locale: SupportedLocale) {
    const dict = translations as {[key: string]: {[key: string]: unknown}};
    const languageNames = (dict[locale].languageNames || dict["en"].languageNames) as {[key: string]: string};
    return LANGUAGES_CODES.map((code: string) => ({
        label: languageNames[code] || `Missing translation (${code})`, //i18n.t(`languageNameM${code}`${code})s, // Cannot rely on i18n as it is not initialized yet
        value: code,
    }));
}

export const initialState: SettingsState = {
    userSettings: {
        theme: "light",
        locale: getDefaultLocale(),
    },
    localizedLanguageItems: getLocalizedLanguageItems(getDefaultLocale()),
};

export const settingsReducer = (state: SettingsState = initialState, action: SettingsAction): SettingsState => {
    switch (action.type) {
        case SETTINGS_ACTION_TYPES.SET_THEME: {
            const {theme} = action as SetThemeAction;
            return {...state, userSettings: {...state.userSettings, theme}};
        }
        case SETTINGS_ACTION_TYPES.TOGGLE_THEME: {
            const theme = state.userSettings.theme == "light" ? "dark" : "light";
            return {...state, userSettings: {...state.userSettings, theme}};
        }
        case SETTINGS_ACTION_TYPES.SET_LOCALE: {
            const {locale} = action as SetLocaleAction;
            return {
                ...state,
                localizedLanguageItems: getLocalizedLanguageItems(locale),
                userSettings: {...state.userSettings, locale},
            };
        }
        default:
            return state;
    }
};
