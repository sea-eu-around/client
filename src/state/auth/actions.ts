import {AppThunk, OnboardingState, ValidatedThunkAction} from "../types";
import {LoginDto, OfferValueDto, ResponseUserDto, SuccessfulRequestResponse, TokenDto} from "../../api/dto";
import {User} from "../../model/user";
import {requestBackend} from "../../api/utils";
import {createProfile} from "../profile/actions";
import {convertDtoToUser} from "../../api/converters";
import {HttpStatusCode} from "../../constants/http-status";
import {gatherValidationErrors} from "../../api/errors";
import {readCachedCredentials} from "../persistent-storage/auth";

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

export type RegisterSuccessAction = {type: string; user: User};

export type RegisterFailureAction = {type: string};

export type LogInSuccessAction = {
    type: string;
    token: TokenDto;
    user: User;
    usingCachedCredentials: boolean;
};

export type LogOutAction = {type: string};

export type LogInFailureAction = {type: string};

export type ValidateAccountSuccessAction = {
    type: string;
    email: string;
};

export type ValidateAccountFailureAction = {type: string};

export type SetOnboardingValuesAction = {
    type: string;
    values: Partial<OnboardingState>;
};

export type SetOnboardingOfferValueAction = {
    type: string;
    id: string;
    value: OfferValueDto;
};

export type ForgotPasswordFailureAction = {type: string};

export type ForgotPasswordSuccessAction = {
    type: string;
    email: string;
};

export type ResetPasswordSuccessAction = {type: string};

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

// Register actions

export const registerBegin = (email: string, password: string): RegisterBeginAction => ({
    type: AUTH_ACTION_TYPES.REGISTER_BEGIN,
    email,
    password,
});

// Redux-thunk asynchronous action creator
export const requestRegister = (email: string, password: string): ValidatedThunkAction => async (
    dispatch,
    getState,
) => {
    dispatch(registerBegin(email, password));
    const locale = getState().settings.locale;

    const response = await requestBackend("auth/register", "POST", {}, {email, password, locale});

    if (response.status == HttpStatusCode.OK) {
        const successResp = response as SuccessfulRequestResponse;
        dispatch(registerSuccess(successResp.data as User));
        return {success: true};
    } else {
        dispatch(registerFailure());
        return {success: false, errors: gatherValidationErrors(response)};
    }
};

export const registerSuccess = (user: User): RegisterSuccessAction => ({
    type: AUTH_ACTION_TYPES.REGISTER_SUCCESS,
    user,
});

export const registerFailure = (): RegisterFailureAction => ({
    type: AUTH_ACTION_TYPES.REGISTER_FAILURE,
});

// Log in actions

export const loginSuccess = (token: TokenDto, user: User, usingCachedCredentials: boolean): LogInSuccessAction => ({
    type: AUTH_ACTION_TYPES.LOG_IN_SUCCESS,
    token,
    user,
    usingCachedCredentials,
});

export const loginFailure = (): LogInFailureAction => ({
    type: AUTH_ACTION_TYPES.LOG_IN_FAILURE,
});

export const attemptLoginFromCache = (): AppThunk<Promise<boolean>> => async (dispatch): Promise<boolean> => {
    const credentials = await readCachedCredentials();

    if (credentials) {
        const {token} = credentials;

        // Get user information
        const response = await requestBackend("auth/me", "GET", {}, {}, token);

        if (response.status == HttpStatusCode.OK) {
            const payload = (response as SuccessfulRequestResponse).data as ResponseUserDto;
            dispatch(loginSuccess(token, convertDtoToUser(payload), true));
            return true;
        } else dispatch(loginFailure()); // e.g. token is invalid
    }
    // If no credentials are available in cache, the action does nothing.
    return false;
};

export const requestLogin = (email: string, password: string): ValidatedThunkAction => async (dispatch) => {
    const response = await requestBackend("auth/login", "POST", {}, {email, password});

    if (response.status == HttpStatusCode.OK) {
        const payload = (response as SuccessfulRequestResponse).data as LoginDto;
        dispatch(loginSuccess(payload.token, payload.user, false));
        return {success: true};
    } else {
        dispatch(loginFailure());
        return {success: false, errors: gatherValidationErrors(response)};
    }
};

