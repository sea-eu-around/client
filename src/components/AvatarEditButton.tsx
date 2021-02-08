import * as React from "react";
import {StyleProp, StyleSheet, ViewStyle} from "react-native";
import {ThemeProps} from "../types";
import {preTheme} from "../styles/utils";
import {withTheme} from "react-native-elements";
import {ImageInfo} from "expo-image-picker/build/ImagePicker.types";
import {AVATAR_ASPECT, AVATAR_QUALITY} from "../constants/config";
import ImageEditButton from "./ImageEditButton";

// Component props
export type AvatarEditButtonProps = ThemeProps & {
    onPictureSelected?: (imageInfo: ImageInfo) => void;
    style?: StyleProp<ViewStyle>;
};

class AvatarEditButton extends React.Component<AvatarEditButtonProps> {
    render(): JSX.Element {
        const {theme, style, onPictureSelected} = this.props;
        const styles = themedStyles(theme);

        return (
            <ImageEditButton
                style={[styles.button, style]}
                quality={AVATAR_QUALITY}
                aspect={AVATAR_ASPECT}
                onPictureSelected={onPictureSelected}
            />
        );
    }
}

const themedStyles = preTheme(() => {
    return StyleSheet.create({
        button: {
            position: "absolute",
            bottom: 0,
            right: 0,
        },
    });
});

export default withTheme(AvatarEditButton);
