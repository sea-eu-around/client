import * as React from "react";
import {Avatar, AvatarProps, Overlay, withTheme} from "react-native-elements";
import {preTheme} from "../styles/utils";
import {ThemeProps} from "../types";
import {StyleSheet} from "react-native";

// Component props
export type EnlargeableAvatarProps = AvatarProps & ThemeProps;

// Component state
export type EnlargeableAvatarState = {
    enlarged: boolean;
};

class EnlargeableAvatar extends React.Component<EnlargeableAvatarProps, EnlargeableAvatarState> {
    constructor(props: EnlargeableAvatarProps) {
        super(props);
        this.state = {enlarged: false};
    }

    toggleEnlarged() {
        this.setState({...this.state, enlarged: !this.state.enlarged});
    }

    render(): JSX.Element {
        const {theme, children, ...avatarProps} = this.props;
        const {enlarged} = this.state;
        const styles = themedStyles(theme);

        const onPress = () => {
            if (avatarProps.onPress) avatarProps.onPress();
            this.toggleEnlarged();
        };

        return (
            <>
                <Avatar {...avatarProps} {...(avatarProps.source ? {onPress} : {})}>
                    {children}
                </Avatar>
                <Overlay
                    isVisible={enlarged}
                    onBackdropPress={() => this.toggleEnlarged()}
                    overlayStyle={styles.overlay}
                    backdropStyle={styles.overlayBackdrop}
                >
                    <Avatar
                        rounded
                        containerStyle={styles.enlargedAvatarContainer}
                        avatarStyle={styles.enlargedAvatar}
                        source={avatarProps.source}
                        activeOpacity={0.8}
                        onPress={() => this.toggleEnlarged()}
                    />
                </Overlay>
            </>
        );
    }
}

export const themedStyles = preTheme(() => {
    return StyleSheet.create({
        overlay: {
            width: "100%",
            aspectRatio: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "transparent",
            elevation: 0,
            shadowOpacity: 0,
        },
        overlayBackdrop: {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
        },
        enlargedAvatar: {
            borderRadius: 300,
        },
        enlargedAvatarContainer: {
            width: "100%",
            height: "100%",
            maxWidth: 400,
            maxHeight: 400,
            flex: 1,
        },
    });
});

export default withTheme(EnlargeableAvatar);
