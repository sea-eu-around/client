import {AnyAction, Middleware, Dispatch} from "redux";
import {rootNavigate} from "../navigation/utils";
import {
    AppState,
    AUTH_ACTION_TYPES,
    LikeProfileSuccessAction,
    LogInSuccessAction,
    MATCHING_ACTION_TYPES,
    PROFILE_ACTION_TYPES,
} from "./types";

export const navigationMiddleware: Middleware<unknown, AppState> = (/*store: MiddlewareAPI<Dispatch, AppState>*/) => (
    next: Dispatch<AnyAction>,
) => (action: AnyAction) => {
    // TODO action printing
    console.log(action.type);

    switch (action.type) {
        case PROFILE_ACTION_TYPES.PROFILE_CREATE_SUCCESS: {
            rootNavigate("OnboardingSuccessfulScreen");
            break;
        }
        case AUTH_ACTION_TYPES.LOG_IN_SUCCESS: {
            const {user} = action as LogInSuccessAction;
            rootNavigate(user.onboarded ? "MainScreen" : "OnboardingScreen");
            break;
        }
        case AUTH_ACTION_TYPES.REGISTER_SUCCESS: {
            rootNavigate("ValidationEmailSentScreen");
            break;
        }
        case MATCHING_ACTION_TYPES.LIKE_PROFILE_SUCCESS: {
            const {matchStatus} = action as LikeProfileSuccessAction;
            if (matchStatus == "matched") rootNavigate("MatchSuccessScreen");
            break;
        }
    }

    next(action);
};
