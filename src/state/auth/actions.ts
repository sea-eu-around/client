import {
    LogOutAction,
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
    ForgotPasswordSuccessAction,
    ForgotPasswordFailureAction,
    ResetPasswordSuccessAction,
    ValidatedThunkAction,
} from "../types";
import {LoginDto, OfferValueDto, ResponseUserDto, SuccessfulRequestResponse, TokenDto} from "../../api/dto";
import {User} from "../../model/user";
import {requestBackend} from "../../api/utils";
import store from "../store";
import {createProfile} from "../profile/actions";
import {readCachedCredentials} from "../auth-storage-middleware";
import {convertDtoToUser} from "../../api/converters";
import {HttpStatusCode} from "../../constants/http-status";
import {gatherValidationErrors} from "../../api/errors";

// Register actions

export const registerBegin = (email: string, password: string): RegisterBeginAction => ({
    type: AUTH_ACTION_TYPES.REGISTER_BEGIN,
    email,
    password,
});

// Redux-thunk asynchronous action creator
export const requestRegister = (email: string, password: string): ValidatedThunkAction => async (dispatch) => {
    dispatch(registerBegin(email, password));
    const locale = store.getState().settings.locale;

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
        const response = await requestBackend("auth/me", "GET", {}, {}, true, false, token);

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
    const response = await requestBackend("auth/login", "POST", {}, {email, password}, false, true);

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

export const debugConnect = (): AppThunk => async (dispatch) => {
    const email = `test${Math.round(Math.random() * 1e6)}.test@univ-brest.fr`;
    const password = "PASSword$1";

    await dispatch(requestRegister(email, password));
    const {verificationToken} = store.getState().auth;

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
