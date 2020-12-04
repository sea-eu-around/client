import AsyncStorage from "@react-native-async-storage/async-storage";
import {TokenDto} from "../../api/dto";
import {CredentialsStorageObject} from "../../types";

/**
 * Override auth information in secure.
 * @param email - The user's email.
 * @param token - The user's authentication token.
 */
export function storeAuthInformation(email: string, token: TokenDto): void {
    const toStore: CredentialsStorageObject = {email, token};
    AsyncStorage.setItem("auth", JSON.stringify(toStore));
}

/**
 * Remove the user's auth information from storage.
 */
export function discardAuthInformation(): void {
    AsyncStorage.removeItem("auth");
}

/**
 * Read auth information from storage.
 * @return an object containing the email and auth token, or false if SecureStore is unavailable or no data was stored.
 */
export async function readCachedCredentials(): Promise<false | CredentialsStorageObject> {
    const raw = await AsyncStorage.getItem("auth");
    return raw ? JSON.parse(raw) : false;
}
