import {Gender} from "../constants/profile-constants";
import {CountryCode} from "../model/country-codes";
import {SpokenLanguage} from "../model/spoken-language";

export type UserDto = {
    role: "USER" | "ADMIN" | "TEACHER" | "STUDENT";
    email: string;
    active: boolean;
    onboarded: boolean;
    verificationToken: string; // TODO temporary
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
    firstName: string;
    lastName: string;
    gender: Gender;
    birthdate: string;
    nationality: CountryCode;
    languages: SpokenLanguage[];
};

export type CreateProfileDtoStudent = CreateProfileDtoCommon & {
    degree: string;
};

export type CreateProfileDtoStaff = CreateProfileDtoCommon & {
    staffRole: string;
};

export type CreateProfileDto = CreateProfileDtoStudent | CreateProfileDtoStaff;
