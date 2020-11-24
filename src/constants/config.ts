export enum Environment {
    Staging = "staging",
    Production = "production",
}

export const APP_VERSION = "0.0.1";
export const APP_SCHEME = "sea-eu-around";

export const ENVIRONMENT = Environment.Production;
export const DEBUG_MODE = ENVIRONMENT == Environment.Staging;

export const BACKEND_URL =
    ENVIRONMENT == Environment.Staging
        ? "https://api-staging.sea-eu-around.lad-dev.team"
        : "https://api.sea-eu-around.lad-dev.team";

/**
 * Specify the quality of compression, from 0 to 1.
 * 0 means compress for small size, 1 means compress for maximum quality.
 */
export const AVATAR_QUALITY = 0.75;

/**
 * The number of profiles fetched per request when scrolling in the Matching tab.
 */
export const PROFILES_FETCH_LIMIT = 8;

/**
 * The maximum number of spoken languages a user can select.
 * (limited for rendering reasons).
 */
export const MAX_SPOKEN_LANGUAGES = 8;
