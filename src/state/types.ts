import {ThunkAction, ThunkDispatch} from "redux-thunk";
import {Action, AnyAction} from "redux";
import {Theme} from "../types";
import {FullProfile} from "../model/profile";
import {TokenDto, UserDto} from "../api/response-types";
import {Gender, Role, StaffRole} from "../constants/profile-constants";
import {CountryCode} from "../model/country-codes";
import {SupportedLocale} from "../localization";

export type OnboardingState = {
    firstname: string;
    lastname: string;
    birthDate: Date | null;
    gender: Gender | null;
    nationality: CountryCode | null;
    role: Role | null;
    levelOfStudy: number;
    staffRole: StaffRole | null;
    languages: string[];
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
    userProfile: FullProfile;
};

export type AppState = {
    auth: AuthState;
    settings: SettingsState;
    profile: ProfileState;
};

// Shortcut type for redux-thunk actions (async actions)
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action<string>>;

// Shortcut type for redux-thunk dispatch (cast dispatch function to this for async actions)
export type MyThunkDispatch = ThunkDispatch<AppState, void, AnyAction>;

/*### AUTH ###*/

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
    | SetOnboardingValuesAction;

/*### SETTINGS ###*/

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

export type SetProfileFieldsAction = {
    type: string;
    fields: Partial<FullProfile>;
};

export type ProfileAction = SetProfileFieldsAction;
