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
