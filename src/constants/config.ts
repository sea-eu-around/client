/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Constants from "expo-constants";
import {NavigatorRoute} from "../navigation/types";

export enum Environment {
    Staging = "STAGING",
    Production = "PRODUCTION",
}

const extra = Constants.manifest.extra;

export const APP_VERSION: string = Constants.manifest.version!;
export const APP_SCHEME: string = Constants.manifest.scheme;
export const ENVIRONMENT: Environment = extra.TARGET;
export const DEBUG_MODE: boolean = extra.DEBUG;
export const CLIENT_URL: string = extra.CLIENT_URL;
export const SERVER_HOST: string = extra.SERVER_HOST;
export const BACKEND_URL: string = extra.SERVER_URL;

/**
 * Specify the quality of compression, from 0 to 1.
 * 0 means compress for small size, 1 means compress for maximum quality.
 */
export const AVATAR_QUALITY = 0.75;

/**
 * The number of resources fetched per request when scrolling in infinite scrolling containers.
 */
export const PROFILES_FETCH_LIMIT = 8; // Matching tab
export const ROOMS_FETCH_LIMIT = 10; // Messaging tab
export const MESSAGES_FETCH_LIMIT = 12; // Chat
export const HISTORY_FETCH_LIMIT = 12; // Match history tab

/**
 * The buffer delay before sending a remote request when typing in a search bar (ms).
 */
export const SEARCH_BUFFER_DELAY = 250;

/**
 * The maximum number of spoken languages a user can select.
 */
export const MAX_SPOKEN_LANGUAGES = 8;

/**
 * The navigation routes that require a connection to the chat socket.
 */
export const CHAT_CONNECTED_ROUTES: NavigatorRoute[] = ["ChatScreen", "ChatRoomsScreen"];

/**
 * The time before we ask the user to consent for cookies again.
 */
export const COOKIE_CONSENT_DURATION = 365 * 24 * 60 * 60;
