import {Degree, Gender, Role, StaffRole} from "../constants/profile-constants";
import {University} from "../constants/universities";
import {CountryCode} from "./country-codes";
import {SpokenLanguageDto, OfferValueDto} from "../api/dto";

export type UserProfileCommon = {
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
    university: University;
    profileOffers: OfferValueDto[];
};

export type UserProfileStudent = UserProfileCommon & {
    degree: Degree;
};

export type UserProfileStaff = UserProfileCommon & {
    staffRoles: StaffRole[];
};

export type UserProfile = UserProfileStudent | UserProfileStaff;

export type UserProfileWithMatchInfo = {
    profile: UserProfile;
    isMatched: boolean;
    roomId: string | null;
    matchId: string | null;
};
