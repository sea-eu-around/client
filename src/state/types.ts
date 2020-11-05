import {ThunkAction, ThunkDispatch} from "redux-thunk";
import {Action, AnyAction} from "redux";
import {Theme} from "../types";
import {CreateProfileDto, InterestDto, OfferDto, OfferValueDto, TokenDto, UserDto, UserProfileDto} from "../api/dto";
import {Gender, Role, StaffRole} from "../constants/profile-constants";
import {CountryCode} from "../model/country-codes";
import {SupportedLocale} from "../localization";
import {SpokenLanguage} from "../model/spoken-language";

export type OnboardingState = {
    firstname: string;
    lastname: string;
    birthDate: Date | null;
    gender: Gender | null;
    nationality: CountryCode | null;
    role: Role | null;
    levelOfStudy: number;
    staffRole: StaffRole | null;
    languages: SpokenLanguage[];
    interestIds: string[];
    offerValues: {
        [key: string]: {
            roles: Role[];
            genders: Gender[];
        };
    };
};

export type AuthState = {
    authenticated: boolean;
    validated: boolean;
    token: null | TokenDto;
    connecting: boolean;
    registerEmail: string;
    registerFailure: boolean;
    registerErrors: string[];
    registerSuccess: boolean;
    loginErrors: string[];
    validatedEmail: string | null;
    verificationToken: string | null; // TODO temporary
    onboarded: boolean;
    onboarding: OnboardingState;
};

export type SettingsState = {
    theme: Theme;
    locale: SupportedLocale;
};

export type ProfileState = {
    user: UserDto;
    offers: OfferDto[];
    interests: InterestDto[];
};

export type MatchingState = {
    userIds: [1, 2, 3, 4, 6, 7];
    loadedPreviews: {[key: string]: {id: number}};
    loadedProfiles: {[key: string]: {id: number}};
};

export type AppState = {
    auth: AuthState;
    settings: SettingsState;
    profile: ProfileState;
    matching: MatchingState;
};

// Shortcut type for redux-thunk actions (async actions)
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action<string>>;

// Shortcut type for redux-thunk dispatch (cast dispatch function to this for async actions)
export type MyThunkDispatch = ThunkDispatch<AppState, void, AnyAction>;

/*### AUTH ###*/

export enum AUTH_ACTION_TYPES {
    REGISTER_BEGIN = "AUTH/REGISTER_BEGIN",
    REGISTER_SUCCESS = "AUTH/REGISTER_SUCCESS",
    REGISTER_FAILURE = "AUTH/REGISTER_FAILURE",
    LOG_IN_BEGIN = "AUTH/LOG_IN_BEGIN",
    LOG_IN_SUCCESS = "AUTH/LOG_IN_SUCCESS",
    LOG_IN_FAILURE = "AUTH/LOG_IN_FAILURE",
    LOG_OUT = "AUTH/LOG_OUT",
    VALIDATE_ACCOUNT = "AUTH/VALIDATE_ACCOUNT",
    VALIDATE_ACCOUNT_SUCCESS = "AUTH/VALIDATE_ACCOUNT_SUCCESS",
    VALIDATE_ACCOUNT_FAILURE = "AUTH/VALIDATE_ACCOUNT_FAILURE",
    SET_ONBOARDING_VALUES = "AUTH/SET_ONBOARDING_VALUES",
    SET_ONBOARDING_OFFER_VALUE = "AUTH/SET_ONBOARDING_OFFER_VALUE",
}

export type RegisterBeginAction = {
    type: string;
    email: string;
    password: string;
};

export type RegisterSuccessAction = {
    type: string;
    user: UserDto;
};

export type RegisterFailureAction = {
    type: string;
    errors: string[];
};

export type LogInBeginAction = {
    type: string;
    email: string;
    password: string;
};

export type LogInSuccessAction = {
    type: string;
    token: TokenDto;
    user: UserDto;
};

export type LogInFailureAction = {
    type: string;
    errors: string[];
};

export type LogOutAction = {
    type: string;
};

export type ValidateAccountSuccessAction = {
    type: string;
    email: string;
};

export type ValidateAccountFailureAction = {
    type: string;
    errors: string[];
};

export type SetOnboardingValuesAction = {
    type: string;
    values: Partial<OnboardingState>;
};

export type SetOnboardingOfferValueAction = {
    type: string;
    id: string;
    value: Partial<OfferValueDto>;
};

export type AuthAction =
    | RegisterBeginAction
    | RegisterSuccessAction
    | RegisterFailureAction
    | LogInBeginAction
    | LogInSuccessAction
    | LogInFailureAction
    | LogOutAction
    | ValidateAccountSuccessAction
    | ValidateAccountFailureAction
    | SetOnboardingValuesAction
    | SetOnboardingOfferValueAction;

/*### SETTINGS ###*/

export enum SETTINGS_ACTION_TYPES {
    SET_THEME = "SETTINGS/SET_THEME",
    SET_LOCALE = "SETTINGS/SET_LOCALE",
}

export type SetThemeAction = {
    type: string;
    theme: Theme;
};

export type SetLocaleAction = {
    type: string;
    locale: SupportedLocale;
};

export type SettingsAction = SetThemeAction | SetLocaleAction;

/*### PROFILE ###*/

export enum PROFILE_ACTION_TYPES {
    LOAD_USER_PROFILE = "PROFILE/LOAD_USER_PROFILE",
    LOAD_PROFILE_OFFERS = "LOAD_PROFILE_OFFERS",
    LOAD_PROFILE_OFFERS_SUCCESS = "LOAD_PROFILE_OFFERS_SUCCESS",
    LOAD_PROFILE_INTERESTS = "LOAD_PROFILE_INTERESTS",
    LOAD_PROFILE_INTERESTS_SUCCESS = "LOAD_PROFILE_INTERESTS_SUCCESS",
    PROFILE_SET_FIELDS = "PROFILE/SET_FIELDS",
    PROFILE_CREATE = "PROFILE/CREATE",
    PROFILE_CREATE_SUCCESS = "PROFILE/CREATE_SUCCESS",
}

// TODO loaduserprofile
export type LoadUserProfileAction = {
    type: string;
    id: string;
};

export type SetProfileFieldsAction = {
    type: string;
    fields: Partial<UserProfileDto>;
};

export type CreateProfileAction = {
    type: string;
    profile: CreateProfileDto;
};

export type CreateProfileSuccessAction = {
    type: string;
};

export type LoadProfileOffersAction = {
    type: string;
};

export type LoadProfileOffersSuccessAction = {
    type: string;
    offers: OfferDto[];
};

export type LoadProfileInterestsAction = {
    type: string;
};

export type LoadProfileInterestsSuccessAction = {
    type: string;
    interests: InterestDto[];
};

export type ProfileAction =
    | SetProfileFieldsAction
    | CreateProfileAction
    | CreateProfileSuccessAction
    | LoadProfileOffersAction
    | LoadProfileOffersSuccessAction
    | LoadProfileInterestsAction
    | LoadProfileInterestsSuccessAction;
