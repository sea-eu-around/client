import {getDefaultLocale} from "../../localization";
import {SettingsState, SettingsAction, SetThemeAction, SetLocaleAction} from "../types";
import {SETTINGS_ACTION_TYPES} from "./actions";

export const initialState: SettingsState = {
    theme: "light",
    locale: getDefaultLocale(),
};

export const settingsReducer = (state: SettingsState = initialState, action: SettingsAction): SettingsState => {
    const newState: SettingsState = {...state}; // shallow copy

    switch (action.type) {
        case SETTINGS_ACTION_TYPES.SET_THEME:
            const {theme} = <SetThemeAction>action;
            return {...newState, theme};
        case SETTINGS_ACTION_TYPES.SET_LOCALE:
            const {locale} = <SetLocaleAction>action;
            return {...newState, locale};
        default:
            return state;
    }
};
