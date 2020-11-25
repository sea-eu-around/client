import {AnyAction, Middleware, Dispatch} from "redux";
import {
    AppState,
    LoadProfileInterestsSuccessAction,
    LoadProfileOffersSuccessAction,
    PROFILE_ACTION_TYPES,
} from "./types";
import AsyncStorage from "@react-native-async-storage/async-storage";

type StaticDataObject<T> = {
    updatedAt: string;
    data: T;
};

/**
 * Store the given data (with the current date) to unsecure persistent storage (unsuitable for sensitive info).
 * @param key - The name under which to store the given object.
 * @param data - An object to store.
 */
function storeStaticData<T>(key: string, data: T) {
    console.log(`Updating cache entry for '${key}'.`);

    // Store the data along with the date
    const storageObject = {
        updatedAt: new Date().toJSON(),
        data,
    };

    console.log("date", storageObject.updatedAt);

    AsyncStorage.setItem(key, JSON.stringify(storageObject));
}

/**
 * Read static data that was stored under a given key.
 * @param key - A key that identifies the resource we want to get (@see storeStaticData).
 * @return The object along with the date at which it was stored (in JSON format), or false if nothing was stored under this key.
 */
export async function readCachedStaticData<T>(key: string): Promise<false | StaticDataObject<T>> {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : false;
}

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
