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
export const GROUP_COVER_QUALITY = 0.8;

/**
 * Aspect ratios of various media.
 */
export const AVATAR_ASPECT: [number, number] = [1, 1];
export const GROUP_COVER_ASPECT: [number, number] = [2, 1];

/**
 * The number of resources fetched per request when scrolling in infinite scrolling containers.
 */
export const PROFILES_FETCH_LIMIT = 8; // Matching tab
export const ROOMS_FETCH_LIMIT = 10; // Messaging tab
export const MESSAGES_FETCH_LIMIT = 15; // Chat
export const HISTORY_FETCH_LIMIT = 12; // Match history tab
export const GROUPS_FETCH_LIMIT = 8;
export const GROUPS_POSTS_FETCH_LIMIT = 6;
export const POSTS_FEED_FETCH_LIMIT = 6;
export const GROUP_MEMBERS_FETCH_LIMIT = 15;

/**
 * The maximum depth for comments.
 * Depth indexing starts at 0 : for example 3 means that there will be 4 indentation levels.
 */
export const MAX_COMMENTS_DEPTH = 3;

/**
 * The buffer delay before sending a remote request when typing in a search bar (ms).
 */
export const SEARCH_BUFFER_DELAY = 250;

/**
 * The maximum number of spoken languages a user can select.
 */
export const MAX_SPOKEN_LANGUAGES = 8;

/**
 * The time before we ask the user to consent for cookies again.
 */
export const COOKIE_CONSENT_DURATION = 365 * 24 * 60 * 60;

/**
 * The amount of time before we fall back to the web version when trying to
 * redirect to the app.
 */
export const WEB_TO_APP_TIMEOUT = 5000;

/**
 * URL of the complete Terms & Conditions.
 */
export const TERMS_AND_CONDITIONS_URL =
    "https://sea-eu.org/wp-content/uploads/2021/01/SEA-EU-Around_Termsconditions-v2.pdf";

/**
 * The email address to which bug reports should be sent.
 */
export const BUG_REPORT_EMAIL_ADDRESS = "sea-eu.around@univ-brest.fr";
