import * as React from "react";
import {StyleSheet, Text, View, StyleProp, ViewStyle, TouchableOpacity} from "react-native";
import {Theme, ThemeProps} from "../../types";
import {preTheme} from "../../styles/utils";
import {withTheme} from "react-native-elements";
import {GroupMember} from "../../model/groups";
import i18n from "i18n-js";
import EnlargeableAvatar from "../EnlargeableAvatar";
import {MaterialIcons} from "@expo/vector-icons";
import {rootNavigate} from "../../navigation/utils";

// Component props
type GroupMemberCardProps = {
    member: GroupMember | null;
    style?: StyleProp<ViewStyle>;
} & ThemeProps;

class GroupMemberCard extends React.Component<GroupMemberCardProps> {
    render(): JSX.Element {
        const {theme, member, style, ...otherProps} = this.props;

        const styles = themedStyles(theme);

        return (
            <TouchableOpacity
                style={[styles.container, style]}
                onPress={() => member && rootNavigate("ProfileScreen", {id: member.profile.id})}
                {...otherProps}
            >
                {member && (
                    <>
                        <EnlargeableAvatar
                            profile={member.profile}
                            size={50}
                            rounded
                            containerStyle={styles.avatarContainer}
                        />
                        <View style={{flexDirection: "column", flex: 1}}>
                            <Text style={styles.name} numberOfLines={2}>
                                {member.profile.firstName} {member.profile.lastName}
                            </Text>
                            {member.role !== "member" /* TODO */ && (
                                <View style={{flexDirection: "row", alignItems: "center"}}>
                                    <MaterialIcons name="verified-user" style={styles.roleIcon} />
                                    <Text style={styles.role}>{i18n.t(`groups.roles.${member.role}`)}</Text>
                                </View>
                            )}
                        </View>
                    </>
                )}
            </TouchableOpacity>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        container: {
            width: "100%",
            backgroundColor: theme.cardBackground,
            paddingVertical: 10,
            paddingHorizontal: 10,
            flexDirection: "row",
            alignItems: "center",
        },
        avatarContainer: {
            marginRight: 10,
        },
        name: {
            color: theme.text,
            fontSize: 16,
        },
        role: {
            color: theme.textLight,
            fontSize: 14,
        },
        roleIcon: {
            color: theme.textLight,
            fontSize: 20,
            marginRight: 3,
        },
    });
});

export default withTheme(GroupMemberCard);
