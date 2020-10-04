import {
    LogOutAction,
    LogInBeginAction,
    LogInSuccessAction,
    LogInFailureAction,
    AppThunk,
    RegisterBeginAction,
    RegisterSuccessAction,
    RegisterFailureAction,
    ValidateAccountSuccessAction,
    ValidateAccountFailureAction,
} from "../types";
import {BACKEND_URL} from "../../constants/config";
import {AuthToken} from "../../model/auth-token";
import {ResponseLoginUser, ResponseRegisterUser} from "../../api/response-types";
import {encodeRequestArguments} from "../../api/utils";

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
}

// Register actions

export const registerBegin = (email: string, password: string): RegisterBeginAction => ({
    type: AUTH_ACTION_TYPES.REGISTER_BEGIN,
    email,
    password,
});

// Redux-thunk asynchronous action creator
export const requestRegister = (email: string, password: string): AppThunk => async (dispatch) => {
    dispatch(registerBegin(email, password));
    try {
        const response = await fetch(`${BACKEND_URL}/auth/register`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({email, password}),
        });

        const json = await response.json();
        console.log(json);

        if (json.error) {
            dispatch(registerFailure(json.message || [json.error]));
        } else {
            dispatch(registerSuccess(json as ResponseRegisterUser));
        }
    } catch (error) {
        console.error(error);
        dispatch(registerFailure([]));
    }
};

export const registerSuccess = (user: ResponseRegisterUser): RegisterSuccessAction => ({
    type: AUTH_ACTION_TYPES.REGISTER_SUCCESS,
    user,
});

export const registerFailure = (errors: string[]): RegisterFailureAction => ({
    type: AUTH_ACTION_TYPES.REGISTER_FAILURE,
    errors,
});

// Log in actions

export const loginBegin = (email: string, password: string): LogInBeginAction => ({
    type: AUTH_ACTION_TYPES.LOG_IN_BEGIN,
    email,
    password,
});

export const loginSuccess = (token: AuthToken, user: ResponseLoginUser): LogInSuccessAction => ({
    type: AUTH_ACTION_TYPES.LOG_IN_SUCCESS,
    token,
    user,
});

export const loginFailure = (errors: string[]): LogInFailureAction => ({
    type: AUTH_ACTION_TYPES.LOG_IN_FAILURE,
    errors,
});

export const requestLogin = (email: string, password: string): AppThunk => async (dispatch) => {
    dispatch(loginBegin(email, password));
    try {
        const response = await fetch(`${BACKEND_URL}/auth/login`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({email, password}),
        });

        const json = await response.json();
        console.log(json);

        if (json.error) {
            dispatch(loginFailure(typeof json.message === "string" ? [json.message] : json.message || [json.error]));
        } else {
            dispatch(loginSuccess(json.token, json.user as ResponseLoginUser));
        }
    } catch (error) {
        console.error(error);
        dispatch(loginFailure([]));
    }
};

export const logout = (): LogOutAction => ({
    type: AUTH_ACTION_TYPES.LOG_OUT,
});

// Account validation actions

export const requestValidateAccount = (validationToken: string, email: string): AppThunk => async (dispatch) => {
    try {
        // TODO remove the email from here
        const response = await fetch(
            `${BACKEND_URL}/auth/verify${encodeRequestArguments({email, token: validationToken})}`,
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                /*body: JSON.stringify({
                    validationToken,
                    email,
                }),*/
            },
        );

        const json = await response.json();
        console.log(json);

        if (json.error) {
            dispatch(validateAccountFailure(json.message || [json.error]));
        } else {
            dispatch(validateAccountSuccess());
        }
    } catch (error) {
        console.error(error);
        dispatch(validateAccountFailure([]));
    }
};

export const validateAccountSuccess = (): ValidateAccountSuccessAction => ({
    type: AUTH_ACTION_TYPES.VALIDATE_ACCOUNT_SUCCESS,
});

export const validateAccountFailure = (errors: string[]): ValidateAccountFailureAction => ({
    type: AUTH_ACTION_TYPES.VALIDATE_ACCOUNT_FAILURE,
    errors,
});
