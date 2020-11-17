import {CreateProfileDto, CreateProfileDtoCommon, EducationFieldDto, ResponseProfileDto, ResponseUserDto} from "./dto";
import {UserProfile} from "../model/user-profile";
import {User} from "../model/user";

export function convertDtoToProfile(dto: ResponseProfileDto): UserProfile {
    return {
        ...dto,
        avatarUrl: dto.avatar,
        birthdate: new Date(dto.birthdate),
        educationFields: (dto.educationFields || []).map((dto: EducationFieldDto) => dto.id),
    };
}

export function convertProfileToCreateDto(profile: UserProfile): CreateProfileDto {
    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    const staff = profile.staffRole !== undefined;
    const common: CreateProfileDtoCommon = {
        ...profile,
        avatar: profile.avatarUrl,
        type: staff ? "staff" : "student",
        birthdate: profile.birthdate.toJSON(),
        educationFields: profile.educationFields.map((id: string) => ({id})),
    };

    return staff
        ? {...common, type: "staff", staffRole: profile.staffRole!}
        : {...common, type: "student", degree: profile.degree!};
}

export function convertPartialProfileToCreateDto(profile: Partial<UserProfile>): Partial<CreateProfileDto> {
    return {
        ...profile,
        avatar: profile.avatarUrl,
        birthdate: profile.birthdate?.toJSON(),
        educationFields: profile.educationFields?.map((id: string) => ({id})),
    };
}

export function convertDtoToUser(dto: ResponseUserDto): User {
    return {
        ...dto,
        profile: convertDtoToProfile(dto.profile),
    };
}
