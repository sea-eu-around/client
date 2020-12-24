import {AnyAction, Middleware, Dispatch} from "redux";
import {storeStaticData} from "./persistent-storage/static";
import {
    LoadProfileInterestsSuccessAction,
    LoadProfileOffersSuccessAction,
    PROFILE_ACTION_TYPES,
} from "./profile/actions";
import {SetLocaleAction, SetThemeAction, SETTINGS_ACTION_TYPES} from "./settings/actions";
import {AppState} from "./types";

export const staticStorageMiddleware: Middleware<unknown, AppState> = (store) => (next: Dispatch<AnyAction>) => (
    action: AnyAction,
) => {
    switch (action.type) {
        case PROFILE_ACTION_TYPES.LOAD_PROFILE_INTERESTS_SUCCESS: {
            const {interests, fromCache} = action as LoadProfileInterestsSuccessAction;
            if (!fromCache) {
                console.log("Updating the interests cache.");
                storeStaticData("interests", interests);
            }
            break;
        }
        case PROFILE_ACTION_TYPES.LOAD_PROFILE_OFFERS_SUCCESS: {
            const {offers, fromCache} = action as LoadProfileOffersSuccessAction;
            if (!fromCache) {
                console.log("Updating the offers cache.");
                storeStaticData("offers", offers);
            }
            break;
        }
        case SETTINGS_ACTION_TYPES.SET_LOCALE: {
            const {locale, fromCache} = action as SetLocaleAction;
            if (!fromCache) storeStaticData("locale", locale);
            break;
        }
        case SETTINGS_ACTION_TYPES.SET_THEME: {
            const {theme, fromCache} = action as SetThemeAction;
            if (!fromCache) storeStaticData("theme", theme);
            break;
        }
        case SETTINGS_ACTION_TYPES.TOGGLE_THEME: {
            const {theme} = store.getState().settings.userSettings;
            storeStaticData("theme", theme === "dark" ? "light" : "dark");
            break;
        }
    }
    next(action);
};
