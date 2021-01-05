import {AnyAction, Middleware, Dispatch} from "redux";
import {MatchActionStatus} from "../api/dto";
import {rootNavigate} from "../navigation/utils";
import {AUTH_ACTION_TYPES, LogInSuccessAction} from "./auth/actions";
import {LikeProfileSuccessAction, MATCHING_ACTION_TYPES} from "./matching/actions";
import {PROFILE_ACTION_TYPES} from "./profile/actions";
import {AppState} from "./types";

export const navigationMiddleware: Middleware<unknown, AppState> = (/*store: MiddlewareAPI<Dispatch, AppState>*/) => (
    next: Dispatch<AnyAction>,
) => (action: AnyAction) => {
    // TEMP action printing
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
        case AUTH_ACTION_TYPES.LOG_OUT: {
            rootNavigate("LoginRoot", {
                screen: "LoginScreens",
                params: {screen: "SigninScreen"},
            });
            break;
        }
        case AUTH_ACTION_TYPES.REGISTER_SUCCESS: {
            rootNavigate("ValidationEmailSentScreen");
            break;
        }
        case AUTH_ACTION_TYPES.VALIDATE_ACCOUNT_SUCCESS: {
            // Let the user click
            // attemptRedirectToApp("login", "SigninScreen");
            break;
        }
        case AUTH_ACTION_TYPES.FORGOT_PASSWORD_SUCCESS: {
            rootNavigate("ForgotPasswordEmailSentScreen");
            break;
        }
        case AUTH_ACTION_TYPES.RESET_PASSWORD_SUCCESS: {
            rootNavigate("ResetPasswordSuccessScreen");
            break;
        }
        case MATCHING_ACTION_TYPES.LIKE_PROFILE_SUCCESS: {
            const {matchStatus, roomId} = action as LikeProfileSuccessAction;
            if (matchStatus == MatchActionStatus.Matched) rootNavigate("MatchSuccessScreen", {roomId});
            break;
        }
        case AUTH_ACTION_TYPES.DELETE_ACCOUNT_SUCCESS: {
            rootNavigate("LoginRoot", {screen: "WelcomeScreen"});
            break;
        }
    }

    next(action);
};
