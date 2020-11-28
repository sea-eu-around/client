import {convertDtoToProfile} from "../../api/converters";
import {
    LikeProfileResponseDto,
    PaginatedRequestResponse,
    ResponseProfileDto,
    SuccessfulRequestResponse,
} from "../../api/dto";
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
    FetchMyMatchesSuccessAction,
    FetchMyMatchesFailureAction,
    BeginFetchMyMatchesAction,
} from "../types";
import {PROFILES_FETCH_LIMIT} from "../../constants/config";
import {HttpStatusCode} from "../../constants/http-status";

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

    dispatch(beginFetchProfiles());

    // Replaces empty arrays with "undefined"
    function notEmpty<T>(t: Array<T>) {
        return t.length == 0 ? undefined : t;
    }

    const filters = state.filters;
    const offers = Object.keys(filters.offers).filter((k) => filters.offers[k] === true);

    const filterParams = {
        universities: notEmpty(filters.universities),
        spokenLanguages: notEmpty(filters.languages),
        degrees: notEmpty(filters.degrees),
        types: notEmpty(filters.types),
        offers: notEmpty(offers),
    };

    const response = await requestBackend(
        "profiles",
        "GET",
        {
            page: state.fetchingPage,
            limit: PROFILES_FETCH_LIMIT,
            ...filterParams,
        },
        {},
        true,
    );

    if (response.status === HttpStatusCode.OK) {
        const paginated = response as PaginatedRequestResponse;
        const profiles = (paginated.data as ResponseProfileDto[]).map(convertDtoToProfile);
        const canFetchMore = paginated.meta.currentPage < paginated.meta.totalPages;
        dispatch(fetchProfilesSuccess(profiles, canFetchMore));
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

export const likeProfileSuccess = (
    profileId: string,
    matchStatus: LikeProfileResponseDto,
): LikeProfileSuccessAction => ({
    type: MATCHING_ACTION_TYPES.LIKE_PROFILE_SUCCESS,
    profileId,
    matchStatus,
});

export const likeProfile = (profileId: string): AppThunk => async (dispatch) => {
    const response = await requestBackend("matching/like", "POST", {}, {toUserId: profileId}, true);
    if (response.status === HttpStatusCode.OK) {
        const payload = (response as SuccessfulRequestResponse).data;
        const matchStatus = payload as LikeProfileResponseDto;
        dispatch(likeProfileSuccess(profileId, matchStatus));
    }
};

export const dislikeProfileSuccess = (profileId: string): DislikeProfileSuccessAction => ({
    type: MATCHING_ACTION_TYPES.DISLIKE_PROFILE_SUCCESS,
    profileId,
});

export const dislikeProfile = (profileId: string): AppThunk => async (dispatch) => {
    const response = await requestBackend("matching/decline", "POST", {}, {toUserId: profileId}, true);
    if (response.status === HttpStatusCode.OK) dispatch(dislikeProfileSuccess(profileId));
};

export const blockProfileSuccess = (profileId: string): BlockProfileSuccessAction => ({
    type: MATCHING_ACTION_TYPES.BLOCK_PROFILE_SUCCESS,
    profileId,
});

export const blockProfile = (profileId: string): AppThunk => async (dispatch) => {
    const response = await requestBackend("matching/block", "POST", {}, {toProfileId: profileId}, true);
    if (response.status === HttpStatusCode.OK) dispatch(blockProfileSuccess(profileId));
};

export const beginFetchMyMatches = (): BeginFetchMyMatchesAction => ({
    type: MATCHING_ACTION_TYPES.FETCH_MY_MATCHES_BEGIN,
});

export const fetchMyMatchesFailure = (): FetchMyMatchesFailureAction => ({
    type: MATCHING_ACTION_TYPES.FETCH_MY_MATCHES_FAILURE,
});

export const fetchMyMatchesSuccess = (profiles: UserProfile[]): FetchMyMatchesSuccessAction => ({
    type: MATCHING_ACTION_TYPES.FETCH_MY_MATCHES_SUCCESS,
    profiles,
});

export const fetchMyMatches = (): AppThunk => async (dispatch) => {
    const state: MatchingState = store.getState().matching;
    if (state.fetchingMyMatches) return;

    dispatch(beginFetchMyMatches());

    const response = await requestBackend("matching", "GET", {}, {}, true);

    if (response.status === HttpStatusCode.OK) {
        const payload = (response as SuccessfulRequestResponse).data;
        const profiles = (payload as ResponseProfileDto[]).map(convertDtoToProfile);
        dispatch(fetchMyMatchesSuccess(profiles));
    } else dispatch(fetchMyMatchesFailure());
};
