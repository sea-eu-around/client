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
    LOG_IN_RECOVER_CANCEL = "AUTH/LOG_IN_RECOVER_CANCEL",
    LOG_OUT = "AUTH/LOG_OUT",
    VALIDATE_ACCOUNT = "AUTH/VALIDATE_ACCOUNT",
    VALIDATE_ACCOUNT_SUCCESS = "AUTH/VALIDATE_ACCOUNT_SUCCESS",
    VALIDATE_ACCOUNT_FAILURE = "AUTH/VALIDATE_ACCOUNT_FAILURE",
    SEND_VERIFICATION_EMAIL_SUCCESS = "AUTH/SEND_VERIFICATION_EMAIL_SUCCESS",
    BEGIN_ONBOARDING = "AUTH/BEGIN_ONBOARDING",
    NEXT_ONBOARDING_SLIDE = "AUTH/NEXT_ONBOARDING_SLIDE",
    PREVIOUS_ONBOARDING_SLIDE = "AUTH/PREVIOUS_ONBOARDING_SLIDE",
    SET_ONBOARDING_VALUES = "AUTH/SET_ONBOARDING_VALUES",
    SET_ONBOARDING_OFFER_VALUE = "AUTH/SET_ONBOARDING_OFFER_VALUE",
    FORGOT_PASSWORD_FAILURE = "AUTH/FORGOT_PASSWORD_FAILURE",
    FORGOT_PASSWORD_SUCCESS = "AUTH/FORGOT_PASSWORD_SUCCESS",
    RESET_PASSWORD_SUCCESS = "AUTH/RESET_PASSWORD_SUCCESS",
    DELETE_ACCOUNT_SUCCESS = "AUTH/DELETE_ACCOUNT_SUCCESS",
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
export type LogInFailureAction = {type: string; email?: string; needsRecovery: boolean; needsVerify: boolean};
export type LogInRecoverCancelAction = {type: string};

export type LogOutAction = {type: string; redirect: boolean};

export type ValidateAccountSuccessAction = {
    type: string;
    email: string;
};
export type ValidateAccountFailureAction = {type: string};

export type SendVerificationEmailSuccess = {type: string};

export type BeginOnboardingAction = {type: string};
export type NextOnboardingSlideAction = {type: string};
export type PreviousOnboardingSlideAction = {type: string};

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

export type DeleteAccountSuccessAction = {type: string};

export type AuthAction =
    | RegisterBeginAction
    | RegisterSuccessAction
    | RegisterFailureAction
    | LogInSuccessAction
    | LogInFailureAction
    | LogInRecoverCancelAction
    | LogOutAction
    | ValidateAccountSuccessAction
    | ValidateAccountFailureAction
    | SendVerificationEmailSuccess
    | SetOnboardingValuesAction
    | SetOnboardingOfferValueAction
    | ForgotPasswordFailureAction
    | ForgotPasswordSuccessAction
    | ResetPasswordSuccessAction
    | DeleteAccountSuccessAction;

// Register actions

