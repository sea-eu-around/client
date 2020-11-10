import {DEGREES} from "../../constants/profile-constants";
import {PARTNER_UNIVERSITIES, University} from "../../constants/universities";
import {
    MatchingState,
    MatchingAction,
    MATCHING_ACTION_TYPES,
    SetOfferFilterAction,
    SetMatchingFiltersAction,
} from "../types";

export const initialState: MatchingState = {
    filters: {
        offers: {},
        universities: [],
        degrees: DEGREES,
        languages: [],
    },
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
        default:
            return state;
    }
};
