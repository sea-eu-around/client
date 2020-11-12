import {
    AppThunk,
    CreateProfileSuccessAction,
    PROFILE_ACTION_TYPES,
    LoadProfileOffersSuccessAction,
    LoadProfileInterestsSuccessAction,
    SetProfileFieldsSuccessAction,
    FetchUserSuccessAction,
} from "../types";
import {CreateProfileDto, InterestDto, OfferDto, ResponseUserDto} from "../../api/dto";
import {UserProfile} from "../../model/user-profile";
import {User} from "../../model/user";
import {requestBackend} from "../../api/utils";
import {convertDtoToUser, convertPartialProfileToCreateDto} from "../../api/converters";

export const setProfileFieldsSuccess = (fields: Partial<UserProfile>): SetProfileFieldsSuccessAction => ({
    type: PROFILE_ACTION_TYPES.PROFILE_SET_FIELDS_SUCCESS,
    fields,
});

export const setProfileFields = (fields: Partial<UserProfile>): AppThunk => async (dispatch) => {
    const dto: Partial<CreateProfileDto> = convertPartialProfileToCreateDto(fields);
    const response = await requestBackend("profiles", "PATCH", {}, dto, true, true);
    if (response.success) {
        dispatch(setProfileFieldsSuccess(fields));
    } else {
        console.log("error in setProfileFields");
    }
};

export const createProfileSuccess = (): CreateProfileSuccessAction => ({
    type: PROFILE_ACTION_TYPES.PROFILE_CREATE_SUCCESS,
});

export const createProfile = (profile: CreateProfileDto): AppThunk => async (dispatch) => {
    const response = await requestBackend("profiles", "POST", {}, profile, true, true);
    if (response.success || true) {
        // TODO remove createprofile bypass
        dispatch(createProfileSuccess());
    }
};

export const loadProfileOffers = (): AppThunk => async (dispatch) => {
    const response = await requestBackend("offers", "GET");
    if (response.success) {
        dispatch(loadProfileOffersSuccess(response.data as OfferDto[]));
    }
};

export const loadProfileOffersSuccess = (offers: OfferDto[]): LoadProfileOffersSuccessAction => ({
    type: PROFILE_ACTION_TYPES.LOAD_PROFILE_OFFERS_SUCCESS,
    offers,
});

export const loadProfileInterests = (): AppThunk => async (dispatch) => {
    console.log("loadProfileInterests");
    const response = await requestBackend("interests", "GET");
    console.log("loadProfileInterests - success =", response.success);
    if (response.success) {
        dispatch(loadProfileInterestsSuccess(response.data as InterestDto[]));
    }
};

export const loadProfileInterestsSuccess = (interests: InterestDto[]): LoadProfileInterestsSuccessAction => ({
    type: PROFILE_ACTION_TYPES.LOAD_PROFILE_INTERESTS_SUCCESS,
    interests,
});

export const fetchUser = (): AppThunk => async (dispatch) => {
    const response = await requestBackend("auth/me", "GET", {}, {}, true, true);
    if (response.success) {
        const dto = response.data as ResponseUserDto;
        dispatch(fetchUserSuccess(convertDtoToUser(dto)));
    }
};

export const fetchUserSuccess = (user: User): FetchUserSuccessAction => ({
    type: PROFILE_ACTION_TYPES.FETCH_USER_SUCCESS,
    user,
});
