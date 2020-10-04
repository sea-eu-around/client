import {CountryCode} from "../model/country-codes";

export type University = {
    key: string;
    domain: string;
    country: CountryCode;
};

// TODO this data should come from the server so it is easy to add universities (no app update required)
// List of partner universities
export const PARTNER_UNIVERSITIES = [
    {
        key: "univ-cadiz",
        domain: "uca.es",
        country: "ES",
    },
    {
        key: "univ-brest",
        domain: "univ-brest.fr",
        country: "FR",
    },
    {
        key: "univ-gdansk",
        domain: "ug.edu.pl",
        country: "PL",
    },
    {
        key: "univ-malta",
        domain: "um.edu.mt",
        country: "MT",
    },
    {
        key: "univ-kiel",
        domain: "kms.uni-kiel.de",
        country: "DE",
    },
    {
        key: "univ-split",
        domain: "unist.hr",
        country: "HR",
    },
] as University[];

export function getUniversityFromEmail(email: string): University | null {
    let split = email.split("@");
    if (split.length > 0) {
        const domain = split[1].trim();
        return PARTNER_UNIVERSITIES.find((uni: University) => uni.domain == domain) || null;
    }
    return null;
}
