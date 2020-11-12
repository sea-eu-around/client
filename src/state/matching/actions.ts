import {UserProfileDto} from "../../api/dto";
import {requestBackend} from "../../api/utils";
import store from "../store";
import {
    SetOfferFilterAction,
    MATCHING_ACTION_TYPES,
    ResetMatchingFiltersAction,
    SetMatchingFiltersAction,
    MatchingFiltersState,
    AppThunk,
    DislikeProfileSuccessAction,
    BlockProfileSuccessAction,
    FetchProfilesFailureAction,
    FetchProfilesSuccessAction,
    FetchProfilesRefreshAction,
    BeginFetchProfilesAction,
    MatchingState,
    LikeProfileSuccessAction,
} from "../types";

export const setOfferFilter = (offerId: string, value: boolean): SetOfferFilterAction => ({
    type: MATCHING_ACTION_TYPES.SET_OFFER_FILTER,
    offerId,
    value,
});

export const setMatchingFilters = (filters: Partial<MatchingFiltersState>): SetMatchingFiltersAction => ({
    type: MATCHING_ACTION_TYPES.SET_FILTERS,
    filters,
});

export const resetMatchingFilters = (): ResetMatchingFiltersAction => ({
    type: MATCHING_ACTION_TYPES.RESET_MATCHING_FILTERS,
});

export const beginFetchProfiles = (): BeginFetchProfilesAction => ({
    type: MATCHING_ACTION_TYPES.FETCH_PROFILES_BEGIN,
});

export const fetchProfiles = (): AppThunk => async (dispatch) => {
    const state: MatchingState = store.getState().matching;
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
    type: MATCHING_ACTION_TYPES.FETCH_PROFILES_FAILURE,
});

export const fetchProfilesSuccess = (profiles: UserProfileDto[]): FetchProfilesSuccessAction => ({
    type: MATCHING_ACTION_TYPES.FETCH_PROFILES_SUCCESS,
    profiles,
});

export const refreshFetchedProfiles = (): FetchProfilesRefreshAction => ({
    type: MATCHING_ACTION_TYPES.FETCH_PROFILES_REFRESH,
});

export const likeProfileSuccess = (profileId: string): LikeProfileSuccessAction => ({
    type: MATCHING_ACTION_TYPES.LIKE_PROFILE_SUCCESS,
    profileId,
});

export const likeProfile = (profileId: string): AppThunk => async (dispatch) => {
    const response = await requestBackend("matching/like", "POST", {}, {toProfileId: profileId}, true, true);
    if (response.success) dispatch(likeProfileSuccess(profileId));
};

export const dislikeProfileSuccess = (profileId: string): DislikeProfileSuccessAction => ({
    type: MATCHING_ACTION_TYPES.DISLIKE_PROFILE_SUCCESS,
    profileId,
});

export const dislikeProfile = (profileId: string): AppThunk => async (dispatch) => {
    const response = await requestBackend("matching/decline", "POST", {}, {toProfileId: profileId}, true, true);
    if (response.success) dispatch(dislikeProfileSuccess(profileId));
};

export const blockProfileSuccess = (profileId: string): BlockProfileSuccessAction => ({
    type: MATCHING_ACTION_TYPES.BLOCK_PROFILE_SUCCESS,
    profileId,
});

export const blockProfile = (profileId: string): AppThunk => async (dispatch) => {
    const response = await requestBackend("matching/block", "POST", {}, {toProfileId: profileId}, true, true);
    if (response.success) dispatch(blockProfileSuccess(profileId));
};
