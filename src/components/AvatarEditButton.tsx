import {MaterialIcons} from "@expo/vector-icons";
import * as React from "react";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import {Platform, StyleSheet} from "react-native";
import {Theme, ThemeProps} from "../types";
import {preTheme} from "../styles/utils";
import {withTheme} from "react-native-elements";

// Component props
export type AvatarEditButtonProps = ThemeProps & {
    onPictureSelected?: (uri: string) => void;
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
                    mediaTypes: ImagePicker.MediaTypeOptions.All,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 1,
                });
                if (!result.cancelled) {
                    if (this.props.onPictureSelected) this.props.onPictureSelected(result.uri);
                }
                console.log(result);
            } catch (e) {
                console.log(e);
            }
        }
    };

    render(): JSX.Element {
        const {theme} = this.props;
        const styles = themedStyles(theme);

        return <MaterialIcons onPress={() => this.showPicker()} size={24} style={styles.buttonStyle} name="image" />;
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        buttonStyle: {
            position: "absolute",
            bottom: 0,
            right: 0,
            borderRadius: 20,
            padding: 4,
            backgroundColor: "#eee",
            color: theme.accentSecondary,
        },
    });
});

export default withTheme(AvatarEditButton);
