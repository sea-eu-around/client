import {CountryCode} from "../model/country-codes";

export type UniversityKey = "univ-cadiz" | "univ-brest" | "univ-gdansk" | "univ-malta" | "univ-kiel" | "univ-split";

export type University = {
    key: UniversityKey;
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
