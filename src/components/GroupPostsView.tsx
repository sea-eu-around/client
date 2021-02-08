import * as React from "react";
import {StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle} from "react-native";
import i18n from "i18n-js";
import {withTheme} from "react-native-elements";
import {Theme, ThemeProps} from "../types";
import {preTheme} from "../styles/utils";
import {Group} from "../model/groups";
import {MaterialIcons} from "@expo/vector-icons";
import CreatePostModal from "./modals/CreatePostModal";

// Component props
export type GroupPostsViewProps = ThemeProps & {group: Group | null; containerStyle?: StyleProp<ViewStyle>};

class GroupPostsView extends React.Component<GroupPostsViewProps> {
    render() {
        const {theme, group, containerStyle} = this.props;
        const styles = themedStyles(theme);

        return (
            <View style={[styles.container, containerStyle]}>
                <View style={styles.titleWrapper}>
                    <Text style={styles.title}>{i18n.t("groups.posts")}</Text>
                    <View style={styles.buttons}>
                        {group && (
                            <CreatePostModal
                                group={group}
                                activator={(show) => (
                                    <TouchableOpacity style={styles.button} onPress={show}>
                                        <MaterialIcons style={styles.buttonIcon} name="add" />
                                    </TouchableOpacity>
                                )}
                            />
                        )}
                        <TouchableOpacity style={styles.button}>
                            <MaterialIcons style={styles.buttonIcon} name="sort" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

export const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        container: {
            backgroundColor: theme.accentSlight,
            paddingHorizontal: 15,
            paddingVertical: 10,
        },
        titleWrapper: {
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
        },
        title: {
            fontSize: 20,
        },
        buttons: {
            flexDirection: "row",
        },
        button: {
            width: 32,
            height: 32,
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 4,
        },
        buttonIcon: {
            fontSize: 24,
            color: theme.text,
        },
    });
});

export default withTheme(GroupPostsView);