const registerBegin = (email: string, password: string): RegisterBeginAction => ({
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
    const locale = getState().settings.userSettings.locale;

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

const registerSuccess = (user: User): RegisterSuccessAction => ({
    type: AUTH_ACTION_TYPES.REGISTER_SUCCESS,
    user,
});

const registerFailure = (): RegisterFailureAction => ({
    type: AUTH_ACTION_TYPES.REGISTER_FAILURE,
});

// Log in actions

const loginSuccess = (token: TokenDto, user: User, usingCachedCredentials: boolean): LogInSuccessAction => ({
    type: AUTH_ACTION_TYPES.LOG_IN_SUCCESS,
    token,
    user,
    usingCachedCredentials,
});

const loginFailure = (email?: string, needsRecovery = false, needsVerify = false): LogInFailureAction => ({
    type: AUTH_ACTION_TYPES.LOG_IN_FAILURE,
    email,
    needsRecovery,
    needsVerify,
});

export const attemptLoginFromCache = (): AppThunk<Promise<User | undefined>> => async (
    dispatch,
): Promise<User | undefined> => {
    const credentials = await readCachedCredentials();

    if (credentials) {
        const {token} = credentials;

        // Get user information
        const response = await requestBackend("auth/me", "GET", {}, {}, token);

        if (response.status == HttpStatusCode.OK) {
            const payload = (response as SuccessfulRequestResponse).data as ResponseUserDto;
            const user = convertDtoToUser(payload);
            dispatch(loginSuccess(token, user, true));
            return user;
        } else dispatch(loginFailure()); // e.g. token is invalid
    }
    // If no credentials are available in cache, the action does nothing.
    return undefined;
};

export const requestLogin = (email: string, password: string, recover = false): ValidatedThunkAction => async (
    dispatch,
) => {
    const response = await requestBackend("auth/login", "POST", {}, {email, password, recover});

    if (response.status == HttpStatusCode.OK) {
        const payload = (response as SuccessfulRequestResponse).data as LoginDto;
        dispatch(loginSuccess(payload.token, convertDtoToUser(payload.user), false));
        return {success: true};
    } else {
        let needsRecovery = false;
        let needsVerify = false;
        if (response.status === HttpStatusCode.FORBIDDEN) {
            needsRecovery = response.errorType === "error.user_being_deleted";
            needsVerify = response.errorType === "error.user_not_verified";
        }
        dispatch(loginFailure(email, needsRecovery, needsVerify));
        return {success: false, errors: gatherValidationErrors(response)};
    }
};

export const cancelLoginRecovery = (): LogInRecoverCancelAction => ({
    type: AUTH_ACTION_TYPES.LOG_IN_RECOVER_CANCEL,
});

export const logout = (redirect = true): LogOutAction => ({
    type: AUTH_ACTION_TYPES.LOG_OUT,
    redirect,
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

const validateAccountSuccess = (email: string): ValidateAccountSuccessAction => ({
    type: AUTH_ACTION_TYPES.VALIDATE_ACCOUNT_SUCCESS,
    email,
});

const validateAccountFailure = (): ValidateAccountFailureAction => ({
    type: AUTH_ACTION_TYPES.VALIDATE_ACCOUNT_FAILURE,
});

export const requestSendVerificationEmail = (email: string): AppThunk<Promise<boolean>> => async (dispatch) => {
    const response = await requestBackend("auth/verify/resend", "POST", {}, {email});

    if (response.status == HttpStatusCode.OK) {
        dispatch(sendVerificationEmailSuccess());
        return true;
    } else {
        return false;
    }
};

const sendVerificationEmailSuccess = (): SendVerificationEmailSuccess => ({
    type: AUTH_ACTION_TYPES.SEND_VERIFICATION_EMAIL_SUCCESS,
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

const forgotPasswordSuccess = (email: string): ForgotPasswordSuccessAction => ({
    type: AUTH_ACTION_TYPES.FORGOT_PASSWORD_SUCCESS,
    email,
});

const forgotPasswordFailure = (): ForgotPasswordFailureAction => ({
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

const resetPasswordSuccess = (): ResetPasswordSuccessAction => ({
    type: AUTH_ACTION_TYPES.RESET_PASSWORD_SUCCESS,
});

export const deleteAccount = (password: string): ValidatedThunkAction => async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await requestBackend("users", "DELETE", {}, {password}, token, true);

    if (response.status == HttpStatusCode.NO_CONTENT) {
        dispatch(logout(false));
        dispatch(deleteAccountSuccess());
        return {success: true};
    } else {
        return {success: false, errors: gatherValidationErrors(response)};
    }
};

const deleteAccountSuccess = (): DeleteAccountSuccessAction => ({
    type: AUTH_ACTION_TYPES.DELETE_ACCOUNT_SUCCESS,
});

// Onboarding actions

export const beginOnboarding = (): BeginOnboardingAction => ({
    type: AUTH_ACTION_TYPES.BEGIN_ONBOARDING,
});

export const nextOnboardingSlide = (): NextOnboardingSlideAction => ({
    type: AUTH_ACTION_TYPES.NEXT_ONBOARDING_SLIDE,
});

export const previousOnboardingSlide = (): PreviousOnboardingSlideAction => ({
    type: AUTH_ACTION_TYPES.PREVIOUS_ONBOARDING_SLIDE,
});

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
    const n = Math.round(1e3 * Math.random());
    const email = `test${n}.test@univ-brest.fr`;
    const password = "PASSword$1";

    await dispatch(requestRegister(email, password));
    const {verificationToken} = getState().auth;

    if (verificationToken) {
        await dispatch(requestValidateAccount(verificationToken));
        await dispatch(requestLogin(email, password));
        await dispatch(
            createProfile({
                type: "staff",
                birthdate: "2002-11-12T07:21:22.110Z",
                firstName: "Kevin" + n,
                lastName: "Test",
                gender: "male",
                languages: [
                    {code: "fr", level: "native"},
                    {code: "en", level: "c1"},
                ],
                nationality: "FR",
                interests: [{id: "baking"}, {id: "art"}, {id: "brunch"}],
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
                        offerId: "answer-academic-questions",
                        allowMale: true,
                        allowFemale: true,
                        allowOther: true,
                        allowStaff: true,
                        allowStudent: true,
                    },
                ],
                educationFields: [{id: "education-science"}, {id: "music-performing-arts"}],
                //degree: "m2",
                staffRoles: [{id: "research"}, {id: "teaching"}],
            }),
        );
    }
};

/**
 * Verifies that the server is alive and reachable by the client.
 */
export const verifyBackendConnection = (): AppThunk<Promise<boolean>> => async () => {
    const response = await requestBackend("ping", "GET", {}, {}, undefined, false, true);

    if (response.status == HttpStatusCode.OK) return true;
    else return false;
};
