import * as React from "react";
import {StyleSheet, Text, View, StyleProp, ViewStyle} from "react-native";
import {Theme, ThemeProps} from "../../types";
import {preTheme} from "../../styles/utils";
import {withTheme} from "react-native-elements";
import {Group} from "../../model/groups";
import Button from "../Button";
import i18n from "i18n-js";
import store from "../../state/store";
import {joinGroup} from "../../state/groups/actions";
import {MyThunkDispatch} from "../../state/types";

// Component props
type GroupExploreCardProps = {
    group: Group | null;
    style?: StyleProp<ViewStyle>;
} & ThemeProps;

class GroupExploreCard extends React.Component<GroupExploreCardProps> {
    private join(): void {
        const {group} = this.props;

        if (group) {
            (store.dispatch as MyThunkDispatch)(joinGroup(group));
        }
    }

    render(): JSX.Element {
        const {theme, group, style, ...otherProps} = this.props;

        const styles = themedStyles(theme);

        return (
            <View style={[styles.container, style]} {...otherProps}>
                <View style={styles.left}>
                    {group && (
                        <>
                            <Text style={styles.groupName} numberOfLines={2}>
                                {group.name}
                                {group.name.length % 2 === 0 && " Nom beaucoup trop long pour une ligne"}
                            </Text>
                            <Text style={styles.groupDescription} numberOfLines={1}>
                                {group.description}
                                {group.name.length % 2 === 0 && " Description un peu trop longue pour une ligne"}
                            </Text>
                        </>
                    )}
                </View>
                <View style={styles.right}>
                    <Button
                        style={styles.joinButton}
                        textStyle={styles.joinButtonText}
                        skin="rounded-filled"
                        text={i18n.t("groups.join")}
                        onPress={() => this.join()}
                    />
                </View>
            </View>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        container: {
            width: "100%",
            height: 70,
            marginVertical: 5,
            backgroundColor: theme.accentSlight,
            borderRadius: 10,
            paddingVertical: 5,
            paddingHorizontal: 10,
            flexDirection: "row",
        },
        groupName: {
            color: theme.text,
            fontSize: 16,
        },
        groupDescription: {
            color: theme.textLight,
            fontSize: 14,
        },
        left: {
            flex: 1,
            justifyContent: "center",
        },
        right: {
            alignItems: "center",
            justifyContent: "center",
        },
        joinButton: {
            width: "auto",
            minWidth: 80,
            height: 30,
        },
        joinButtonText: {
            fontSize: 16,
        },
    });
});

export default withTheme(GroupExploreCard);
