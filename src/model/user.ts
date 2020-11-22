import {UserRole} from "../api/dto";
import {UserProfile} from "./user-profile";

export type User = {
    role: UserRole;
    email: string;
    isVerified: boolean;
    onboarded: boolean;
    verificationToken: string; // TODO temporary
    profile: UserProfile;
};
