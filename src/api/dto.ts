import {Degree, Gender, LanguageLevel, Role, StaffRole} from "../constants/profile-constants";
import {UniversityKey} from "../constants/universities";
import {CountryCode} from "../model/country-codes";
import {User} from "../model/user";

export type SpokenLanguageDto = {
    code: string;
    level: LanguageLevel;
};

export type ResponseUserDto = {
    role: Role;
    email: string;
    active: boolean;
    onboarded: boolean;
    verificationToken: string; // TODO temporary
    profile: ResponseProfileDto;
};

export type TokenDto = {
    expiresIn: number;
    accessToken: string;
};

export type LoginDto = {
    user: User;
    token: TokenDto;
};

export type CreateProfileDtoCommon = {
    type: Role;
    firstName: string;
    lastName: string;
    gender: Gender;
    birthdate: string;
    nationality: CountryCode;
    avatar: string;
    languages: SpokenLanguageDto[];
    interests: string[];
    profileOffers: OfferValueDto[];
    educationFields: EducationFieldDto[];
};

export type CreateProfileDtoStudent = CreateProfileDtoCommon & {
    degree: Degree;
};

export type CreateProfileDtoStaff = CreateProfileDtoCommon & {
    staffRole: StaffRole;
};

export type CreateProfileDto = CreateProfileDtoStudent | CreateProfileDtoStaff;

export type ResponseProfileDto = CreateProfileDto & {id: string; university: UniversityKey};

export type FetchProfilesResponseDto = {
    data: ResponseProfileDto[];
    meta: {
        currentPage: number;
        itemCount: number;
        itemsPerPage: number;
        totalItems: number;
        totalPages: number;
    };
    links: {
        first: string;
        last: string;
        next: string;
        previous: string;
    };
};

export type FetchMyMatchesResponseDto = ResponseProfileDto[];

export enum OfferCategory {
    Discover = "discover",
    Collaborate = "collaborate",
    Meet = "meet",
}

export type EducationFieldDto = {
    id: string;
};

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

export type SignedUrlResponseDto = {
    fileName: string;
    s3Url: string;
};

export type AvatarSuccessfulUpdatedDto = {
    avatar: string;
};

export type LikeProfileResponseDto = "requested" | "matched";
