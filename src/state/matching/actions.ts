import {convertDtoToHistoryItem, convertDtoToProfile} from "../../api/converters";
import {
    MatchActionResponseDto,
    MatchActionStatus,
    MatchHistoryItemDto,
    PaginatedRequestResponse,
    ResponseProfileDto,
    SuccessfulRequestResponse,
} from "../../api/dto";
import {UserProfile} from "../../model/user-profile";
import {requestBackend} from "../../api/utils";
import {MatchingFiltersState, AppThunk} from "../types";
import {HISTORY_FETCH_LIMIT, PROFILES_FETCH_LIMIT} from "../../constants/config";
import {HttpStatusCode} from "../../constants/http-status";
import {MatchHistoryItem} from "../../model/matching";

export enum MATCHING_ACTION_TYPES {
    SET_FILTERS = "MATCHING/SET_FILTERS",
    SET_OFFER_FILTER = "MATCHING/SET_OFFER_FILTER",

    FETCH_PROFILES_BEGIN = "MATCHING/FETCH_PROFILES_BEGIN",
    FETCH_PROFILES_FAILURE = "MATCHING/FETCH_PROFILES_FAILURE",
    FETCH_PROFILES_SUCCESS = "MATCHING/FETCH_PROFILES_SUCCESS",
    FETCH_PROFILES_REFRESH = "MATCHING/FETCH_PROFILES_REFRESH",

    LIKE_PROFILE_SUCCESS = "MATCHING/LIKE_PROFILE_SUCCESS",
    DISLIKE_PROFILE_SUCCESS = "MATCHING/DISLIKE_PROFILE_SUCCESS",
    BLOCK_PROFILE_SUCCESS = "MATCHING/BLOCK_PROFILE_SUCCESS",

    FETCH_MY_MATCHES_BEGIN = "MATCHING/FETCH_MY_MATCHES_BEGIN",
    FETCH_MY_MATCHES_FAILURE = "MATCHING/FETCH_MY_MATCHES_FAILURE",
    FETCH_MY_MATCHES_SUCCESS = "MATCHING/FETCH_MY_MATCHES_SUCCESS",

    FETCH_HISTORY_BEGIN = "MATCHING/FETCH_HISTORY_BEGIN",
    FETCH_HISTORY_FAILURE = "MATCHING/FETCH_HISTORY_FAILURE",
    FETCH_HISTORY_SUCCESS = "MATCHING/FETCH_HISTORY_SUCCESS",
    FETCH_HISTORY_REFRESH = "MATCHING/FETCH_HISTORY_REFRESH",

    ACTION_CANCEL_SUCCESS = "MATCHING/ACTION_CANCEL_SUCCESS",
    ACTION_CANCEL_FAILURE = "MATCHING/ACTION_CANCEL_FAILURE",

    SET_HISTORY_FILTERS = "MATCHING/SET_HISTORY_FILTERS",
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
    profile: UserProfile;
    matchStatus: MatchActionStatus;
    roomId: string | null;
};

export type DislikeProfileSuccessAction = {
    type: string;
    profile: UserProfile;
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

export type BeginFetchHistoryAction = {
    type: string;
};

export type FetchHistoryFailureAction = {
    type: string;
};

export type FetchHistorySuccessAction = {
    type: string;
    items: MatchHistoryItem[];
    canFetchMore: boolean;
};

export type FetchHistoryRefreshAction = {
    type: string;
};

export type SetHistoryFiltersAction = {
    type: string;
    filters: {[key: string]: boolean};
};

export type ActionCancelSuccessAction = {
    type: string;
    historyItemId: string;
};

export type ActionCancelFailureAction = {
    type: string;
    historyItemId: string;
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
    | FetchMyMatchesSuccessAction
    | SetHistoryFiltersAction
    | ActionCancelSuccessAction
    | ActionCancelFailureAction;

export const setOfferFilter = (offerId: string, value: boolean): SetOfferFilterAction => ({
    type: MATCHING_ACTION_TYPES.SET_OFFER_FILTER,
    offerId,
    value,
});

export const setMatchingFilters = (filters: Partial<MatchingFiltersState>): SetMatchingFiltersAction => ({
    type: MATCHING_ACTION_TYPES.SET_FILTERS,
    filters,
});

const beginFetchProfiles = (): BeginFetchProfilesAction => ({
    type: MATCHING_ACTION_TYPES.FETCH_PROFILES_BEGIN,
});

export const fetchProfiles = (): AppThunk => async (dispatch, getState) => {
    const {
        auth: {token},
        matching: {filters, profilesPagination},
    } = getState();

    if (!profilesPagination.canFetchMore) console.log("Cannot fetch more profiles");

    if (profilesPagination.fetching || !profilesPagination.canFetchMore) return;

    dispatch(beginFetchProfiles());

    // Replaces empty arrays with "undefined"
    function notEmpty<T>(t: Array<T>) {
        return t.length == 0 ? undefined : t;
    }

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
            page: profilesPagination.page,
            limit: PROFILES_FETCH_LIMIT,
            ...filterParams,
        },
        {},
        token,
        true,
    );

    if (response.status === HttpStatusCode.OK) {
        const paginated = response as PaginatedRequestResponse;
        const profiles = (paginated.data as ResponseProfileDto[]).map(convertDtoToProfile);
        const canFetchMore = paginated.meta.currentPage < paginated.meta.totalPages;
        console.log("fetched", profiles.length, "profiles");
        console.log("meta", paginated.meta);
        dispatch(fetchProfilesSuccess(profiles, canFetchMore));
    } else dispatch(fetchProfilesFailure());
};

const fetchProfilesFailure = (): FetchProfilesFailureAction => ({
    type: MATCHING_ACTION_TYPES.FETCH_PROFILES_FAILURE,
});

