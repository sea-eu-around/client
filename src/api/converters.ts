import {
    CreateProfileDto,
    CreateProfileDtoCommon,
    ResponseProfileDto,
    ResponseUserDto,
    UserDto,
    UserProfileDto,
} from "./dto";

export function convertDtoToProfile(dto: ResponseProfileDto): UserProfileDto {
    return {
        ...dto,
        avatarUri: "", // TODO add to response dto
        birthdate: new Date(dto.birthdate),
    };
}

export function convertProfileToCreateDto(profile: UserProfileDto): CreateProfileDto {
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

export function convertPartialProfileToCreateDto(profile: Partial<UserProfileDto>): Partial<CreateProfileDto> {
    return {
        ...profile,
        birthdate: profile.birthdate?.toJSON(),
    };
}

export function convertDtoToUser(dto: ResponseUserDto): UserDto {
    return {
        ...dto,
        profile: convertDtoToProfile(dto.profile),
    };
}
