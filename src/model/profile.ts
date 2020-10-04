import {Role, StaffRole, Gender, Hobby} from "../constants/profile-constants";
import {CountryCode} from "./country-codes";

export interface FullProfile {
    firstName: string;
    lastName: string;
    email: string;
    levelOfStudy: number;
    nationality: CountryCode;
    role: Role;
    staffRole?: StaffRole;
    birthDate: Date;
    gender: Gender;
    hobbies: Hobby[];
    avatarUri: string;
    // languages
}
