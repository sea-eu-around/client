import {NumberLiteralType} from "typescript";

/**
 * University education fields as specified by the International Standard Classification of Education (ISCED), 2013.
 * @see {@link https://ec.europa.eu/eurostat/statistics-explained/index.php/International_Standard_Classification_of_Education_(ISCED)}
 * See translations for the actual name of each field.
 */
export const EDUCATION_FIELDS = [
    "field-00",
    "field-01",
    "field-02",
    "field-03",
    "field-04",
    "field-05",
    "field-06",
    "field-07",
    "field-08",
    "field-09",
    "field-10",
];

export const LEVELS_OF_STUDY = ["L1", "L2", "L3", "M1", "M2", "PhD"];

export const ROLES = ["student", "staff"];
export type Role = typeof ROLES[number];

export const STAFF_ROLES = ["teaching", "researcher", "supporting", "administrative", "technical", "ambassador"];
export type StaffRole = typeof STAFF_ROLES[number];

export const GENDERS = ["M", "F"];
export type Gender = typeof GENDERS[number];

export const HOBBIES = [
    "3D printing",
    "Acrobatics",
    "Acting",
    "Amateur radio",
    "Animation",
    "Aquascaping",
    "Astrology",
    "Astronomy",
    "Baking",
    "Baton twirling",
    "Blogging",
];
export type Hobby = typeof HOBBIES[number];

export const MIN_AGE = 18;
