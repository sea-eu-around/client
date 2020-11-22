import {CountryCode} from "../model/country-codes";

export type UniversityKey = "univ-cadiz" | "univ-brest" | "univ-gdansk" | "univ-malta" | "univ-kiel" | "univ-split";

export type University = {
    key: UniversityKey;
    domain: string;
    country: CountryCode;
};

// List of partner universities
export const PARTNER_UNIVERSITIES: University[] = [
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
];
