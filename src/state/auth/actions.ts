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
    SetOnboardingOfferValueAction,
} from "../types";
import {BACKEND_URL} from "../../constants/config";
import {LoginDto, OfferValueDto, TokenDto, UserDto} from "../../api/dto";
import {requestBackend} from "../../api/utils";

// Register actions

export const registerBegin = (email: string, password: string): RegisterBeginAction => ({
    type: AUTH_ACTION_TYPES.REGISTER_BEGIN,
    email,
    password,
});

// Redux-thunk asynchronous action creator
export const requestRegister = (email: string, password: string): AppThunk => async (dispatch) => {
    dispatch(registerBegin(email, password));
    const response = await requestBackend("auth/register", "POST", {}, {email, password});

    if (response.success) dispatch(registerSuccess(response.data as UserDto));
    else dispatch(registerFailure(response.codes));
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

    const response = await requestBackend("auth/login", "POST", {}, {email, password});
    if (response.success) {
        const payload = response.data as LoginDto;
        dispatch(loginSuccess(payload.token, payload.user));
    } else dispatch(loginFailure(response.codes));
};

export const logout = (): LogOutAction => ({
    type: AUTH_ACTION_TYPES.LOG_OUT,
});

// Account validation actions

export const requestValidateAccount = (validationToken: string, email: string): AppThunk => async (dispatch) => {
    // TODO remove the email from here
    const response = await requestBackend("auth/verify", "POST", {}, {token: validationToken, email});

    if (response.success) {
        const {email} = response.data as {email: string};
        dispatch(validateAccountSuccess(email));
    } else {
        dispatch(validateAccountFailure(response.codes));
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

export const setOnboardingOfferValue = (id: string, value: Partial<OfferValueDto>): SetOnboardingOfferValueAction => ({
    type: AUTH_ACTION_TYPES.SET_ONBOARDING_OFFER_VALUE,
    id,
    value,
});
