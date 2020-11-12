import {Role} from "../constants/profile-constants";
import {UserProfile} from "./user-profile";

export type User = {
    role: Role;
    email: string;
    active: boolean;
    onboarded: boolean;
    verificationToken: string; // TODO temporary
    profile: UserProfile;
};
