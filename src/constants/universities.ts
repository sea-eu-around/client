import {CountryCode} from "../model/country-codes";

export type UniversityKey = "univ-cadiz" | "univ-brest" | "univ-gdansk" | "univ-malta" | "univ-kiel" | "univ-split";

export type University = {
    key: UniversityKey;
    country: CountryCode;
};

// List of partner universities
export const PARTNER_UNIVERSITIES: University[] = [
    {
        key: "univ-cadiz",
        country: "ES",
    },
    {
        key: "univ-brest",
        country: "FR",
    },
    {
        key: "univ-gdansk",
        country: "PL",
    },
    {
        key: "univ-malta",
        country: "MT",
    },
    {
        key: "univ-kiel",
        country: "DE",
    },
    {
        key: "univ-split",
        country: "HR",
    },
];
