import {
    AppThunk,
    SetProfileFieldsAction,
    CreateProfileSuccessAction,
    PROFILE_ACTION_TYPES,
    LoadProfileOffersSuccessAction,
    LoadProfileInterestsSuccessAction,
} from "../types";
import {FullProfile} from "../../model/profile";
import {BACKEND_URL} from "../../constants/config";
import {CreateProfileDto, InterestDto, OfferDto} from "../../api/dto";
import {Role} from "../../constants/profile-constants";
import store from "../store";
import {requestBackend} from "../../api/utils";

export const setProfileFields = (fields: Partial<FullProfile>): SetProfileFieldsAction => ({
    type: PROFILE_ACTION_TYPES.PROFILE_SET_FIELDS,
    fields,
});

export const createProfileSuccess = (): CreateProfileSuccessAction => ({
    type: PROFILE_ACTION_TYPES.PROFILE_CREATE_SUCCESS,
});

export const createProfile = (role: Role, profile: CreateProfileDto): AppThunk => async (dispatch) => {
    const type = role == "student" ? "STUDENT" : "STAFF";
    const response = await requestBackend("profiles", "POST", {type}, profile, true);
    if (response.success) {
        dispatch(createProfileSuccess());
    }
    /* else {
        
    }*/
};

export const loadProfileOffers = (): AppThunk => async (dispatch) => {
    const response = await requestBackend("offers", "GET");
    if (response.success) {
        dispatch(loadProfileOffersSuccess(response.data as OfferDto[]));
    }
    /* else {
        
    }*/
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
    /* else {
        
    }*/
};

export const loadProfileInterestsSuccess = (interests: InterestDto[]): LoadProfileInterestsSuccessAction => ({
    type: PROFILE_ACTION_TYPES.LOAD_PROFILE_INTERESTS_SUCCESS,
    interests,
});
