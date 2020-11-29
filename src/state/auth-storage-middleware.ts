import {AnyAction, Middleware, Dispatch} from "redux";
import {AppState} from "./types";
import {AUTH_ACTION_TYPES, LogInSuccessAction} from "./auth/actions";
import {discardAuthInformation, storeAuthInformation} from "./persistent-storage/auth";

export const authStorageMiddleware: Middleware<unknown, AppState> = () => (next: Dispatch<AnyAction>) => (
    action: AnyAction,
) => {
    switch (action.type) {
        case AUTH_ACTION_TYPES.LOG_IN_SUCCESS: {
            const {token, user, usingCachedCredentials} = action as LogInSuccessAction;
            // Store the authentication info only if we didn't use it already to login (in that case it is already stored)
            if (!usingCachedCredentials) storeAuthInformation(user.email, token);
            break;
        }
        case AUTH_ACTION_TYPES.LOG_OUT:
        case AUTH_ACTION_TYPES.LOG_IN_FAILURE: {
            discardAuthInformation();
            break;
        }
    }
    next(action);
};
