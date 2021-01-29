import {extractNamesFromEmail} from "../../model/utils";
import {PROFILE_ACTION_TYPES} from "../profile/actions";
import {AuthState, OnboardingState} from "../types";
import {
    AuthAction,
    LogInSuccessAction,
    RegisterBeginAction,
    RegisterSuccessAction,
    ValidateAccountSuccessAction,
    SetOnboardingValuesAction,
    AUTH_ACTION_TYPES,
    SetOnboardingOfferValueAction,
    LogInFailureAction,
} from "./actions";

const initialOnboardingState = (): OnboardingState => ({
    firstname: "",
    lastname: "",
    birthdate: null,
    gender: null,
    nationality: null,
    type: null,
    degree: null,
    staffRoles: {},
    languages: [],
    offerValues: {},
    interestIds: [],
    educationFields: [],
});

export const initialState: AuthState = {
    authenticated: false,
    token: null,
    validated: false,
    registerEmail: "",
    validatedEmail: null,
    accountNeedsRecovery: false,
    onboarded: false,
    onboarding: initialOnboardingState(),
    onboardingIndex: 0,
};

export const authReducer = (state: AuthState = initialState, action: AuthAction): AuthState => {
    switch (action.type) {
        case AUTH_ACTION_TYPES.REGISTER_BEGIN: {
            const {email} = <RegisterBeginAction>action;
            return {
                ...state,
                registerEmail: email,
            };
        }
        case AUTH_ACTION_TYPES.REGISTER_SUCCESS: {
            const {
                user: {verificationToken, onboarded},
            } = <RegisterSuccessAction>action;
            return {
                ...state,
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
                authenticated: true,
                accountNeedsRecovery: false,
                token,
                onboarded,
                onboarding,
            };
        }
        case AUTH_ACTION_TYPES.LOG_IN_FAILURE: {
            const {needsRecovery} = action as LogInFailureAction;
            return {
                ...state,
                accountNeedsRecovery: needsRecovery,
            };
        }
        case AUTH_ACTION_TYPES.LOG_IN_RECOVER_CANCEL: {
            return {...state, accountNeedsRecovery: false};
        }
        case AUTH_ACTION_TYPES.LOG_OUT: {
            return {
                ...state,
                token: null,
                authenticated: false,
                accountNeedsRecovery: false,
                validated: false,
                validatedEmail: null,
                onboarded: false,
            };
        }
        case AUTH_ACTION_TYPES.BEGIN_ONBOARDING: {
            return {...state, onboardingIndex: 0};
        }
        case AUTH_ACTION_TYPES.PREVIOUS_ONBOARDING_SLIDE: {
            return {...state, onboardingIndex: state.onboardingIndex - 1};
        }
        case AUTH_ACTION_TYPES.NEXT_ONBOARDING_SLIDE: {
            return {...state, onboardingIndex: state.onboardingIndex + 1};
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
        case PROFILE_ACTION_TYPES.PROFILE_CREATE_SUCCESS: {
            return {...state, onboarded: true, onboarding: initialOnboardingState()};
        }
        default:
            return state;
    }
};
