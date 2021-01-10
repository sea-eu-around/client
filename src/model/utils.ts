import {OfferValueDto} from "../api/dto";
import {UserProfile} from "./user-profile";

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
 * Filter only the offers that match a given profile.
 * @param offers A list of offer values.
 * @param profile A profile
 * @returns the offers that target the given profile.
 */
export function getMatchingOffers(offers: OfferValueDto[], profile: UserProfile): OfferValueDto[] {
    return offers.filter((o: OfferValueDto) => {
        if (
            (!o.allowFemale && profile.gender === "female") ||
            (!o.allowMale && profile.gender === "male") ||
            (!o.allowOther && profile.gender === "other") ||
            (!o.allowStaff && profile.type === "staff") ||
            (!o.allowStudent && profile.type === "student")
        )
            return false;
        return true;
    });
}
