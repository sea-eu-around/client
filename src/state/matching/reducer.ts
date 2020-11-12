import {UserProfileDto} from "../../api/dto";
import {DEGREES} from "../../constants/profile-constants";
import {PARTNER_UNIVERSITIES, University} from "../../constants/universities";
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
} from "../types";

export const initialState: MatchingState = {
    filters: {
        offers: {},
        universities: [],
        degrees: DEGREES,
        languages: [],
    },
    fetchedProfiles: [],
    fetchingProfiles: false,
    fetchingPage: 1,
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
        case MATCHING_ACTION_TYPES.RESET_MATCHING_FILTERS: {
            return {
                ...state,
                filters: {
                    offers: {},
                    universities: PARTNER_UNIVERSITIES.map((univ: University) => univ.key),
                    degrees: DEGREES,
                    languages: [],
                },
            };
        }
        case MATCHING_ACTION_TYPES.FETCH_PROFILES_BEGIN: {
            return {...state, fetchingProfiles: true};
        }
        case MATCHING_ACTION_TYPES.FETCH_PROFILES_FAILURE: {
            return {...state, fetchingProfiles: false};
        }
        case MATCHING_ACTION_TYPES.FETCH_PROFILES_SUCCESS: {
            const {profiles} = <FetchProfilesSuccessAction>action;
            return {
                ...state,
                fetchedProfiles: state.fetchedProfiles.concat(profiles),
                fetchingProfiles: false,
                fetchingPage: state.fetchingPage + 1,
            };
        }
        case MATCHING_ACTION_TYPES.FETCH_PROFILES_REFRESH: {
            return {
                ...state,
                fetchedProfiles: [],
                fetchingProfiles: false,
                fetchingPage: 1,
            };
        }
        case MATCHING_ACTION_TYPES.LIKE_PROFILE_SUCCESS: {
            const {profileId} = <LikeProfileSuccessAction>action;
            return {
                ...state,
                fetchedProfiles: state.fetchedProfiles.filter((p: UserProfileDto) => p.id != profileId),
            };
        }
        case MATCHING_ACTION_TYPES.DISLIKE_PROFILE_SUCCESS: {
            const {profileId} = <DislikeProfileSuccessAction>action;
            return {
                ...state,
                fetchedProfiles: state.fetchedProfiles.filter((p: UserProfileDto) => p.id != profileId),
            };
        }
        case MATCHING_ACTION_TYPES.BLOCK_PROFILE_SUCCESS: {
            const {profileId} = <BlockProfileSuccessAction>action;
            return {
                ...state,
                fetchedProfiles: state.fetchedProfiles.filter((p: UserProfileDto) => p.id != profileId),
            };
        }
        default:
            return state;
    }
};
