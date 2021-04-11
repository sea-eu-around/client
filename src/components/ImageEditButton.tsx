import {MaterialIcons} from "@expo/vector-icons";
import * as React from "react";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import {Platform, StyleProp, StyleSheet, TouchableOpacity, ViewStyle} from "react-native";
import {Theme, ThemeProps} from "../types";
import {preTheme} from "../styles/utils";
import {withTheme} from "react-native-elements";
import {ImageInfo} from "expo-image-picker/build/ImagePicker.types";

// Component props
export type ImageEditButtonProps = ThemeProps & {
    onPictureSelected?: (imageInfo: ImageInfo) => void;
    style?: StyleProp<ViewStyle>;
    quality?: number;
    aspect?: [number, number];
};

class ImageEditButton extends React.Component<ImageEditButtonProps> {
    ensurePermission = async () => {
        if (Platform.OS !== "web") {
            let {status} = await Permissions.getAsync(Permissions.CAMERA_ROLL);
            if (status !== "granted") {
                status = await (await Permissions.askAsync(Permissions.CAMERA_ROLL)).status;
                /*if (status !== "granted") {
                    alert("Sorry, we need camera roll permissions to make this work!");
                }*/
                return status === "granted";
            }
        }
        return true;
    };

    showPicker = async () => {
        const authorized = this.ensurePermission();

        if (authorized) {
            const {quality, aspect} = this.props;
            try {
                const result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect,
                    quality,
                });
                if (!result.cancelled) {
                    const info: ImageInfo = result;
                    if (this.props.onPictureSelected) this.props.onPictureSelected(info);
                }
            } catch (e) {
                console.error("Could not get image. Check console for error.");
                console.log(e);
            }
        }
    };

    render(): JSX.Element {
        const {theme, style} = this.props;
        const styles = themedStyles(theme);

        return (
            <TouchableOpacity style={[styles.button, style]} onPress={() => this.showPicker()}>
                <MaterialIcons style={styles.buttonIcon} name="edit" />
            </TouchableOpacity>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        button: {
            borderRadius: 20,
            padding: 4,
            backgroundColor: theme.cardBackground,

            shadowColor: "#000",
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.2,
            shadowRadius: 1.41,
            elevation: 2,
        },
        buttonIcon: {
            fontSize: 20,
            color: theme.text,
        },
    });
});

export default withTheme(ImageEditButton);
