import {MaterialIcons} from "@expo/vector-icons";
import * as React from "react";
import {connect, ConnectedProps} from "react-redux";
import themes from "../constants/themes";
import {AppState} from "../state/types";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import {Platform, StyleProp, TextStyle} from "react-native";

// Map props from store
const mapStateToProps = (state: AppState) => ({
    theme: themes[state.settings.theme],
});
const reduxConnector = connect(mapStateToProps);

// Component props
export type AvatarEditButtonProps = ConnectedProps<typeof reduxConnector> & {
    onPictureSelected?: (uri: string) => void;
};

const styles = {
    buttonStyle: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: "#eee",
        borderRadius: 20,
        padding: 4,
    } as StyleProp<TextStyle>,
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

        return (
            <MaterialIcons
                onPress={() => this.showPicker()}
                size={24}
                style={[styles.buttonStyle, {color: theme.accentSecondary}]}
                name="image"
            />
        );
    }
}

export default reduxConnector(AvatarEditButton);
