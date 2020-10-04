import {ThunkAction, ThunkDispatch} from "redux-thunk";
import {Action, AnyAction} from "redux";
import {Theme} from "../types";
import {FullProfile} from "../model/profile";
import {ResponseLoginUser, ResponseRegisterUser} from "../api/response-types";
import {AuthToken} from "../model/auth-token";

export type AuthState = {
    authenticated: boolean;
    validated: boolean;
    token: null | AuthToken;
    connecting: boolean;
    registerEmail: string;
    registerFailure: boolean;
    registerErrors: string[];
    registerSuccess: boolean;
    loginErrors: string[];
    verificationToken: string | null; // TODO temporary
    onboarded: boolean;
};

export type ThemingState = {
    theme: Theme;
};

export type ProfileState = {
    userProfile: FullProfile;
};

export type AppState = {
    auth: AuthState;
    theming: ThemingState;
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
    user: ResponseRegisterUser;
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
    token: AuthToken;
    user: ResponseLoginUser;
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
};

export type ValidateAccountFailureAction = {
    type: string;
    errors: string[];
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
    | ValidateAccountFailureAction;

/*### THEMING ###*/

export type SetThemeAction = {
    type: string;
    theme: Theme;
};

export type ThemingAction = SetThemeAction;

/*### PROFILE ###*/

export type SetProfileFieldsAction = {
    type: string;
    fields: Partial<FullProfile>;
};

export type ProfileAction = SetProfileFieldsAction;
