import {
    CreateProfileDto,
    CreateProfileDtoCommon,
    EducationFieldDto,
    OfferValueDto,
    ResponseProfileDto,
    ResponseUserDto,
} from "./dto";
import {UserProfile} from "../model/user-profile";
import {User} from "../model/user";

export function stripSuperfluousOffers(offers: OfferValueDto[]): OfferValueDto[] {
    return offers
        ? offers.filter((o) => o.allowFemale || o.allowMale || o.allowOther || o.allowStaff || o.allowStudent)
        : [];
}

export function convertDtoToProfile(dto: ResponseProfileDto): UserProfile {
    return {
        ...dto,
        avatarUrl: dto.avatar,
        birthdate: new Date(dto.birthdate),
        educationFields: (dto.educationFields || []).map((dto: EducationFieldDto) => dto.id),
        profileOffers: dto.profileOffers || [],
        interests: dto.interests || [],
        languages: dto.languages || [],
    };
}

export function convertProfileToCreateDto(profile: UserProfile): CreateProfileDto {
    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    const common: CreateProfileDtoCommon = {
        ...profile,
        birthdate: profile.birthdate.toJSON(),
        educationFields: profile.educationFields.map((id: string) => ({id})),
        profileOffers: stripSuperfluousOffers(profile.profileOffers),
    };

    return {...common, ...(profile.type == "staff" ? {staffRole: profile.staffRole!} : {degree: profile.degree!})};
}

export function convertPartialProfileToCreateDto(profile: Partial<UserProfile>): Partial<CreateProfileDto> {
    return {
        ...profile,
        birthdate: profile.birthdate?.toJSON(),
        educationFields: profile.educationFields?.map((id: string) => ({id})),
        profileOffers: profile.profileOffers ? stripSuperfluousOffers(profile.profileOffers) : undefined,
    };
}

export function convertDtoToUser(dto: ResponseUserDto): User {
    return {
        ...dto,
        profile: dto.profile ? convertDtoToProfile(dto.profile) : undefined,
    };
}
