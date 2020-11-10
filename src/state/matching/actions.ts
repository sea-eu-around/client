import {
    SetOfferFilterAction,
    MATCHING_ACTION_TYPES,
    ResetMatchingFiltersAction,
    SetMatchingFiltersAction,
    MatchingFiltersState,
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
