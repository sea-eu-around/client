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
    OnboardingState,
    SetOnboardingValuesAction,
    AUTH_ACTION_TYPES,
} from "../types";
import {BACKEND_URL} from "../../constants/config";
import {LoginDto, TokenDto, UserDto} from "../../api/response-types";

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

        if (json.success) {
            dispatch(registerSuccess(json.data as UserDto));
        } else {
            dispatch(registerFailure(json.codes));
        }
    } catch (error) {
        console.error(error);
        dispatch(registerFailure([]));
    }
};

export const registerSuccess = (user: UserDto): RegisterSuccessAction => ({
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

export const loginSuccess = (token: TokenDto, user: UserDto): LogInSuccessAction => ({
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

        if (json.success) {
            const payload = json.data as LoginDto;
            dispatch(loginSuccess(payload.token, payload.user));
        } else {
            dispatch(loginFailure(json.codes));
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
        const response = await fetch(`${BACKEND_URL}/auth/verify`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token: validationToken,
                email,
            }),
        });

        const json = await response.json();
        console.log(json);

        if (json.success) {
            dispatch(validateAccountSuccess(json.data.email));
        } else {
            dispatch(validateAccountFailure(json.codes));
        }
    } catch (error) {
        console.error(error);
        dispatch(validateAccountFailure([]));
    }
};

export const validateAccountSuccess = (email: string): ValidateAccountSuccessAction => ({
    type: AUTH_ACTION_TYPES.VALIDATE_ACCOUNT_SUCCESS,
    email,
});

export const validateAccountFailure = (errors: string[]): ValidateAccountFailureAction => ({
    type: AUTH_ACTION_TYPES.VALIDATE_ACCOUNT_FAILURE,
    errors,
});

// Onboarding actions

export const setOnboardingValues = (values: Partial<OnboardingState>): SetOnboardingValuesAction => ({
    type: AUTH_ACTION_TYPES.SET_ONBOARDING_VALUES,
    values,
});
