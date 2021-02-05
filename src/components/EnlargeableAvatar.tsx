import * as React from "react";
import {AvatarProps, withTheme} from "react-native-elements";
import {preTheme} from "../styles/utils";
import {ThemeProps} from "../types";
import {StyleSheet} from "react-native";
import {UserProfile} from "../model/user-profile";
import ProfileAvatar from "./ProfileAvatar";
import CustomModal from "./modals/CustomModal";

// Component props
export type EnlargeableAvatarProps = {profile?: UserProfile; loading?: boolean} & AvatarProps & ThemeProps;

// Component state
export type EnlargeableAvatarState = {
    enlarged: boolean;
};

class EnlargeableAvatar extends React.Component<EnlargeableAvatarProps, EnlargeableAvatarState> {
    constructor(props: EnlargeableAvatarProps) {
        super(props);
        this.state = {enlarged: false};
    }

    showEnlarged() {
        this.setState({...this.state, enlarged: true});
    }

    hideEnlarged() {
        this.setState({...this.state, enlarged: false});
    }

    render(): JSX.Element {
        const {theme, children, profile, ...avatarProps} = this.props;
        const {enlarged} = this.state;
        const styles = themedStyles(theme);

        const onPress = () => {
            if (avatarProps.onPress) avatarProps.onPress();
            this.showEnlarged();
        };

        return (
            <>
                <ProfileAvatar
                    profile={profile}
                    {...avatarProps}
                    {...(avatarProps.source || profile?.avatarUrl ? {onPress} : {})}
                >
                    {children}
                </ProfileAvatar>
                <CustomModal
                    visible={enlarged}
                    onHide={() => this.hideEnlarged()}
                    fullWidth
                    noBackground
                    backdropOpacity={0.5}
                    modalViewStyle={styles.modal}
                    renderContent={() => (
                        <ProfileAvatar
                            profile={profile}
                            source={avatarProps.source}
                            containerStyle={styles.enlargedAvatarContainer}
                            avatarStyle={styles.enlargedAvatar}
                            activeOpacity={0.8}
                            onPress={() => this.hideEnlarged()}
                            rounded
                        />
                    )}
                />
            </>
        );
    }
}

export const themedStyles = preTheme(() => {
    return StyleSheet.create({
        modal: {
            aspectRatio: 1,
            paddingHorizontal: 20,
            paddingVertical: 20,
            maxWidth: 400,
            maxHeight: 400,
        },
        enlargedAvatar: {
            borderRadius: 300,
        },
        enlargedAvatarContainer: {
            width: "100%",
            height: "100%",
        },
    });
});

export default withTheme(EnlargeableAvatar);
