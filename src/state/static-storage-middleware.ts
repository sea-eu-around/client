import {AnyAction, Middleware, Dispatch} from "redux";
import {storeStaticData} from "./persistent-storage/static";
import {
    LoadProfileInterestsSuccessAction,
    LoadProfileOffersSuccessAction,
    PROFILE_ACTION_TYPES,
} from "./profile/actions";
import {AppState} from "./types";

export const staticStorageMiddleware: Middleware<unknown, AppState> = () => (next: Dispatch<AnyAction>) => (
    action: AnyAction,
) => {
    switch (action.type) {
        case PROFILE_ACTION_TYPES.LOAD_PROFILE_INTERESTS_SUCCESS: {
            const {interests, fromCache} = action as LoadProfileInterestsSuccessAction;
            if (!fromCache) {
                console.log("Updating the interests cache.");
                storeStaticData("interests", interests);
            }
            break;
        }
        case PROFILE_ACTION_TYPES.LOAD_PROFILE_OFFERS_SUCCESS: {
            const {offers, fromCache} = action as LoadProfileOffersSuccessAction;
            if (!fromCache) {
                console.log("Updating the offers cache.");
                storeStaticData("offers", offers);
            }
            break;
        }
    }
    next(action);
};
