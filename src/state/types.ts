import {ThunkAction} from "redux-thunk";
import {Action} from "redux";

export type AuthState = {
    authenticated: boolean;
    token: string;
    connecting: false;
};

export type AppState = {
    auth: AuthState;
};

// Shortcut type for redux-thunk actions (async actions)
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action<string>>;

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
