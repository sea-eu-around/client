import {AnyAction, Middleware, MiddlewareAPI, Dispatch} from "redux";
import {rootNavigate} from "../navigation/utils";
import {AppState, AUTH_ACTION_TYPES, PROFILE_ACTION_TYPES} from "./types";

export const navigationMiddleware: Middleware<unknown, AppState> = (store: MiddlewareAPI<Dispatch, AppState>) => (
    next: Dispatch<AnyAction>,
) => (action: AnyAction) => {
    const state: AppState = store.getState();

    // TODO action printing
    console.log(action.type);

    switch (action.type) {
        case PROFILE_ACTION_TYPES.PROFILE_CREATE_SUCCESS: {
            rootNavigate("OnboardingSuccessfulScreen");
            break;
        }
        case AUTH_ACTION_TYPES.LOG_IN_SUCCESS: {
            rootNavigate(state.auth.onboarded ? "MainScreen" : "OnboardingScreen");
            break;
        }
        case AUTH_ACTION_TYPES.REGISTER_SUCCESS: {
            rootNavigate("ValidationEmailSentScreen");
            break;
        }
    }

    next(action);
};
