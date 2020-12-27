import {AnyAction, Middleware, Dispatch} from "redux";
import {AppState} from "./types";
import {AUTH_ACTION_TYPES, LogInSuccessAction} from "./auth/actions";
import {discardAuthInformation, storeAuthInformation} from "./persistent-storage/auth";
import {SaveCookiesPreferencesAction, SETTINGS_ACTION_TYPES} from "./settings/actions";
import {hasUserGivenCookieConsent} from "./static-storage-middleware";

export const authStorageMiddleware: Middleware<unknown, AppState> = (store) => (next: Dispatch<AnyAction>) => (
    action: AnyAction,
) => {
    switch (action.type) {
        // Handle cookie preferences changes
        case SETTINGS_ACTION_TYPES.SAVE_COOKIES_PREFERENCES: {
            const cookies = (action as SaveCookiesPreferencesAction).preferences;
            if (cookies.auth) {
                // Store again when accepting the auth cookie
                const token = store.getState().auth.token;
                const user = store.getState().profile.user;
                if (token && user) storeAuthInformation(user.email, token);
            } else {
                // Discard when refusing the auth cookie
                discardAuthInformation();
            }
            break;
        }
        // Discard when needed
        case AUTH_ACTION_TYPES.LOG_OUT:
        case AUTH_ACTION_TYPES.LOG_IN_FAILURE: {
            discardAuthInformation();
            break;
        }
    }

    const {cookies, cookieConsentDate} = store.getState().settings.userSettings;

    if (hasUserGivenCookieConsent(cookieConsentDate)) {
        switch (action.type) {
            case AUTH_ACTION_TYPES.LOG_IN_SUCCESS: {
                const {token, user, usingCachedCredentials} = action as LogInSuccessAction;
                // Store the authentication info only if we didn't use it already to login (in that case it is already stored)
                if (!usingCachedCredentials && cookies.auth) storeAuthInformation(user.email, token);
                break;
            }
        }
    }

    next(action);
};
