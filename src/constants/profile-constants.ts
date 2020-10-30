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

export const LANGUAGE_LEVELS = ["A2", "B1", "B2", "C1", "C2", "native"];

export type Role = "student" | "staff";
export const ROLES: Role[] = ["student", "staff"];

export type StaffRole = "teaching" | "researcher" | "supporting" | "administrative" | "technical" | "ambassador";
export const STAFF_ROLES: StaffRole[] = [
    "teaching",
    "researcher",
    "supporting",
    "administrative",
    "technical",
    "ambassador",
];

export type Gender = "MALE" | "FEMALE";
export const GENDERS: Gender[] = ["MALE", "FEMALE"];

export const MIN_AGE = 18;
