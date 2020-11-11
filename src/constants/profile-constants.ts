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
    /*
    "natural-and-physical-science",
    "information-technology",
    "engineering-and-related-technology",
    "architecture-and-building",
    "agriculture-environnement",
    "health",
    "education",
    "management-and-commerce",
    "society-and-culture",
    "creatice-art",
    "food-and-hospitality",
    */
];

export type Degree = "bsc1" | "bsc2" | "bsc3" | "m1" | "m2" | "phd";
export const DEGREES: Degree[] = ["bsc1", "bsc2", "bsc3", "m1", "m2", "phd"];

export type LanguageLevel = "a1" | "a2" | "b1" | "b2" | "c1" | "c2" | "native";
export const LANGUAGE_LEVELS: LanguageLevel[] = ["a1", "a2", "b1", "b2", "c1", "c2", "native"];

export type Role = "student" | "staff";
export const ROLES: Role[] = ["student", "staff"];

export type StaffRole =
    | "teaching"
    | "researcher"
    | "supporting"
    | "administrative"
    | "technical"
    | "ambassador"
    | "other";
export const STAFF_ROLES: StaffRole[] = [
    "teaching",
    "researcher",
    "supporting",
    "administrative",
    "technical",
    "ambassador",
    "other",
];

export type Gender = "male" | "female" | "other";
export const GENDERS: Gender[] = ["male", "female", "other"];

export const MIN_AGE = 18;
