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

// MaterialIcons
export const STAFF_ROLE_ICONS = [
    "school",
    "library-books",
    "help",
    "account-balance",
    "build",
    "verified-user",
    "help",
];

export type Gender = "male" | "female" | "other";
export const GENDERS: Gender[] = ["male", "female", "other"];

export const MIN_AGE = 18;
