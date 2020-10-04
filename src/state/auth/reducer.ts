import {
    AuthState,
    AuthAction,
    LogInSuccessAction,
    RegisterFailureAction,
    LogInFailureAction,
    RegisterBeginAction,
    RegisterSuccessAction,
} from "../types";
import {AUTH_ACTION_TYPES} from "./actions";

export const initialState: AuthState = {
    authenticated: false,
    token: null,
    connecting: false,
    validated: false,
    verificationToken: null, // TODO temporary
    onboarded: false,
    registerEmail: "",
    registerSuccess: false,
    registerFailure: false,
    registerErrors: [],
    loginErrors: [],
};

export const authReducer = (state: AuthState = initialState, action: AuthAction): AuthState => {
    const newState: AuthState = {...state}; // shallow copy

    switch (action.type) {
        case AUTH_ACTION_TYPES.REGISTER_BEGIN: {
            const {email} = <RegisterBeginAction>action;
            return {
                ...newState,
                registerFailure: false,
                registerErrors: [],
                registerSuccess: false,
                registerEmail: email,
            };
        }
        case AUTH_ACTION_TYPES.REGISTER_FAILURE: {
            const {errors} = <RegisterFailureAction>action;
            return {...newState, registerFailure: true, registerErrors: errors, registerSuccess: false};
        }
        case AUTH_ACTION_TYPES.REGISTER_SUCCESS: {
            const {
                user: {verificationToken, onboarded},
            } = <RegisterSuccessAction>action;
            return {
                ...newState,
                registerFailure: false,
                registerErrors: [],
                registerSuccess: true,
                verificationToken,
                onboarded,
            };
        }
        case AUTH_ACTION_TYPES.VALIDATE_ACCOUNT_SUCCESS: {
            return {...newState, validated: true};
        }
        case AUTH_ACTION_TYPES.VALIDATE_ACCOUNT_FAILURE: {
            return {...newState, validated: false};
        }
        case AUTH_ACTION_TYPES.LOG_IN_BEGIN: {
            return {...newState, connecting: true, loginErrors: []};
        }
        case AUTH_ACTION_TYPES.LOG_IN_FAILURE: {
            const {errors} = <LogInFailureAction>action;
            return {...newState, connecting: false, loginErrors: errors};
        }
        case AUTH_ACTION_TYPES.LOG_IN_SUCCESS: {
            const {
                token,
                user: {onboarded},
            } = <LogInSuccessAction>action;
            return {
                ...newState,
                connecting: false,
                authenticated: true,
                loginErrors: [],
                token,
                onboarded,
            };
        }
        case AUTH_ACTION_TYPES.LOG_OUT: {
            return {...newState, token: null, authenticated: false};
        }
        default:
            return state;
    }
};
