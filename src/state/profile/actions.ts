import {
    AppThunk,
    SetProfileFieldsAction,
    CreateProfileSuccessAction,
    PROFILE_ACTION_TYPES,
    LoadProfileOffersSuccessAction,
    LoadProfileInterestsSuccessAction,
    FetchProfilesSuccessAction,
    BeginFetchProfilesAction,
    FetchProfilesFailureAction,
    ProfileState,
    FetchProfilesRefreshAction,
} from "../types";
import {CreateProfileDto, InterestDto, OfferDto, UserProfileDto} from "../../api/dto";
import {requestBackend} from "../../api/utils";
import store from "../store";

export const setProfileFields = (fields: Partial<UserProfileDto>): SetProfileFieldsAction => ({
    type: PROFILE_ACTION_TYPES.PROFILE_SET_FIELDS,
    fields,
});

export const createProfileSuccess = (): CreateProfileSuccessAction => ({
    type: PROFILE_ACTION_TYPES.PROFILE_CREATE_SUCCESS,
});

export const createProfile = (profile: CreateProfileDto): AppThunk => async (dispatch) => {
    const response = await requestBackend("profiles", "POST", {}, profile, true);
    if (response.success || true) {
        // TODO remove createprofile bypass
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

export const beginFetchProfiles = (): BeginFetchProfilesAction => ({
    type: PROFILE_ACTION_TYPES.FETCH_PROFILES_BEGIN,
});

export const fetchProfiles = (): AppThunk => async (dispatch) => {
    const state: ProfileState = store.getState().profile;
    if (state.fetchingProfiles) return;

    dispatch(beginFetchProfiles());

    const response = await requestBackend("profiles", "GET", {page: state.fetchingPage, limit: 5}, {}, true, true);

    // TODO temp fake profiles
    const testProfiles: UserProfileDto[] = [
        {
            id: "SpGiGSsGDdGSpogjQgsfGhfSdDFPFhGdShD",
            firstName: "John",
            lastName: "Doe",
            university: "univ-brest",
            degree: "bsc3",
            nationality: "FR",
            birthdate: new Date(),
            gender: "male",
            interests: ["netflix"],
            avatarUri: "",
            languages: [
                {code: "fr", level: "native"},
                {code: "en", level: "c2"},
            ],
            educationFields: [],
        },
        {
            id: "FQSFDPSfpgsdsdfPIUJIjGSfgpQgqujpgodREjPGS",
            firstName: "Matt",
            lastName: "Brooks",
            university: "univ-cadiz",
            degree: "m2",
            nationality: "FR",
            birthdate: new Date(),
            gender: "male",
            interests: ["netflix"],
            avatarUri: "",
            languages: [
                {code: "es", level: "native"},
                {code: "en", level: "c1"},
                {code: "fr", level: "b2"},
            ],
            educationFields: [],
        },
    ];
    //response.data = testProfiles;

    if (response.success) dispatch(fetchProfilesSuccess(response.data as UserProfileDto[]));
    else dispatch(fetchProfilesFailure());
};

export const fetchProfilesFailure = (): FetchProfilesFailureAction => ({
    type: PROFILE_ACTION_TYPES.FETCH_PROFILES_FAILURE,
});

export const fetchProfilesSuccess = (profiles: UserProfileDto[]): FetchProfilesSuccessAction => ({
    type: PROFILE_ACTION_TYPES.FETCH_PROFILES_SUCCESS,
    profiles,
});

export const refreshFetchedProfiles = (): FetchProfilesRefreshAction => ({
    type: PROFILE_ACTION_TYPES.FETCH_PROFILES_REFRESH,
});
