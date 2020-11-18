import {convertDtoToProfile} from "../../api/converters";
import {FetchProfilesResponseDto} from "../../api/dto";
import {UserProfile} from "../../model/user-profile";
import {requestBackend} from "../../api/utils";
import store from "../store";
import {
    SetOfferFilterAction,
    MATCHING_ACTION_TYPES,
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
import {PROFILES_FETCH_LIMIT} from "../../constants/config";

export const setOfferFilter = (offerId: string, value: boolean): SetOfferFilterAction => ({
    type: MATCHING_ACTION_TYPES.SET_OFFER_FILTER,
    offerId,
    value,
});

export const setMatchingFilters = (filters: Partial<MatchingFiltersState>): SetMatchingFiltersAction => ({
    type: MATCHING_ACTION_TYPES.SET_FILTERS,
    filters,
});

export const beginFetchProfiles = (): BeginFetchProfilesAction => ({
    type: MATCHING_ACTION_TYPES.FETCH_PROFILES_BEGIN,
});

export const fetchProfiles = (): AppThunk => async (dispatch) => {
    const state: MatchingState = store.getState().matching;
    if (state.fetchingProfiles || !state.canFetchMore) return;
    const filters = state.filters;

    dispatch(beginFetchProfiles());

    function nonEmptyOrUndef<T>(t: Array<T>) {
        return t.length == 0 ? undefined : t;
    }

    const response = await requestBackend(
        "profiles",
        "GET",
        {
            page: state.fetchingPage,
            limit: PROFILES_FETCH_LIMIT,
            universities: nonEmptyOrUndef(filters.universities),
            spokenLanguages: nonEmptyOrUndef(filters.languages),
            degrees: nonEmptyOrUndef(filters.degrees),
        },
        {},
        true,
        true,
    );

    if (response.success) {
        const resp = (response as unknown) as FetchProfilesResponseDto;
        const canFetchMore = resp.meta.currentPage < resp.meta.totalPages;
        dispatch(fetchProfilesSuccess(resp.data.map(convertDtoToProfile), canFetchMore));
    } else dispatch(fetchProfilesFailure());
};

export const fetchProfilesFailure = (): FetchProfilesFailureAction => ({
    type: MATCHING_ACTION_TYPES.FETCH_PROFILES_FAILURE,
});

export const fetchProfilesSuccess = (profiles: UserProfile[], canFetchMore: boolean): FetchProfilesSuccessAction => ({
    type: MATCHING_ACTION_TYPES.FETCH_PROFILES_SUCCESS,
    profiles,
    canFetchMore,
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
