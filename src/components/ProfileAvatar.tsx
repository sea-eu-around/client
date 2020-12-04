import * as React from "react";
import {Avatar, AvatarProps} from "react-native-elements";
import {UserProfile} from "../model/user-profile";

// Component props
export type ProfileAvatarProps = {profile?: UserProfile} & AvatarProps;

class ProfileAvatar extends React.Component<ProfileAvatarProps> {
    render(): JSX.Element {
        const {children, profile, ...avatarProps} = this.props;

        const avatarTitle = profile ? (profile.firstName[0] + profile.lastName[0]).toUpperCase() : "";
        const avatarSource = profile && profile.avatarUrl ? {uri: profile.avatarUrl} : undefined;

        return (
            <Avatar
                {...avatarProps}
                source={avatarProps.source || avatarSource}
                title={avatarProps.title || avatarTitle}
            >
                {children}
            </Avatar>
        );
    }
}

export default ProfileAvatar;
