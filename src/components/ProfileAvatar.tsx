import * as React from "react";
import {Avatar, AvatarProps} from "react-native-elements";
import {UserProfile} from "../model/user-profile";

// Component props
export type ProfileAvatarProps = {profile?: UserProfile} & AvatarProps;

class ProfileAvatar extends React.Component<ProfileAvatarProps> {
    render(): JSX.Element {
        const {children, profile, ...avatarProps} = this.props;

        const avatarTitle =
            avatarProps.title || (profile ? (profile.firstName[0] + profile.lastName[0]).toUpperCase() : undefined);

        const avatarSourceProp = profile && profile.avatarUrl ? {source: {uri: profile.avatarUrl}} : {};

        return (
            <Avatar {...avatarProps} title={avatarTitle} {...avatarSourceProp}>
                {children}
            </Avatar>
        );
    }
}

export default ProfileAvatar;
