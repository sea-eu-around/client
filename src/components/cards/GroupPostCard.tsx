import * as React from "react";
import {TouchableOpacity, TouchableOpacityProps, StyleSheet, Text, View} from "react-native";
import {Theme, ThemeProps} from "../../types";
import {preTheme} from "../../styles/utils";
import {withTheme} from "react-native-elements";
import {GroupPost} from "../../model/groups";
import EnlargeableAvatar from "../EnlargeableAvatar";
import ReadMore from "react-native-read-more-text";
import i18n from "i18n-js";
import {MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";

// Component props
type GroupPostCardProps = {
    post: GroupPost | null;
} & TouchableOpacityProps &
    ThemeProps;

class GroupPostCard extends React.Component<GroupPostCardProps> {
    render(): JSX.Element {
        const {post, theme, style, ...otherProps} = this.props;

        const styles = themedStyles(theme);

        return (
            <TouchableOpacity
                style={[styles.container, style]}
                activeOpacity={0.9}
                /*onPress={() => {
                    rootNavigate("TabGroups", {screen: "GroupScreen", params: group ? {groupId: group.id} : {}});
                }}*/
                {...otherProps}
            >
                <View style={styles.top}>
                    <EnlargeableAvatar profile={undefined} size={42} containerStyle={styles.avatarContainer} rounded />
                    <Text style={styles.name}>Henry Miller</Text>
                </View>
                {post && (
                    <ReadMore
                        numberOfLines={5}
                        renderTruncatedFooter={(handlePress) => (
                            <TouchableOpacity activeOpacity={0.7} onPress={handlePress}>
                                <Text style={[styles.postText, styles.textFooter]}>... {i18n.t("showMore")}</Text>
                            </TouchableOpacity>
                        )}
                        renderRevealedFooter={(handlePress) => (
                            <TouchableOpacity activeOpacity={0.7} onPress={handlePress}>
                                <Text style={[styles.postText, styles.textFooter]}>{i18n.t("showLess")}</Text>
                            </TouchableOpacity>
                        )}
                    >
                        <Text style={styles.postText}>{post?.text}</Text>
                    </ReadMore>
                )}
                <View style={styles.bottom}>
                    <View>
                        <Text style={styles.bottomText}>82 points</Text>
                        <Text style={styles.bottomText}>17 comments</Text>
                    </View>
                    <View style={{flexDirection: "row"}}>
                        <TouchableOpacity style={styles.bottomButton}>
                            <MaterialIcons style={styles.bottomButtonIcon} name="arrow-upward" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.bottomButton}>
                            <MaterialIcons style={styles.bottomButtonIcon} name="arrow-downward" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.bottomButton}>
                            <MaterialCommunityIcons style={styles.bottomButtonIcon} name="dots-vertical" />
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        container: {
            width: "100%",
            backgroundColor: theme.cardBackground,
            padding: 10,
            marginBottom: 15,
        },
        top: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
        },
        bottom: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 10,
        },

        avatarContainer: {
            width: 40,
            height: 40,
            backgroundColor: theme.accentSlight,
            marginRight: 10,
        },
        name: {
            fontSize: 18,
            color: theme.text,
        },
        postText: {
            fontSize: 16,
            color: theme.text,
            lineHeight: 20,
        },
        textFooter: {
            color: theme.accent,
        },

        bottomText: {
            fontSize: 13,
            color: theme.textLight,
        },
        bottomButton: {
            marginLeft: 15,
            padding: 5,
        },
        bottomButtonIcon: {
            fontSize: 24,
            color: theme.textLight,
        },
    });
});

export default withTheme(GroupPostCard);
