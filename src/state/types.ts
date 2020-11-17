import {ThunkAction, ThunkDispatch} from "redux-thunk";
import {Action, AnyAction} from "redux";
import {ThemeKey} from "../types";
import {CreateProfileDto, InterestDto, OfferDto, OfferValueDto, SpokenLanguageDto, TokenDto} from "../api/dto";
import {UserProfile} from "../model/user-profile";
import {User} from "../model/user";
import {Degree, Gender, Role, StaffRole} from "../constants/profile-constants";
import {CountryCode} from "../model/country-codes";
import {SupportedLocale} from "../localization";

export type OnboardingState = {
    firstname: string;
    lastname: string;
    birthdate: Date | null;
    gender: Gender | null;
    nationality: CountryCode | null;
    role: Role | null;
    degree: Degree | null;
    staffRole: StaffRole | null;
    languages: SpokenLanguageDto[];
    interestIds: string[];
    offerValues: {[key: string]: OfferValueDto};
    educationFields: string[];
};

export type AuthState = {
    authenticated: boolean;
    validated: boolean;
    token: null | TokenDto;
    connecting: boolean;
    registerEmail: string;
    registerFailure: boolean;
    registerErrors: string[];
    loginErrors: string[];
    validatedEmail: string | null;
    verificationToken: string | null; // TODO temporary
    onboarded: boolean;
    onboarding: OnboardingState;
};

export type SettingsState = {
    theme: ThemeKey;
    locale: SupportedLocale;
    localizedLanguageItems: {value: string; label: string}[];
};

export type ProfileState = {
    user: User | null;
    offers: OfferDto[];
    interests: InterestDto[];
};

export type MatchingFiltersState = {
    offers: {[key: string]: boolean};
    universities: string[];
    degrees: Degree[];
    languages: string[];
    roles: Role[];
};

export type MatchingState = {
    filters: MatchingFiltersState;
    fetchedProfiles: UserProfile[];
    fetchingProfiles: boolean;
    fetchingPage: number;
    canFetchMore: boolean;
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
    user: User;
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
    user: User;
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
    TOGGLE_THEME = "SETTINGS/TOGGLE_THEME",
    SET_LOCALE = "SETTINGS/SET_LOCALE",
}

export type SetThemeAction = {
    type: string;
    theme: ThemeKey;
};

export type ToggleThemeAction = {
    type: string;
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
    PROFILE_SET_FIELDS_SUCCESS = "PROFILE/SET_FIELDS_SUCCESS",
    PROFILE_CREATE = "PROFILE/CREATE",
    PROFILE_CREATE_SUCCESS = "PROFILE/CREATE_SUCCESS",
    FETCH_USER_SUCCESS = "PROFILE/FETCH_USER_SUCCESS",
}

export type LoadUserProfileAction = {
    type: string;
    id: string;
};

export type SetProfileFieldsAction = {
    type: string;
    fields: Partial<UserProfile>;
};

export type SetProfileFieldsSuccessAction = {
    type: string;
    fields: Partial<UserProfile>;
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

export type FetchUserSuccessAction = {
    type: string;
    user: User;
};

export type ProfileAction =
    | SetProfileFieldsAction
    | CreateProfileAction
    | CreateProfileSuccessAction
    | LoadProfileOffersAction
    | LoadProfileOffersSuccessAction
    | LoadProfileInterestsAction
    | LoadProfileInterestsSuccessAction
    | FetchUserSuccessAction;

/*### MATCHING ###*/

export enum MATCHING_ACTION_TYPES {
    SET_FILTERS = "MATCHING/SET_FILTERS",
    SET_OFFER_FILTER = "MATCHING/SET_OFFER_FILTER",
    RESET_MATCHING_FILTERS = "MATCHING/RESET_MATCHING_FILTERS",
    FETCH_PROFILES_BEGIN = "PROFILE/FETCH_PROFILES_BEGIN",
    FETCH_PROFILES = "PROFILE/FETCH_PROFILES",
    FETCH_PROFILES_SUCCESS = "PROFILE/FETCH_PROFILES_SUCCESS",
    FETCH_PROFILES_FAILURE = "PROFILE/FETCH_PROFILES_FAILURE",
    FETCH_PROFILES_REFRESH = "PROFILE/FETCH_PROFILES_REFRESH",
    LIKE_PROFILE_SUCCESS = "MATCHING/LIKE_PROFILE_SUCCESS",
    DISLIKE_PROFILE_SUCCESS = "MATCHING/DISLIKE_PROFILE_SUCCESS",
    BLOCK_PROFILE_SUCCESS = "MATCHING/BLOCK_PROFILE_SUCCESS",
}

export type SetOfferFilterAction = {
    type: string;
    offerId: string;
    value: boolean;
};

export type ResetMatchingFiltersAction = {
    type: string;
};

export type SetMatchingFiltersAction = {
    type: string;
    filters: Partial<MatchingFiltersState>;
};

export type LikeProfileSuccessAction = {
    type: string;
    profileId: string;
};

export type DislikeProfileSuccessAction = {
    type: string;
    profileId: string;
};

export type BlockProfileSuccessAction = {
    type: string;
    profileId: string;
};

export type FetchProfilesRefreshAction = {
    type: string;
};

export type BeginFetchProfilesAction = {
    type: string;
};

export type FetchProfilesFailureAction = {
    type: string;
};

export type FetchProfilesSuccessAction = {
    type: string;
    profiles: UserProfile[];
    canFetchMore: boolean;
};

export type MatchingAction =
    | SetOfferFilterAction
    | SetMatchingFiltersAction
    | ResetMatchingFiltersAction
    | BeginFetchProfilesAction
    | FetchProfilesSuccessAction
    | FetchProfilesFailureAction
    | FetchProfilesRefreshAction
    | LikeProfileSuccessAction
    | DislikeProfileSuccessAction
    | BlockProfileSuccessAction;
