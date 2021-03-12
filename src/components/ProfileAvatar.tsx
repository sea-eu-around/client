import * as React from "react";
import {AvatarProps} from "react-native-elements";
import {UserProfile} from "../model/user-profile";
import GeneralAvatar from "./GeneralAvatar";

// Component props
export type ProfileAvatarProps = {profile?: UserProfile; loading?: boolean} & AvatarProps;

class ProfileAvatar extends React.Component<ProfileAvatarProps> {
    render(): JSX.Element {
        const {children, profile, loading, ...avatarProps} = this.props;

        const name = profile ? (profile.firstName[0] + profile.lastName[0]).toUpperCase() : undefined;
        const sourceProp = profile && profile.avatarUrl ? {source: {uri: profile.avatarUrl}} : {};

        return (
            <GeneralAvatar {...avatarProps} name={name} {...sourceProp} loading={loading}>
                {children}
            </GeneralAvatar>
        );
    }
}

export default ProfileAvatar;
