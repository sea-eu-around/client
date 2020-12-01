/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Constants from "expo-constants";

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

/**
 * The maximum number of spoken languages a user can select.
 * (limited for rendering reasons).
 */
export const MAX_SPOKEN_LANGUAGES = 8;
