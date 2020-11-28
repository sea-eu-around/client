import {ThunkAction, ThunkDispatch} from "redux-thunk";
import {Action, AnyAction} from "redux";
import {ThemeKey} from "../types";
import {
    CreateProfileDto,
    InterestDto,
    LikeProfileResponseDto,
    OfferCategory,
    OfferDto,
    OfferValueDto,
    RemoteValidationErrors,
    SpokenLanguageDto,
    TokenDto,
} from "../api/dto";
import {UserProfile} from "../model/user-profile";
import {User} from "../model/user";
import {Degree, Gender, Role, StaffRole} from "../constants/profile-constants";
import {CountryCode} from "../model/country-codes";
import {SupportedLocale} from "../localization";

export type FailableActionReturn = {success: boolean; errors?: string[]};
export type FailableThunkAction = AppThunk<Promise<FailableActionReturn>>;
export type ValidatedActionReturn = {success: boolean; errors?: RemoteValidationErrors};
export type ValidatedThunkAction = AppThunk<Promise<ValidatedActionReturn>>;

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
    registerEmail: string;
    validatedEmail: string | null;
    // This is available only in DEBUG_MODE on the staging server
    verificationToken?: string;
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
    offerIdToCategory: Map<string, OfferCategory>;
    interests: InterestDto[];
};

export type MatchingFiltersState = {
    offers: {[key: string]: boolean};
    universities: string[];
    degrees: Degree[];
    languages: string[];
    types: Role[];
};

export type MatchingState = {
    filters: MatchingFiltersState;
    fetchedProfiles: UserProfile[];
    fetchingProfiles: boolean;
    fetchingPage: number;
    canFetchMore: boolean;
    myMatches: UserProfile[];
    fetchingMyMatches: boolean;
};

export type MessagingState = {
    temp: undefined;
};

export type AppState = {
    auth: AuthState;
    settings: SettingsState;
    profile: ProfileState;
    matching: MatchingState;
    messaging: MessagingState;
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
    LOG_IN_SUCCESS = "AUTH/LOG_IN_SUCCESS",
    LOG_IN_FAILURE = "AUTH/LOG_IN_FAILURE",
    LOG_OUT = "AUTH/LOG_OUT",
    VALIDATE_ACCOUNT = "AUTH/VALIDATE_ACCOUNT",
    VALIDATE_ACCOUNT_SUCCESS = "AUTH/VALIDATE_ACCOUNT_SUCCESS",
    VALIDATE_ACCOUNT_FAILURE = "AUTH/VALIDATE_ACCOUNT_FAILURE",
    SET_ONBOARDING_VALUES = "AUTH/SET_ONBOARDING_VALUES",
    SET_ONBOARDING_OFFER_VALUE = "AUTH/SET_ONBOARDING_OFFER_VALUE",
    FORGOT_PASSWORD_FAILURE = "AUTH/FORGOT_PASSWORD_FAILURE",
    FORGOT_PASSWORD_SUCCESS = "AUTH/FORGOT_PASSWORD_SUCCESS",
    RESET_PASSWORD_SUCCESS = "AUTH/RESET_PASSWORD_SUCCESS",
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
};

export type LogInSuccessAction = {
    type: string;
    token: TokenDto;
    user: User;
    usingCachedCredentials: boolean;
};

export type LogInFailureAction = {
    type: string;
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
};

export type SetOnboardingValuesAction = {
    type: string;
    values: Partial<OnboardingState>;
};

export type SetOnboardingOfferValueAction = {
    type: string;
    id: string;
    value: OfferValueDto;
};

export type ForgotPasswordFailureAction = {
    type: string;
};

export type ForgotPasswordSuccessAction = {
    type: string;
    email: string;
};

export type ResetPasswordSuccessAction = {
    type: string;
};

export type AuthAction =
    | RegisterBeginAction
    | RegisterSuccessAction
    | RegisterFailureAction
    | LogInSuccessAction
    | LogInFailureAction
    | LogOutAction
    | ValidateAccountSuccessAction
    | ValidateAccountFailureAction
    | SetOnboardingValuesAction
    | SetOnboardingOfferValueAction
    | ForgotPasswordFailureAction
    | ForgotPasswordSuccessAction
    | ResetPasswordSuccessAction;

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
    SET_AVATAR = "PROFILE/SET_AVATAR",
    SET_AVATAR_SUCCESS = "PROFILE/SET_AVATAR_SUCCESS",
    SET_AVATAR_FAILURE = "PROFILE/SET_AVATAR_FAILURE",
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
    fromCache: boolean;
};

