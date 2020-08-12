import {LogOutAction, LogInRequestAction, LogInSuccessAction, LogInFailureAction, AppState, AppThunk} from "../types";
import {ThunkAction} from "redux-thunk";
import {Action} from "redux";

export enum AUTH_ACTION_TYPES {
    LOG_IN_REQUEST = "AUTH/LOG_IN_REQUEST",
    LOG_IN_SUCCESS = "AUTH/LOG_IN_SUCCESS",
    LOG_IN_FAILURE = "AUTH/LOG_IN_FAILURE",
    LOG_OUT = "AUTH/LOG_OUT",
}

// Log in actions

export const requestLogin = (username: string, password: string): LogInRequestAction => ({
    type: AUTH_ACTION_TYPES.LOG_IN_REQUEST,
    username,
    password,
});

export const loginSuccess = (token: string): LogInSuccessAction => ({
    type: AUTH_ACTION_TYPES.LOG_IN_SUCCESS,
    token,
});

export const loginFailure = (reason: string): LogInFailureAction => ({
    type: AUTH_ACTION_TYPES.LOG_IN_FAILURE,
    reason,
});

// Example asynchronous action creator (redux-thunk)
export const login = (username: string, password: string): AppThunk => async (dispatch) => {
    /* example:
    const resp = await loginAPI()
    dispatch(
        loginSuccess({token})
    )
    */
};

export const logout = (): LogOutAction => ({
    type: AUTH_ACTION_TYPES.LOG_OUT,
});
