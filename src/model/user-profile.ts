import {Degree, Gender, Role, StaffRole} from "../constants/profile-constants";
import {UniversityKey} from "../constants/universities";
import {CountryCode} from "./country-codes";
import {SpokenLanguageDto, OfferValueDto} from "../api/dto";

export type UserProfile = {
    id: string;
    type: Role;
    firstName: string;
    lastName: string;
    nationality: CountryCode;
    birthdate: Date;
    gender: Gender;
    interests: string[];
    avatarUrl: string;
    languages: SpokenLanguageDto[];
    educationFields: string[];
    staffRole?: StaffRole;
    degree?: Degree;
    university: UniversityKey;
    profileOffers: OfferValueDto[];
};
