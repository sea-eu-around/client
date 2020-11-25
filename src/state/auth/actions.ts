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
import {LoginDto, OfferValueDto, ResponseUserDto, TokenDto} from "../../api/dto";
import {User} from "../../model/user";
import {requestBackend} from "../../api/utils";
import store from "../store";
import {createProfile} from "../profile/actions";
import {readCachedCredentials} from "../auth-storage-middleware";
import {convertDtoToUser} from "../../api/converters";

// Register actions

export const registerBegin = (email: string, password: string): RegisterBeginAction => ({
    type: AUTH_ACTION_TYPES.REGISTER_BEGIN,
    email,
    password,
});

// Redux-thunk asynchronous action creator
export const requestRegister = (email: string, password: string): AppThunk => async (dispatch) => {
    dispatch(registerBegin(email, password));
    const locale = store.getState().settings.locale;

    const response = await requestBackend("auth/register", "POST", {}, {email, password, locale});

    if (response.success) dispatch(registerSuccess(response.data as User));
    else dispatch(registerFailure(response.codes));
};

export const registerSuccess = (user: User): RegisterSuccessAction => ({
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

export const loginSuccess = (token: TokenDto, user: User, usingCachedCredentials: boolean): LogInSuccessAction => ({
    type: AUTH_ACTION_TYPES.LOG_IN_SUCCESS,
    token,
    user,
    usingCachedCredentials,
});

export const loginFailure = (errors: string[]): LogInFailureAction => ({
    type: AUTH_ACTION_TYPES.LOG_IN_FAILURE,
    errors,
});

export const attemptLoginFromCache = (): AppThunk<Promise<boolean>> => async (dispatch): Promise<boolean> => {
    const credentials = await readCachedCredentials();

    if (credentials) {
        const {token} = credentials;

        // Get user information
        const response = await requestBackend("auth/me", "GET", {}, {}, true, false, token);

        if (response.success) {
            const user: User = convertDtoToUser(response.data as ResponseUserDto);
            dispatch(loginSuccess(token, user, true));
            return true;
        } else dispatch(loginFailure([])); // e.g. token is invalid
    }
    // If no credentials are available in cache, the action does nothing.
    return false;
};

export const requestLogin = (email: string, password: string): AppThunk => async (dispatch) => {
    dispatch(loginBegin(email, password));

    const response = await requestBackend("auth/login", "POST", {}, {email, password}, false);
    if (response.success) {
        const payload = response.data as LoginDto;
        dispatch(loginSuccess(payload.token, payload.user, false));
    } else dispatch(loginFailure(response.codes));
};

export const logout = (): LogOutAction => ({
    type: AUTH_ACTION_TYPES.LOG_OUT,
});

// Account validation actions

export const requestValidateAccount = (validationToken: string): AppThunk => async (dispatch) => {
    const response = await requestBackend("auth/verify", "POST", {}, {token: validationToken});

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
                firstName: "Kevin410891",
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
