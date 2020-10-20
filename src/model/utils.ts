import {PARTNER_UNIVERSITIES, University} from "../constants/universities";

/**
 * Attempts to extract names from a given email.
 * @param email A valid email address.
 * @returns the first and last name if they were successfuly extracted, null otherwise.
 */
export function extractNamesFromEmail(email: string): {firstname: string; lastname: string} | null {
    const splitName = email.split("@")[0].split(".");
    const capitalize = (str: string) => (str.length == 0 ? str : str[0].toUpperCase() + str.slice(1));
    return splitName.length >= 2
        ? {
              firstname: capitalize(splitName[0]),
              lastname: capitalize(splitName[1]),
          }
        : null;
}

/**
 * Extracts a partner university from a given email.
 * @param email A valid email address.
 * @returns a University object if one matches the given email, null otherwise.
 */
export function getUniversityFromEmail(email: string): University | null {
    const split = email.split("@");
    if (split.length > 0) {
        const domain = split[1].trim();
        return PARTNER_UNIVERSITIES.find((uni: University) => uni.domain == domain) || null;
    }
    return null;
}
