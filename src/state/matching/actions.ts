import {convertDtoToProfile} from "../../api/converters";
import {
    LikeProfileResponseDto,
    PaginatedRequestResponse,
    ResponseProfileDto,
    SuccessfulRequestResponse,
} from "../../api/dto";
import {UserProfile} from "../../model/user-profile";
import {requestBackend} from "../../api/utils";
import {MatchingFiltersState, AppThunk} from "../types";
import {PROFILES_FETCH_LIMIT} from "../../constants/config";
import {HttpStatusCode} from "../../constants/http-status";

export enum MATCHING_ACTION_TYPES {
    SET_FILTERS = "MATCHING/SET_FILTERS",
    SET_OFFER_FILTER = "MATCHING/SET_OFFER_FILTER",
    FETCH_PROFILES_BEGIN = "MATCHING/FETCH_PROFILES_BEGIN",
    FETCH_PROFILES_SUCCESS = "MATCHING/FETCH_PROFILES_SUCCESS",
    FETCH_PROFILES_FAILURE = "MATCHING/FETCH_PROFILES_FAILURE",
    FETCH_PROFILES_REFRESH = "MATCHING/FETCH_PROFILES_REFRESH",
    LIKE_PROFILE_SUCCESS = "MATCHING/LIKE_PROFILE_SUCCESS",
    DISLIKE_PROFILE_SUCCESS = "MATCHING/DISLIKE_PROFILE_SUCCESS",
    BLOCK_PROFILE_SUCCESS = "MATCHING/BLOCK_PROFILE_SUCCESS",
    FETCH_MY_MATCHES_BEGIN = "MATCHING/FETCH_MY_MATCHES_BEGIN",
    FETCH_MY_MATCHES_FAILURE = "MATCHING/FETCH_MY_MATCHES_FAILURE",
    FETCH_MY_MATCHES_SUCCESS = "MATCHING/FETCH_MY_MATCHES_SUCCESS",
}

export type SetOfferFilterAction = {
    type: string;
    offerId: string;
    value: boolean;
};

export type ResetMatchingFiltersAction = {
    type: string;
};

export type SetMatchingFiltersAction = {
    type: string;
    filters: Partial<MatchingFiltersState>;
};

export type LikeProfileSuccessAction = {
    type: string;
    profileId: string;
    matchStatus: LikeProfileResponseDto;
};

export type DislikeProfileSuccessAction = {
    type: string;
    profileId: string;
};

export type BlockProfileSuccessAction = {
    type: string;
    profileId: string;
};

export type FetchProfilesRefreshAction = {
    type: string;
};

export type BeginFetchProfilesAction = {
    type: string;
};

export type FetchProfilesFailureAction = {
    type: string;
};

export type FetchProfilesSuccessAction = {
    type: string;
    profiles: UserProfile[];
    canFetchMore: boolean;
};

export type BeginFetchMyMatchesAction = {
    type: string;
};

export type FetchMyMatchesFailureAction = {
    type: string;
};

export type FetchMyMatchesSuccessAction = {
    type: string;
    profiles: UserProfile[];
};

export type MatchingAction =
    | SetOfferFilterAction
    | SetMatchingFiltersAction
    | ResetMatchingFiltersAction
    | BeginFetchProfilesAction
    | FetchProfilesSuccessAction
    | FetchProfilesFailureAction
    | FetchProfilesRefreshAction
    | LikeProfileSuccessAction
    | DislikeProfileSuccessAction
    | BlockProfileSuccessAction
    | BeginFetchMyMatchesAction
    | FetchMyMatchesFailureAction
    | FetchMyMatchesSuccessAction;

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

export const fetchProfiles = (): AppThunk => async (dispatch, getState) => {
    const {
        auth: {token},
        matching,
    } = getState();

    if (matching.fetchingProfiles || !matching.canFetchMore) return;

    dispatch(beginFetchProfiles());

    // Replaces empty arrays with "undefined"
    function notEmpty<T>(t: Array<T>) {
        return t.length == 0 ? undefined : t;
    }

    const filters = matching.filters;
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
            page: matching.fetchingPage,
            limit: PROFILES_FETCH_LIMIT,
            ...filterParams,
        },
        {},
        token,
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

export const likeProfile = (profileId: string): AppThunk => async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await requestBackend("matching/like", "POST", {}, {toUserId: profileId}, token);
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

export const dislikeProfile = (profileId: string): AppThunk => async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await requestBackend("matching/decline", "POST", {}, {toUserId: profileId}, token);
    if (response.status === HttpStatusCode.OK) dispatch(dislikeProfileSuccess(profileId));
};

export const blockProfileSuccess = (profileId: string): BlockProfileSuccessAction => ({
    type: MATCHING_ACTION_TYPES.BLOCK_PROFILE_SUCCESS,
    profileId,
});

export const blockProfile = (profileId: string): AppThunk => async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await requestBackend("matching/block", "POST", {}, {toProfileId: profileId}, token);
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

export const fetchMyMatches = (): AppThunk => async (dispatch, getState) => {
    const {
        auth: {token},
        matching,
    } = getState();
    if (matching.fetchingMyMatches) return;

    dispatch(beginFetchMyMatches());

    const response = await requestBackend("matching", "GET", {}, {}, token);

    if (response.status === HttpStatusCode.OK) {
        const payload = (response as SuccessfulRequestResponse).data;
        const profiles = (payload as ResponseProfileDto[]).map(convertDtoToProfile);
        dispatch(fetchMyMatchesSuccess(profiles));
    } else dispatch(fetchMyMatchesFailure());
};
