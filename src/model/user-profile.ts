import {Degree, Gender, StaffRole} from "../constants/profile-constants";
import {UniversityKey} from "../constants/universities";
import {CountryCode} from "./country-codes";
import {SpokenLanguageDto, OfferValueDto} from "../api/dto";

export type UserProfile = {
    id: string;
    firstName: string;
    lastName: string;
    nationality: CountryCode;
    birthdate: Date;
    gender: Gender;
    interests: string[];
    avatarUri: string;
    languages: SpokenLanguageDto[];
    educationFields: string[];
    staffRole?: StaffRole;
    degree?: Degree;
    university: UniversityKey;
    profileOffers: OfferValueDto[];
};
