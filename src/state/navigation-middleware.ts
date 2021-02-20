import {AnyAction, Middleware, Dispatch, MiddlewareAPI} from "redux";
import {DEBUG_MODE} from "../constants/config";
import {navigateToGroup, rootNavigate} from "../navigation/utils";
import {ONBOARDING_ORDER} from "../screens/onboarding";
import {AUTH_ACTION_TYPES, beginOnboarding, LogInSuccessAction, LogOutAction} from "./auth/actions";
import {CreateGroupSuccessAction, GROUP_ACTION_TYPES} from "./groups/actions";
import {ActionCancelSuccessAction, MATCHING_ACTION_TYPES} from "./matching/actions";
import {PROFILE_ACTION_TYPES} from "./profile/actions";
import {AppState} from "./types";

export const navigationMiddleware: Middleware<unknown, AppState> = (store: MiddlewareAPI<Dispatch, AppState>) => (
    next: Dispatch<AnyAction>,
) => (action: AnyAction) => {
    if (DEBUG_MODE) console.log(action.type);

    next(action);

    switch (action.type) {
        case PROFILE_ACTION_TYPES.PROFILE_CREATE_SUCCESS: {
            rootNavigate("OnboardingSuccessfulScreen");
            break;
        }
        case AUTH_ACTION_TYPES.LOG_IN_SUCCESS: {
            const {user} = action as LogInSuccessAction;
            if (user.onboarded) rootNavigate("MainScreen", {screen: "TabMatching"});
            else store.dispatch(beginOnboarding());
            break;
        }
        case AUTH_ACTION_TYPES.LOG_OUT: {
            const {redirect} = action as LogOutAction;
            if (redirect) {
                rootNavigate("LoginRoot", {
                    screen: "LoginScreens",
                    params: {screen: "SigninScreen"},
                });
            }
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
        case AUTH_ACTION_TYPES.BEGIN_ONBOARDING: {
            rootNavigate("OnboardingScreen");
            break;
        }
        case AUTH_ACTION_TYPES.PREVIOUS_ONBOARDING_SLIDE: {
            rootNavigate(ONBOARDING_ORDER[store.getState().auth.onboardingIndex]);
            break;
        }
        case AUTH_ACTION_TYPES.NEXT_ONBOARDING_SLIDE: {
            rootNavigate(ONBOARDING_ORDER[store.getState().auth.onboardingIndex]);
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
        case AUTH_ACTION_TYPES.DELETE_ACCOUNT_SUCCESS: {
            rootNavigate("DeleteAccountSuccessScreen");
            break;
        }
        case MATCHING_ACTION_TYPES.ACTION_CANCEL_SUCCESS: {
            const {isMatch} = action as ActionCancelSuccessAction;
            // When un-matching someone, navigate back from their profile to MainScreen
            if (isMatch) rootNavigate("MainScreen", {screen: "TabMatching"});
            break;
        }
        case GROUP_ACTION_TYPES.CREATE_SUCCESS: {
            const {group} = action as CreateGroupSuccessAction;
            navigateToGroup(group.id);
            break;
        }
        case GROUP_ACTION_TYPES.LEAVE_SUCCESS: {
            rootNavigate("MainScreen", {screen: "TabGroups", params: {screen: "TabGroupsScreen"}});
            break;
        }
    }
};
