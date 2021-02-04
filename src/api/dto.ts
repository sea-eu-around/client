import {Degree, Gender, LanguageLevel, Role} from "../constants/profile-constants";
import {UniversityKey} from "../constants/universities";
import {CountryCode} from "../model/country-codes";

/* General response-related types */

// Any response from the server should follow this structure
export type RequestResponse = SuccessfulRequestResponse | UnprocessableEntityRequestResponse | ErrorRequestResponse;
export type SuccessfulRequestResponse = {status: number; data: unknown} & {[key: string]: unknown};
export type PaginatedRequestResponse = SuccessfulRequestResponse & {
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

export type ErrorRequestResponse = {status: number; errorType: string; description: string};

// Only on 422 status
export type UnprocessableEntityRequestResponse = ErrorRequestResponse & {
    errors: {property: string; codes: {description: string; code: string}[]}[];
};

export type RemoteValidationErrors = {general: string; fields: {[key: string]: string}};

/* Specific DTOs */

export type SpokenLanguageDto = {
    code: string;
    level: LanguageLevel;
};

export type UserRole = "user" | "admin";

export type ResponseUserDto = {
    id: string;
    role: UserRole;
    email: string;
    isVerified: boolean;
    onboarded: boolean;
    profile: ResponseProfileDto;
};

export type TokenDto = {
    expiresIn: number;
    accessToken: string;
};

export type LoginDto = {
    user: ResponseUserDto;
    token: TokenDto;
};

export type CreateProfileDtoCommon = {
    type: Role;
    firstName: string;
    lastName: string;
    gender: Gender;
    birthdate: string;
    nationality: CountryCode;
    languages: SpokenLanguageDto[];
    interests: InterestDto[];
    profileOffers: OfferValueDto[];
    educationFields: EducationFieldDto[];
};

export type CreateProfileDtoStudent = CreateProfileDtoCommon & {
    degree: Degree;
};
export type CreateProfileDtoStaff = CreateProfileDtoCommon & {
    staffRoles: StaffRoleDto[];
};
export type CreateProfileDto = CreateProfileDtoStudent | CreateProfileDtoStaff;

export type ResponseProfileDtoCommon = CreateProfileDtoCommon & {
    id: string;
    university: UniversityKey;
    avatar: string;
};
export type ResponseProfileDtoStudent = ResponseProfileDtoCommon & CreateProfileDtoStudent;
export type ResponseProfileDtoStaff = ResponseProfileDtoCommon & CreateProfileDtoStaff;
export type ResponseProfileDto = ResponseProfileDtoStudent | ResponseProfileDtoStaff;

export type ResponseProfileWithMatchInfoDto = {
    isMatched: boolean;
    roomId: string | null;
    matchingId: string | null;
    profile: ResponseProfileDto;
};

export enum OfferCategory {
    Discover = "discover",
    Collaborate = "collaborate",
    Meet = "meet",
}

export type EducationFieldDto = {
    id: string;
};

export type StaffRoleDto = {
    id: string;
};

export type OfferDto = {
    id: string;
    category: OfferCategory;
    allowChooseProfileType: boolean;
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

export const initOfferValue = (o: OfferDto, val = false): OfferValueDto => {
    const genderVal = val && o.allowChooseGender;
    const typeVal = val && o.allowChooseProfileType;
    return {
        offerId: o.id,
        allowFemale: genderVal,
        allowMale: genderVal,
        allowOther: genderVal,
        allowStudent: typeVal,
        allowStaff: typeVal,
    };
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

export type ChatRoomProfileDto = {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
    lastMessageSeenId: string | null;
    lastMessageSeenDate: string | null;
};

export type ResponseRoomDto = {
    id: string;
    profiles: ChatRoomProfileDto[];
    lastMessage: ResponseChatMessageDto | null;
};

export type ResponseChatMessageDto = {
    roomId: string;
    id: string;
    senderId: string;
    sent: boolean;
    text: string;
    updatedAt: string;
};

export type ResponseChatMessageReadDto = {
    roomId: string;
    date: string;
    messageId: string;
    profileId: string;
};

export type ResponseChatWritingDto = {
    roomId: string;
    profileId: string;
    state: boolean;
};

export enum MatchActionStatus {
    Declined = "declined",
    Blocked = "blocked",
    Matched = "matched",
    Requested = "requested",
}
export const MATCH_ACTION_HISTORY_STATUSES: MatchActionStatus[] = [
    MatchActionStatus.Declined,
    MatchActionStatus.Blocked,
    MatchActionStatus.Requested,
];

export type MatchActionResponseDto = {
    roomId: string | null;
    status: MatchActionStatus;
};

export type MatchHistoryItemDto = {
    profile: ResponseProfileDto;
    status: MatchActionStatus;
    date: string;
    id: string;
};

export type CreateGroupDto = {
    name: string;
    description: string;
    visible: boolean;
    requireApproval: boolean;
};

export type ResponseGroupDto = {
    id: string;
    name: string;
    description: string;
    visible: boolean;
    requireApproval: boolean;
};
