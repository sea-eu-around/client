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
    verificationToken: null, // TODO temporary
    registerEmail: "",
    registerSuccess: false,
    registerFailure: false,
    registerErrors: [],
    validatedEmail: null,
    loginErrors: [],
    onboarded: false,
    onboarding: {
        firstname: "",
        lastname: "",
        birthDate: null,
        gender: null,
        nationality: null,
        role: null,
        levelOfStudy: -1,
        staffRole: null,
        languages: [],
        offerValues: {},
        interestIds: [],
    },
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
            const {email} = <ValidateAccountSuccessAction>action;
            return {...newState, validated: true, validatedEmail: email};
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
                ...newState,
                connecting: false,
                authenticated: true,
                loginErrors: [],
                token,
                onboarded,
                onboarding,
            };
        }
        case AUTH_ACTION_TYPES.LOG_OUT: {
            return {...newState, token: null, authenticated: false};
        }
        case AUTH_ACTION_TYPES.SET_ONBOARDING_VALUES: {
            const {values} = <SetOnboardingValuesAction>action;
            return {...newState, onboarding: {...state.onboarding, ...values}};
        }
        case AUTH_ACTION_TYPES.SET_ONBOARDING_OFFER_VALUE: {
            const {id, value} = <SetOnboardingOfferValueAction>action;
            return {
                ...newState,
                onboarding: {
                    ...state.onboarding,
                    offerValues: {
                        ...state.onboarding.offerValues,
                        [id]: {
                            ...(state.onboarding.offerValues[id] || {roles: [], genders: []}),
                            ...value,
                        },
                    },
                },
            };
        }
        default:
            return state;
    }
};
