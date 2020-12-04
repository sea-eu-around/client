import * as SecureStore from "expo-secure-store";
import {TokenDto} from "../../api/dto";
import {CredentialsStorageObject} from "../../types";

// Note that we have to fall back to AsyncStorage on web since SecureStore is not available there.

/**
 * Override auth information in secure storage. Data will be stored if expo-secure-store is available on the device.
 * @param email - The user's email.
 * @param token - The user's authentication token.
 */
export function storeAuthInformation(email: string, token: TokenDto): void {
    // Use expo-secure-store to securely store sensitive data
    SecureStore.isAvailableAsync().then((available: boolean) => {
        if (available) {
            const toStore: CredentialsStorageObject = {email, token};
            SecureStore.setItemAsync("auth", JSON.stringify(toStore));
        }
    });
}

/**
 * Remove the user's auth information from the secure storage.
 */
export function discardAuthInformation(): void {
    SecureStore.isAvailableAsync().then((available: boolean) => {
        if (available) SecureStore.deleteItemAsync("auth");
    });
}

/**
 * Read auth information from secure storage, if available on the device.
 * @return an object containing the email and auth token, or false if SecureStore is unavailable or no data was stored.
 */
export async function readCachedCredentials(): Promise<false | CredentialsStorageObject> {
    const available = await SecureStore.isAvailableAsync();
    if (available) {
        const raw = await SecureStore.getItemAsync("auth");
        return raw ? JSON.parse(raw) : false;
    } else return false;
}
