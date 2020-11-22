import {extractNamesFromEmail} from "../../model/utils";
import {
    AuthState,
    AuthAction,
    LogInSuccessAction,
    RegisterFailureAction,
    LogInFailureAction,
    RegisterBeginAction,
    RegisterSuccessAction,
    ValidateAccountSuccessAction,
    SetOnboardingValuesAction,
    AUTH_ACTION_TYPES,
    SetOnboardingOfferValueAction,
} from "../types";

export const initialState: AuthState = {
    authenticated: false,
    token: null,
    connecting: false,
    validated: false,
    registerEmail: "",
    registerFailure: false,
    registerErrors: [],
    validatedEmail: null,
    loginErrors: [],
    onboarded: false,
    onboarding: {
        firstname: "",
        lastname: "",
        birthdate: null,
        gender: null,
        nationality: null,
        role: null,
        degree: null,
        staffRole: null,
        languages: [],
        offerValues: {},
        interestIds: [],
        educationFields: [],
    },
};

export const authReducer = (state: AuthState = initialState, action: AuthAction): AuthState => {
    switch (action.type) {
        case AUTH_ACTION_TYPES.REGISTER_BEGIN: {
            const {email} = <RegisterBeginAction>action;
            return {
                ...state,
                registerFailure: false,
                registerErrors: [],
                registerEmail: email,
            };
        }
        case AUTH_ACTION_TYPES.REGISTER_FAILURE: {
            const {errors} = <RegisterFailureAction>action;
            return {...state, registerFailure: true, registerErrors: errors};
        }
        case AUTH_ACTION_TYPES.REGISTER_SUCCESS: {
            const {
                user: {verificationToken, onboarded},
            } = <RegisterSuccessAction>action;
            return {
                ...state,
                registerFailure: false,
                registerErrors: [],
                verificationToken,
                onboarded,
            };
        }
        case AUTH_ACTION_TYPES.VALIDATE_ACCOUNT_SUCCESS: {
            const {email} = <ValidateAccountSuccessAction>action;
            return {...state, validated: true, validatedEmail: email};
        }
        case AUTH_ACTION_TYPES.VALIDATE_ACCOUNT_FAILURE: {
            return {...state, validated: false};
        }
        case AUTH_ACTION_TYPES.LOG_IN_BEGIN: {
            return {...state, connecting: true, loginErrors: []};
        }
        case AUTH_ACTION_TYPES.LOG_IN_FAILURE: {
            const {errors} = <LogInFailureAction>action;
            return {...state, connecting: false, loginErrors: errors};
        }
        case AUTH_ACTION_TYPES.LOG_IN_SUCCESS: {
            const {
                token,
                user: {onboarded, email},
            } = <LogInSuccessAction>action;

            // Pre-fill some of the on-boarding values
            const onboarding = {...state.onboarding};
            if (!onboarded) {
                const names = extractNamesFromEmail(email);
                if (names) {
                    onboarding.firstname = names.firstname;
                    onboarding.lastname = names.lastname;
                }
            }

            return {
                ...state,
                connecting: false,
                authenticated: true,
                loginErrors: [],
                token,
                onboarded,
                onboarding,
            };
        }
        case AUTH_ACTION_TYPES.LOG_OUT: {
            return {...state, token: null, authenticated: false};
        }
        case AUTH_ACTION_TYPES.SET_ONBOARDING_VALUES: {
            const {values} = <SetOnboardingValuesAction>action;
            return {...state, onboarding: {...state.onboarding, ...values}};
        }
        case AUTH_ACTION_TYPES.SET_ONBOARDING_OFFER_VALUE: {
            const {id, value} = <SetOnboardingOfferValueAction>action;
            return {
                ...state,
                onboarding: {
                    ...state.onboarding,
                    offerValues: {
                        ...state.onboarding.offerValues,
                        [id]: value,
                    },
                },
            };
        }
        default:
            return state;
    }
};
