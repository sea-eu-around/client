import * as React from "react";
import {ActivityIndicator, View} from "react-native";
import {Avatar, AvatarProps} from "react-native-elements";
import {UserProfile} from "../model/user-profile";

// Component props
export type ProfileAvatarProps = {profile?: UserProfile; loading?: boolean} & AvatarProps;

class ProfileAvatar extends React.Component<ProfileAvatarProps> {
    render(): JSX.Element {
        const {children, profile, loading, ...avatarProps} = this.props;

        const avatarTitle =
            avatarProps.title || (profile ? (profile.firstName[0] + profile.lastName[0]).toUpperCase() : undefined);

        const avatarSourceProp = profile && profile.avatarUrl ? {source: {uri: profile.avatarUrl}} : {};

        return (
            <Avatar {...avatarProps} title={avatarTitle} {...avatarSourceProp}>
                {children}
                {loading && (
                    <View style={{position: "absolute", left: "50%", top: "50%"}}>
                        <ActivityIndicator size={40} color="white" style={{right: 20, bottom: 20}} />
                    </View>
                )}
            </Avatar>
        );
    }
}

export default ProfileAvatar;
