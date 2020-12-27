import AsyncStorage from "@react-native-async-storage/async-storage";

type StaticDataObject<T> = {
    updatedAt: string;
    data: T;
};

/**
 * Store the given data (with the current date) to unsecure persistent storage (unsuitable for sensitive info).
 * @param key - The name under which to store the given object.
 * @param data - An object to store.
 * @param cookieConsent - Whether or not the user has agreed to storing this type of data. This is here so we don't forget.
 */
export function storeStaticData<T>(key: string, data: T, cookieConsent: boolean): void {
    if (cookieConsent) {
        console.log(`Updating static storage '${key}'.`);

        // Store the data along with the date
        const storageObject = {
            updatedAt: new Date().toJSON(),
            data,
        };

        AsyncStorage.setItem(key, JSON.stringify(storageObject));
    }
}

/**
 * Clear the data at the given keys from persistent storage.
 * @param keys - The keys to clear.
 */
export function clearStaticData<T>(...keys: string[]): void {
    console.log(`Clearing static storage: ${keys.map((s) => `'${s}'`).join(", ")}.`);
    AsyncStorage.multiRemove(keys);
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