const fetchProfilesSuccess = (profiles: UserProfile[], canFetchMore: boolean): FetchProfilesSuccessAction => ({
    type: MATCHING_ACTION_TYPES.FETCH_PROFILES_SUCCESS,
    profiles,
    canFetchMore,
});

export const refreshFetchedProfiles = (): FetchProfilesRefreshAction => ({
    type: MATCHING_ACTION_TYPES.FETCH_PROFILES_REFRESH,
});

const likeProfileSuccess = (
    profile: UserProfile,
    matchStatus: MatchActionStatus,
    roomId: string | null,
): LikeProfileSuccessAction => ({
    type: MATCHING_ACTION_TYPES.LIKE_PROFILE_SUCCESS,
    profile,
    matchStatus,
    roomId,
});

export const likeProfile = (profile: UserProfile): AppThunk<Promise<MatchActionResponseDto | null>> => async (
    dispatch,
    getState,
) => {
    const token = getState().auth.token;
    const response = await requestBackend("matching/like", "POST", {}, {toProfileId: profile.id}, token, true);
    if (response.status === HttpStatusCode.OK) {
        const payload = (response as SuccessfulRequestResponse).data;
        const {status, roomId} = payload as MatchActionResponseDto;
        dispatch(likeProfileSuccess(profile, status, roomId));
        return {status, roomId};
    }
    return null;
};

const dislikeProfileSuccess = (profile: UserProfile): DislikeProfileSuccessAction => ({
    type: MATCHING_ACTION_TYPES.DISLIKE_PROFILE_SUCCESS,
    profile,
});

export const dislikeProfile = (profile: UserProfile): AppThunk => async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await requestBackend("matching/decline", "POST", {}, {toProfileId: profile.id}, token, true);
    if (response.status === HttpStatusCode.OK) dispatch(dislikeProfileSuccess(profile));
};

const blockProfileSuccess = (profileId: string): BlockProfileSuccessAction => ({
    type: MATCHING_ACTION_TYPES.BLOCK_PROFILE_SUCCESS,
    profileId,
});

export const blockProfile = (profileId: string): AppThunk => async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await requestBackend("matching/block", "POST", {}, {toProfileId: profileId}, token, true);
    if (response.status === HttpStatusCode.OK) dispatch(blockProfileSuccess(profileId));
};

const beginFetchMyMatches = (): BeginFetchMyMatchesAction => ({
    type: MATCHING_ACTION_TYPES.FETCH_MY_MATCHES_BEGIN,
});

const fetchMyMatchesFailure = (): FetchMyMatchesFailureAction => ({
    type: MATCHING_ACTION_TYPES.FETCH_MY_MATCHES_FAILURE,
});

const fetchMyMatchesSuccess = (profiles: UserProfile[]): FetchMyMatchesSuccessAction => ({
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

const beginFetchHistory = (): BeginFetchHistoryAction => ({
    type: MATCHING_ACTION_TYPES.FETCH_HISTORY_BEGIN,
});

const fetchHistoryFailure = (): FetchHistoryFailureAction => ({
    type: MATCHING_ACTION_TYPES.FETCH_HISTORY_FAILURE,
});

const fetchHistorySuccess = (items: MatchHistoryItem[], canFetchMore: boolean): FetchHistorySuccessAction => ({
    type: MATCHING_ACTION_TYPES.FETCH_HISTORY_SUCCESS,
    items,
    canFetchMore,
});

export const refreshFetchedHistory = (): FetchHistoryRefreshAction => ({
    type: MATCHING_ACTION_TYPES.FETCH_HISTORY_REFRESH,
});

export const fetchHistory = (search?: string): AppThunk => async (dispatch, getState) => {
    const {
        auth: {token},
        matching: {historyPagination, historyFilters},
    } = getState();

    if (historyPagination.fetching || !historyPagination.canFetchMore) return;

    dispatch(beginFetchHistory());

    const response = await requestBackend(
        "matching/history",
        "GET",
        {
            page: historyPagination.page,
            limit: HISTORY_FETCH_LIMIT,
            status: Object.keys(historyFilters).filter((k) => historyFilters[k]),
            search,
        },
        {},
        token,
        true,
    );

    if (response.status === HttpStatusCode.OK) {
        const paginated = response as PaginatedRequestResponse;
        const items = (paginated.data as MatchHistoryItemDto[]).map(convertDtoToHistoryItem);
        const canFetchMore = paginated.meta.currentPage < paginated.meta.totalPages;
        dispatch(fetchHistorySuccess(items, canFetchMore));
    } else dispatch(fetchHistoryFailure());
};

export const setHistoryFilters = (filters: {[key: string]: boolean}): SetHistoryFiltersAction => ({
    type: MATCHING_ACTION_TYPES.SET_HISTORY_FILTERS,
    filters,
});

const cancelActionFailure = (historyItemId: string): ActionCancelFailureAction => ({
    type: MATCHING_ACTION_TYPES.ACTION_CANCEL_FAILURE,
    historyItemId,
});

const cancelActionSuccess = (historyItemId: string): ActionCancelSuccessAction => ({
    type: MATCHING_ACTION_TYPES.ACTION_CANCEL_SUCCESS,
    historyItemId,
});

export const cancelMatchAction = (historyItemId: string): AppThunk<Promise<boolean>> => async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await requestBackend(
        "matching/cancel",
        "POST",
        {},
        {matchingEntityId: historyItemId},
        token,
        true,
    );

    if (response.status === HttpStatusCode.OK) {
        dispatch(cancelActionSuccess(historyItemId));
        return true;
    } else {
        dispatch(cancelActionFailure(historyItemId));
        return false;
    }
};
