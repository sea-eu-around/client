import {CreateProfileDto, CreateProfileDtoCommon, ResponseProfileDto, ResponseUserDto} from "./dto";
import {UserProfile} from "../model/user-profile";
import {User} from "../model/user";

export function convertDtoToProfile(dto: ResponseProfileDto): UserProfile {
    return {
        ...dto,
        avatarUri: "", // TODO add to response dto
        birthdate: new Date(dto.birthdate),
    };
}

export function convertProfileToCreateDto(profile: UserProfile): CreateProfileDto {
    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    const staff = profile.staffRole !== undefined;
    const common: CreateProfileDtoCommon = {
        ...profile,
        type: staff ? "staff" : "student",
        birthdate: profile.birthdate.toJSON(),
    };

    return staff
        ? {...common, type: "staff", staffRole: profile.staffRole!}
        : {...common, type: "student", degree: profile.degree!};
}

export function convertPartialProfileToCreateDto(profile: Partial<UserProfile>): Partial<CreateProfileDto> {
    return {
        ...profile,
        birthdate: profile.birthdate?.toJSON(),
    };
}

export function convertDtoToUser(dto: ResponseUserDto): User {
    return {
        ...dto,
        profile: convertDtoToProfile(dto.profile),
    };
}
