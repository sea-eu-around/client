import {UserRole} from "../api/dto";
import {UserProfile} from "./user-profile";

export type User = {
    role: UserRole;
    email: string;
    isVerified: boolean;
    onboarded: boolean;
    // Only available in debug mode on the staging server
    verificationToken: string | null;
    profile: UserProfile;
};
