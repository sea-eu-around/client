export type ResponseLoginUser = {
    email: string;
    id: string;
    onboarded: boolean;
    role: "USER";
};

export type ResponseRegisterUser = {
    email: string;
    id: string;
    onboarded: boolean;
    role: "USER";
    verificationToken: string; // TEMPORARY
};
