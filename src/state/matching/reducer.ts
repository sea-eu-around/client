import {MATCH_ACTION_HISTORY_STATUSES} from "../../api/dto";
import {UserProfile} from "../../model/user-profile";
import {AUTH_ACTION_TYPES} from "../auth/actions";
import {initialPaginatedState, MatchingFiltersState, MatchingState} from "../types";
import {
    MatchingAction,
    MATCHING_ACTION_TYPES,
    SetOfferFilterAction,
    SetMatchingFiltersAction,
    FetchProfilesSuccessAction,
    DislikeProfileSuccessAction,
    BlockProfileSuccessAction,
    LikeProfileSuccessAction,
    FetchMyMatchesSuccessAction,
    FetchHistorySuccessAction,
    SetHistoryFiltersAction,
} from "./actions";

export const defaultMatchingFilters = (): MatchingFiltersState => ({
    offers: {},
    universities: [],
    degrees: [],
    languages: [],
    types: [],
});

const initialHistoryFilters = () => {
    const filters: {[key: string]: boolean} = {};
    MATCH_ACTION_HISTORY_STATUSES.forEach((k) => (filters[k] = true));
    return filters;
};

export const initialState: MatchingState = {
    filters: defaultMatchingFilters(),
    fetchedProfiles: [],
    profilesPagination: initialPaginatedState(),
    historyPagination: initialPaginatedState(),
    historyFilters: initialHistoryFilters(),
    historyItems: [],
    myMatches: [],
    fetchingMyMatches: false,
};

export const matchingReducer = (state: MatchingState = initialState, action: MatchingAction): MatchingState => {
    switch (action.type) {
        case MATCHING_ACTION_TYPES.SET_OFFER_FILTER: {
            const {offerId, value} = <SetOfferFilterAction>action;
            return {
                ...state,
                filters: {
                    ...state.filters,
                    offers: {...state.filters.offers, [offerId]: value},
                },
            };
        }
        case MATCHING_ACTION_TYPES.SET_FILTERS: {
            const {filters} = <SetMatchingFiltersAction>action;
            return {
                ...state,
                filters: {...state.filters, ...filters},
            };
        }
        case MATCHING_ACTION_TYPES.FETCH_PROFILES_BEGIN: {
            return {...state, profilesPagination: {...state.profilesPagination, fetching: true}};
        }
        case MATCHING_ACTION_TYPES.FETCH_PROFILES_FAILURE: {
            return {...state, profilesPagination: {...state.profilesPagination, fetching: false, canFetchMore: false}};
        }
        case MATCHING_ACTION_TYPES.FETCH_PROFILES_SUCCESS: {
            const {profiles, canFetchMore} = <FetchProfilesSuccessAction>action;
            const pagination = state.profilesPagination;
            return {
                ...state,
                fetchedProfiles: state.fetchedProfiles.concat(profiles),
                profilesPagination: {...pagination, fetching: false, page: pagination.page + 1, canFetchMore},
            };
        }
        case MATCHING_ACTION_TYPES.FETCH_PROFILES_REFRESH: {
            return {
                ...state,
                fetchedProfiles: [],
                profilesPagination: initialPaginatedState(),
            };
        }
        case MATCHING_ACTION_TYPES.FETCH_MY_MATCHES_BEGIN: {
            return {...state, fetchingMyMatches: true};
        }
        case MATCHING_ACTION_TYPES.FETCH_MY_MATCHES_FAILURE: {
            return {...state, fetchingMyMatches: false};
        }
        case MATCHING_ACTION_TYPES.FETCH_MY_MATCHES_SUCCESS: {
            const {profiles} = <FetchMyMatchesSuccessAction>action;
            return {
                ...state,
                myMatches: profiles,
                fetchingMyMatches: false,
            };
        }
        case MATCHING_ACTION_TYPES.LIKE_PROFILE_SUCCESS: {
            const {profileId} = <LikeProfileSuccessAction>action;
            return {
                ...state,
                fetchedProfiles: state.fetchedProfiles.filter((p: UserProfile) => p.id != profileId),
            };
        }
        case MATCHING_ACTION_TYPES.DISLIKE_PROFILE_SUCCESS: {
            const {profileId} = <DislikeProfileSuccessAction>action;
            return {
                ...state,
                fetchedProfiles: state.fetchedProfiles.filter((p: UserProfile) => p.id != profileId),
            };
        }
        case MATCHING_ACTION_TYPES.BLOCK_PROFILE_SUCCESS: {
            const {profileId} = <BlockProfileSuccessAction>action;
            return {
                ...state,
                fetchedProfiles: state.fetchedProfiles.filter((p: UserProfile) => p.id != profileId),
            };
        }
        case MATCHING_ACTION_TYPES.FETCH_HISTORY_BEGIN: {
            return {...state, historyPagination: {...state.historyPagination, fetching: true}};
        }
        case MATCHING_ACTION_TYPES.FETCH_HISTORY_FAILURE: {
            return {...state, historyPagination: {...state.historyPagination, fetching: false, canFetchMore: false}};
        }
        case MATCHING_ACTION_TYPES.FETCH_HISTORY_SUCCESS: {
            const {items, canFetchMore} = <FetchHistorySuccessAction>action;
            const pagination = state.historyPagination;
            return {
                ...state,
                historyItems: state.historyItems.concat(items),
                historyPagination: {...pagination, fetching: false, page: pagination.page + 1, canFetchMore},
            };
        }
        case MATCHING_ACTION_TYPES.FETCH_HISTORY_REFRESH: {
            return {
                ...state,
                historyItems: [],
                historyPagination: initialPaginatedState(),
            };
        }
        case MATCHING_ACTION_TYPES.SET_HISTORY_FILTERS: {
            const {filters} = action as SetHistoryFiltersAction;
            return {
                ...state,
                historyFilters: {...state.historyFilters, ...filters},
            };
        }
        case AUTH_ACTION_TYPES.LOG_OUT: {
            return {
                ...state,
                filters: defaultMatchingFilters(),
                fetchedProfiles: [],
                profilesPagination: initialPaginatedState(),
                myMatches: [],
                fetchingMyMatches: false,
            };
        }
        default:
            return state;
    }
};
