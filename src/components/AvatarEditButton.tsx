import {MaterialIcons} from "@expo/vector-icons";
import * as React from "react";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import {Platform, StyleSheet, TouchableOpacity} from "react-native";
import {Theme, ThemeProps} from "../types";
import {preTheme} from "../styles/utils";
import {withTheme} from "react-native-elements";
import {ImageInfo} from "expo-image-picker/build/ImagePicker.types";
import {AVATAR_QUALITY} from "../constants/config";

// Component props
export type AvatarEditButtonProps = ThemeProps & {
    onPictureSelected?: (imageInfo: ImageInfo) => void;
};

class AvatarEditButton extends React.Component<AvatarEditButtonProps> {
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
            try {
                const result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: AVATAR_QUALITY,
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
        const {theme} = this.props;
        const styles = themedStyles(theme);

        return (
            <TouchableOpacity style={styles.button} onPress={() => this.showPicker()}>
                <MaterialIcons style={styles.buttonIcon} name="edit" />
            </TouchableOpacity>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        button: {
            position: "absolute",
            bottom: 0,
            right: 0,
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

export default withTheme(AvatarEditButton);
