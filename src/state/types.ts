import {ThunkAction, ThunkDispatch} from "redux-thunk";
import {Action, AnyAction} from "redux";
import {ThemeKey} from "../types";
import {
    InterestDto,
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
