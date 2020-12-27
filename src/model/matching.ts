import {MatchActionStatus} from "../api/dto";
import {UserProfile} from "./user-profile";

export type MatchHistoryItem = {
    profile: UserProfile;
    status: MatchActionStatus;
    date: Date;
    id: string;
};
