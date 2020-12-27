import {Platform} from "react-native";
import {AnyAction, Middleware, Dispatch} from "redux";
import {COOKIE_CONSENT_DURATION} from "../constants/config";
import {clearStaticData, storeStaticData} from "./persistent-storage/static";
import {
    LoadProfileInterestsSuccessAction,
    LoadProfileOffersSuccessAction,
    PROFILE_ACTION_TYPES,
} from "./profile/actions";
import {SaveCookiesPreferencesAction, SetLocaleAction, SetThemeAction, SETTINGS_ACTION_TYPES} from "./settings/actions";
import {AppState} from "./types";

export const staticStorageMiddleware: Middleware<unknown, AppState> = (store) => (next: Dispatch<AnyAction>) => (
    action: AnyAction,
) => {
    // Handle cookie preferences changes
    switch (action.type) {
        case SETTINGS_ACTION_TYPES.SAVE_COOKIES_PREFERENCES: {
            const oldCookies = store.getState().settings.userSettings.cookies;
            const cookies = (action as SaveCookiesPreferencesAction).preferences;

            // Store data for cookies that were accepted by the user
            if (!oldCookies.cache && cookies.cache) {
                const {offers, interests} = store.getState().profile;
                storeStaticData("interests", interests, cookies.cache);
                storeStaticData("offers", offers, cookies.cache);
            }
            if (!oldCookies.settings && cookies.settings) {
                const {locale, theme} = store.getState().settings.userSettings;
                storeStaticData("locale", locale, cookies.settings);
                storeStaticData("theme", theme, cookies.settings);
            }

            // Discard cookies that were refused by the user
            if (oldCookies.cache && !cookies.cache) clearStaticData("interests", "offers");
            if (oldCookies.settings && !cookies.settings) clearStaticData("locale", "theme");

            // Store new cookies preferences
            storeStaticData("cookies", cookies, true);
            storeStaticData("cookieConsentDate", new Date(Date.now()).toJSON(), true);

            break;
        }
    }

    const {cookies, cookieConsentDate} = store.getState().settings.userSettings;

    // Handle storage that requires cookie consent from the user
    if (hasUserGivenCookieConsent(cookieConsentDate)) {
        switch (action.type) {
            case PROFILE_ACTION_TYPES.LOAD_PROFILE_INTERESTS_SUCCESS: {
                const {interests, fromCache} = action as LoadProfileInterestsSuccessAction;
                if (!fromCache) storeStaticData("interests", interests, cookies.cache);
                break;
            }
            case PROFILE_ACTION_TYPES.LOAD_PROFILE_OFFERS_SUCCESS: {
                const {offers, fromCache} = action as LoadProfileOffersSuccessAction;
                if (!fromCache) storeStaticData("offers", offers, cookies.cache);
                break;
            }
            case SETTINGS_ACTION_TYPES.SET_LOCALE: {
                const {locale, fromCache} = action as SetLocaleAction;
                if (!fromCache) storeStaticData("locale", locale, cookies.settings);
                break;
            }
            case SETTINGS_ACTION_TYPES.SET_THEME: {
                const {theme, fromCache} = action as SetThemeAction;
                if (!fromCache) storeStaticData("theme", theme, cookies.settings);
                break;
            }
            case SETTINGS_ACTION_TYPES.TOGGLE_THEME: {
                const {theme} = store.getState().settings.userSettings;
                storeStaticData("theme", theme === "dark" ? "light" : "dark", cookies.settings);
                break;
            }
        }
    }

    next(action);
};

export function hasUserGivenCookieConsent(consentDate: Date | null): boolean {
    // Never ask the user in the native version of the app
    if (Platform.OS !== "web") return true;
    return consentDate !== null && (Date.now() - consentDate.getTime()) / 1000 < COOKIE_CONSENT_DURATION;
}
