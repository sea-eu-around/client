import {Degree, Gender, Role, StaffRole} from "../constants/profile-constants";
import {UniversityKey} from "../constants/universities";
import {CountryCode} from "../model/country-codes";
import {SpokenLanguage} from "../model/spoken-language";

export type UserProfileDto = {
    id: string;
    firstName: string;
    lastName: string;
    nationality: CountryCode;
    birthdate: Date;
    gender: Gender;
    interests: string[];
    avatarUri: string;
    languages: SpokenLanguage[];
    educationFields: string[];
    staffRole?: StaffRole;
    degree?: Degree;
    university: UniversityKey;
};

export type UserDto = {
    role: Role;
    email: string;
    active: boolean;
    onboarded: boolean;
    verificationToken: string; // TODO temporary
    profile: UserProfileDto;
};

export type TokenDto = {
    expiresIn: number;
    accessToken: string;
};

export type LoginDto = {
    user: UserDto;
    token: TokenDto;
};

export type CreateProfileDtoCommon = {
    type: Role;
    firstName: string;
    lastName: string;
    gender: Gender;
    birthdate: string;
    nationality: CountryCode;
    languages: SpokenLanguage[];
    interests: string[];
    profileOffers: OfferValueDto[];
};

export type CreateProfileDtoStudent = CreateProfileDtoCommon & {
    degree: Degree;
};

export type CreateProfileDtoStaff = CreateProfileDtoCommon & {
    staffRole: string;
};

export type CreateProfileDto = CreateProfileDtoStudent | CreateProfileDtoStaff;

export enum OfferCategory {
    Discover = "discover",
    Collaborate = "collaborate",
    Meet = "meet",
}

export type OfferDto = {
    id: string;
    category: OfferCategory;
    allowChooseRole: boolean;
    allowChooseGender: boolean;
    allowInterRole: boolean;
};

export type OfferValueDto = {
    offerId: string;
    allowStaff: boolean;
    allowStudent: boolean;
    allowMale: boolean;
    allowFemale: boolean;
    allowOther: boolean;
};

export type InterestDto = {
    id: string;
};
