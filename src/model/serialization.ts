import {SerializedProfile, UserProfile, UserProfileCommon, UserProfileStaff, UserProfileStudent} from "./user-profile";

export function serializeProfile(profile: UserProfile): SerializedProfile {
    return {...profile, birthdate: profile.birthdate.toJSON()};
}

export function unserializeProfile(sProfile: SerializedProfile): UserProfile {
    const profile: UserProfileCommon = {...sProfile, birthdate: new Date(sProfile.birthdate)};

    if (profile.type === "staff") return profile as UserProfileStaff;
    else return profile as UserProfileStudent;
}
