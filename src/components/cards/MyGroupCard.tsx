import * as React from "react";
import {TouchableOpacity, TouchableOpacityProps, StyleSheet, Text, Image} from "react-native";
import {Theme, ThemeProps} from "../../types";
import {preTheme} from "../../styles/utils";
import {withTheme} from "react-native-elements";
import {Group} from "../../model/groups";
import {navigateToGroup} from "../../navigation/utils";
import LocalImage from "../LocalImage";
import {BlurView} from "expo-blur";
import GroupInviteResponseModal, {GroupInviteResponseModalClass} from "../modals/GroupInviteResponseModal";

// Component props
type MyGroupCardProps = {
    group: Group | null;
    isInvite?: boolean;
} & TouchableOpacityProps &
    ThemeProps;

class MyGroupCard extends React.Component<MyGroupCardProps> {
    inviteResponseModalRef = React.createRef<GroupInviteResponseModalClass>();

    render(): JSX.Element {
        const {group, theme, style, isInvite, ...otherProps} = this.props;

        const styles = themedStyles(theme);

        return (
            <TouchableOpacity
                style={[styles.container, group && !group.cover ? styles.containerWithoutCover : {}, style]}
                activeOpacity={0.9}
                onPress={() => {
                    if (group) {
                        if (isInvite) this.inviteResponseModalRef.current?.show();
                        else navigateToGroup(group.id);
                    }
                }}
                {...otherProps}
            >
                {group && (
                    <>
                        {group.cover && (
                            <Image style={styles.groupCover} source={{uri: group.cover}} resizeMode="cover" />
                        )}
                        {!group.cover && (
                            <LocalImage style={styles.groupCover} imageKey="group-placeholder" resizeMode="cover" />
                        )}
                        <BlurView style={styles.textUnderlay} tint="dark" intensity={5} />
                        <Text style={styles.groupName} numberOfLines={3}>
                            {group?.name}
                        </Text>
                    </>
                )}
                {group && isInvite && <GroupInviteResponseModal ref={this.inviteResponseModalRef} group={group} />}
            </TouchableOpacity>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        container: {
            width: 90,
            height: 90,
            borderRadius: 15,
            marginRight: 10,
            overflow: "hidden",
        },
        containerWithoutCover: {
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: theme.componentBorder,
        },
        groupCover: {
            position: "absolute",
            width: "100%",
            height: "100%",
        },
        textUnderlay: {
            position: "absolute",
            width: "100%",
            height: "100%",
        },
        groupName: {
            color: theme.textWhite,
            textShadowColor: "rgba(0, 0, 0, 0.7)",
            textShadowOffset: {width: 1, height: 1},
            textShadowRadius: 10,
            margin: 5,
            zIndex: 1, // fix for web version
        },
    });
});

export default withTheme(MyGroupCard);
