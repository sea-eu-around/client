import {UserRole} from "../api/dto";
import {UserProfile} from "./user-profile";

export type User = {
    role: UserRole;
    email: string;
    isVerified: boolean;
    onboarded: boolean;
    // Only available in debug mode on the staging server
    verificationToken?: string;
    profile?: UserProfile; // profile is undefined if the user hasn't been through on-boarding yet
};