export type LoadProfileInterestsAction = {
    type: string;
};

export type LoadProfileInterestsSuccessAction = {
    type: string;
    interests: InterestDto[];
    fromCache: boolean;
};

export type FetchUserSuccessAction = {
    type: string;
    user: User;
};

export type SetAvatarSuccessAction = {
    type: string;
    avatarUrl: string;
};

export type SetAvatarFailureAction = {
    type: string;
};

export type ProfileAction =
    | SetProfileFieldsAction
    | CreateProfileAction
    | CreateProfileSuccessAction
    | LoadProfileOffersAction
    | LoadProfileOffersSuccessAction
    | LoadProfileInterestsAction
    | LoadProfileInterestsSuccessAction
    | FetchUserSuccessAction
    | SetAvatarSuccessAction
    | SetAvatarFailureAction;

/*### MATCHING ###*/

export enum MATCHING_ACTION_TYPES {
    SET_FILTERS = "MATCHING/SET_FILTERS",
    SET_OFFER_FILTER = "MATCHING/SET_OFFER_FILTER",
    FETCH_PROFILES_BEGIN = "MATCHING/FETCH_PROFILES_BEGIN",
    FETCH_PROFILES_SUCCESS = "MATCHING/FETCH_PROFILES_SUCCESS",
    FETCH_PROFILES_FAILURE = "MATCHING/FETCH_PROFILES_FAILURE",
    FETCH_PROFILES_REFRESH = "MATCHING/FETCH_PROFILES_REFRESH",
    LIKE_PROFILE_SUCCESS = "MATCHING/LIKE_PROFILE_SUCCESS",
    DISLIKE_PROFILE_SUCCESS = "MATCHING/DISLIKE_PROFILE_SUCCESS",
    BLOCK_PROFILE_SUCCESS = "MATCHING/BLOCK_PROFILE_SUCCESS",
    FETCH_MY_MATCHES_BEGIN = "MATCHING/FETCH_MY_MATCHES_BEGIN",
    FETCH_MY_MATCHES_FAILURE = "MATCHING/FETCH_MY_MATCHES_FAILURE",
    FETCH_MY_MATCHES_SUCCESS = "MATCHING/FETCH_MY_MATCHES_SUCCESS",
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
    matchStatus: LikeProfileResponseDto;
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

export type BeginFetchMyMatchesAction = {
    type: string;
};

export type FetchMyMatchesFailureAction = {
    type: string;
};

export type FetchMyMatchesSuccessAction = {
    type: string;
    profiles: UserProfile[];
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
    | BlockProfileSuccessAction
    | BeginFetchMyMatchesAction
    | FetchMyMatchesFailureAction
    | FetchMyMatchesSuccessAction;

/*### MESSAGING ###*/

export enum MESSAGING_ACTION_TYPES {
    // FETCH_ROOMS = "MESSAGING/FETCH_ROOMS",
    FETCH_ROOMS_FAILURE = "MESSAGING/FETCH_ROOMS_FAILURE",
    FETCH_ROOMS_SUCCESS = "MESSAGING/FETCH_ROOMS_SUCCESS",
    FETCH_ROOMS_REFRESH = "MESSAGING/FETCH_ROOMS_REFRESH",
    JOIN_ROOM = "MESSAGING/JOIN_ROOM",
    JOIN_ROOM_FAILURE = "MESSAGING/JOIN_ROOM_FAILURE",
    JOIN_ROOM_SUCCESS = "MESSAGING/JOIN_ROOM_SUCCESS",
    LEAVE_ROOM = "MESSAGING/LEAVE_ROOM",
}

export type FetchRoomsFailureAction = {
    type: MESSAGING_ACTION_TYPES.FETCH_ROOMS_FAILURE;
};

export type MessagingAction = FetchRoomsFailureAction;
