import * as React from "react";
import {ActivityIndicator, Image, StyleSheet, View} from "react-native";
import {withTheme} from "react-native-elements";
import {Theme, ThemeProps} from "../types";
import {preTheme} from "../styles/utils";
import {Group} from "../model/groups";
import {FontAwesome} from "@expo/vector-icons";
import ImageEditButton from "./ImageEditButton";
import {GROUP_COVER_ASPECT, GROUP_COVER_QUALITY} from "../constants/config";
import {ImageInfo} from "expo-image-picker/build/ImagePicker.types";
import store from "../state/store";
import {MyThunkDispatch} from "../state/types";
import {setGroupCover} from "../state/groups/actions";

// Component props
export type GroupCoverProps = ThemeProps & {group: Group | null};

class GroupCover extends React.Component<GroupCoverProps> {
    render() {
        const {theme, group} = this.props;
        const styles = themedStyles(theme);

        const showLoading = group?.uploadingCover;
        const showPlaceholder = !showLoading && (!group || !group.cover);
        const allowEditing = group !== null;
        console.log(group && group.cover);
        return (
            <View style={styles.container}>
                {group && group.cover && <Image style={styles.image} source={{uri: group.cover}} resizeMode="cover" />}
                {showPlaceholder && <FontAwesome style={styles.placeholderIcon} name="picture-o" />}
                {showLoading && <ActivityIndicator style={styles.loading} size={42} color={theme.text} />}
                {allowEditing && (
                    <ImageEditButton
                        style={styles.editButton}
                        quality={GROUP_COVER_QUALITY}
                        aspect={GROUP_COVER_ASPECT}
                        onPictureSelected={(imageInfo: ImageInfo) =>
                            group && (store.dispatch as MyThunkDispatch)(setGroupCover(group.id, imageInfo))
                        }
                    />
                )}
            </View>
        );
    }
}

export const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        container: {
            width: "100%",
            backgroundColor: "#0001",
            justifyContent: "center",
            alignItems: "center",
            height: 250,
        },
        image: {
            width: "100%",
            height: "100%",
        },
        placeholderIcon: {
            fontSize: 32,
            color: theme.textLight,
            marginTop: 50,
        },
        editButton: {
            position: "absolute",
            bottom: 10,
            right: 10,
        },
        loading: {
            opacity: 0.25,
        },
    });
});

export default withTheme(GroupCover);
