import {ThunkAction} from "redux-thunk";
import {Action} from "redux";
import {Theme} from "../types";
import {FullProfile} from "../model/profile";

export type AuthState = {
    authenticated: boolean;
    token: string;
    connecting: false;
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

/*### AUTH ###*/

export type LogInRequestAction = {
    type: string;
    username: string;
    password: string;
};

export type LogInSuccessAction = {
    type: string;
    token: string;
};

export type LogInFailureAction = {
    type: string;
    reason: string;
};

export type LogOutAction = {
    type: string;
};

export type AuthAction = LogInRequestAction | LogInSuccessAction | LogInFailureAction | LogOutAction;

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
