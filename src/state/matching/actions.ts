import {requestBackend} from "../../api/utils";
import {
    SetOfferFilterAction,
    MATCHING_ACTION_TYPES,
    ResetMatchingFiltersAction,
    SetMatchingFiltersAction,
    MatchingFiltersState,
    AppThunk,
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

export const likeProfile = (profileId: string): AppThunk => async () => {
    await requestBackend("matching/like", "POST", {}, {toProfileId: profileId}, true, true);
};

export const dislikeProfile = (profileId: string): AppThunk => async () => {
    await requestBackend("matching/decline", "POST", {}, {toProfileId: profileId}, true, true);
};
