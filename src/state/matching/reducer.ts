import {UserProfile} from "../../model/user-profile";
import {
    MatchingState,
    MatchingAction,
    MATCHING_ACTION_TYPES,
    SetOfferFilterAction,
    SetMatchingFiltersAction,
    FetchProfilesSuccessAction,
    DislikeProfileSuccessAction,
    BlockProfileSuccessAction,
    LikeProfileSuccessAction,
    MatchingFiltersState,
} from "../types";

export const defaultMatchingFilters = (): MatchingFiltersState => ({
    offers: {},
    universities: [],
    degrees: [],
    languages: [],
    roles: [],
});

export const initialState: MatchingState = {
    filters: defaultMatchingFilters(),
    fetchedProfiles: [],
    fetchingProfiles: false,
    fetchingPage: 1,
    canFetchMore: true,
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
            return {...state, fetchingProfiles: true};
        }
        case MATCHING_ACTION_TYPES.FETCH_PROFILES_FAILURE: {
            return {...state, fetchingProfiles: false, canFetchMore: false};
        }
        case MATCHING_ACTION_TYPES.FETCH_PROFILES_SUCCESS: {
            const {profiles, canFetchMore} = <FetchProfilesSuccessAction>action;
            return {
                ...state,
                fetchedProfiles: state.fetchedProfiles.concat(profiles),
                fetchingProfiles: false,
                fetchingPage: state.fetchingPage + 1,
                canFetchMore,
            };
        }
        case MATCHING_ACTION_TYPES.FETCH_PROFILES_REFRESH: {
            return {
                ...state,
                fetchedProfiles: [],
                fetchingProfiles: false,
                fetchingPage: 1,
                canFetchMore: true,
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
        default:
            return state;
    }
};