export const logout = (): LogOutAction => ({
    type: AUTH_ACTION_TYPES.LOG_OUT,
});

// Account validation actions

export const requestValidateAccount = (validationToken: string): AppThunk => async (dispatch) => {
    const response = await requestBackend("auth/verify", "POST", {}, {token: validationToken});

    if (response.status == HttpStatusCode.OK) {
        const payload = (response as SuccessfulRequestResponse).data;
        const {email} = payload as {email: string};
        dispatch(validateAccountSuccess(email));
    } else {
        dispatch(validateAccountFailure());
    }
};

export const validateAccountSuccess = (email: string): ValidateAccountSuccessAction => ({
    type: AUTH_ACTION_TYPES.VALIDATE_ACCOUNT_SUCCESS,
    email,
});

export const validateAccountFailure = (): ValidateAccountFailureAction => ({
    type: AUTH_ACTION_TYPES.VALIDATE_ACCOUNT_FAILURE,
});

// Forgot password actions

export const forgotPassword = (email: string): ValidatedThunkAction => async (dispatch) => {
    const response = await requestBackend("auth/password/forgot", "POST", {}, {email});

    if (response.status == HttpStatusCode.OK) {
        dispatch(forgotPasswordSuccess(email));
        return {success: true};
    } else {
        dispatch(forgotPasswordFailure());
        return {success: false, errors: gatherValidationErrors(response)};
    }
};

export const forgotPasswordSuccess = (email: string): ForgotPasswordSuccessAction => ({
    type: AUTH_ACTION_TYPES.FORGOT_PASSWORD_SUCCESS,
    email,
});

export const forgotPasswordFailure = (): ForgotPasswordFailureAction => ({
    type: AUTH_ACTION_TYPES.FORGOT_PASSWORD_FAILURE,
});

export const resetPassword = (token: string, password: string): ValidatedThunkAction => async (dispatch) => {
    const response = await requestBackend("auth/password/reset", "POST", {}, {token, password});

    if (response.status == HttpStatusCode.OK) {
        dispatch(resetPasswordSuccess());
        return {success: true};
    } else {
        return {success: false, errors: gatherValidationErrors(response)};
    }
};

export const resetPasswordSuccess = (): ResetPasswordSuccessAction => ({
    type: AUTH_ACTION_TYPES.RESET_PASSWORD_SUCCESS,
});

// Onboarding actions

export const setOnboardingValues = (values: Partial<OnboardingState>): SetOnboardingValuesAction => ({
    type: AUTH_ACTION_TYPES.SET_ONBOARDING_VALUES,
    values,
});

export const setOnboardingOfferValue = (id: string, value: OfferValueDto): SetOnboardingOfferValueAction => ({
    type: AUTH_ACTION_TYPES.SET_ONBOARDING_OFFER_VALUE,
    id,
    value,
});

export const debugConnect = (): AppThunk => async (dispatch, getState) => {
    const email = `test${Math.round(Math.random() * 1e6)}.test@univ-brest.fr`;
    const password = "PASSword$1";

    await dispatch(requestRegister(email, password));
    const {verificationToken} = getState().auth;

    if (verificationToken) {
        await dispatch(requestValidateAccount(verificationToken));
        await dispatch(requestLogin(email, password));
        await dispatch(
            createProfile({
                type: "student",
                birthdate: "2002-11-12T07:21:22.110Z",
                firstName: "Kevin" + Math.round(1e3 * Math.random()),
                lastName: "Test",
                gender: "male",
                languages: [
                    {code: "fr", level: "native"},
                    {code: "en", level: "c1"},
                ],
                nationality: "FR",
                interests: [],
                profileOffers: [
                    {
                        offerId: "provide-a-couch",
                        allowMale: true,
                        allowFemale: true,
                        allowOther: true,
                        allowStaff: false,
                        allowStudent: true,
                    },
                    {
                        offerId: "grab-a-drink",
                        allowMale: true,
                        allowFemale: true,
                        allowOther: true,
                        allowStaff: false,
                        allowStudent: true,
                    },
                    {
                        offerId: "talk-a-bit",
                        allowMale: true,
                        allowFemale: true,
                        allowOther: true,
                        allowStaff: true,
                        allowStudent: true,
                    },
                ],
                educationFields: [],
                degree: "m2",
            }),
        );
    }
};
