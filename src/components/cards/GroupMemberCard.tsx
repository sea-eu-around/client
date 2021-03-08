import * as React from "react";
import {StyleSheet, Text, View, StyleProp, ViewStyle, TouchableOpacity} from "react-native";
import {Theme, ThemeProps} from "../../types";
import {preTheme} from "../../styles/utils";
import {withTheme} from "react-native-elements";
import {GroupMember} from "../../model/groups";
import i18n from "i18n-js";
import EnlargeableAvatar from "../EnlargeableAvatar";
import {MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";
import {rootNavigate} from "../../navigation/utils";
import Button from "../Button";
import DeleteGroupMemberModal from "../modals/DeleteGroupMemberModal";
import {connect, ConnectedProps} from "react-redux";
import {AppState, MyThunkDispatch} from "../../state/types";
import BanGroupMemberModal from "../modals/BanGroupMemberModal";
import {GroupMemberStatus} from "../../api/dto";
import {deleteGroupMember, setGroupMemberStatus} from "../../state/groups/actions";
import GroupPromoteAdminModal from "../modals/GroupPromoteAdminModal";

// Map props from store
const reduxConnector = connect((state: AppState) => ({
    localUserId: state.profile.user?.id,
}));

// Component props
type GroupMemberCardProps = {
    groupId: string;
    member: GroupMember | null;
    style?: StyleProp<ViewStyle>;
    adminView: boolean;
} & ThemeProps &
    ConnectedProps<typeof reduxConnector>;

class GroupMemberCard extends React.Component<GroupMemberCardProps> {
    render(): JSX.Element {
        const {theme, groupId, localUserId, member, adminView, style, ...otherProps} = this.props;

        const styles = themedStyles(theme);
        const isLocalUser = member && localUserId === member.profile.id;
        const dispatch = this.props.dispatch as MyThunkDispatch;

        const deleteMemberButton = member && (
            <DeleteGroupMemberModal
                activator={(show) => (
                    <Button
                        style={styles.controlButton}
                        icon={
                            <MaterialCommunityIcons
                                name="account-remove"
                                style={[styles.controlIcon, {color: theme.error}]}
                            />
                        }
                        onPress={show}
                    />
                )}
                groupId={groupId}
                profile={member.profile}
                pending={member.status === GroupMemberStatus.Pending}
            />
        );
        const banMemberButton = member && (
            <BanGroupMemberModal
                activator={(show) => (
                    <Button
                        style={styles.controlButton}
                        icon={<MaterialIcons name="block" style={[styles.controlIcon, {color: theme.error}]} />}
                        onPress={show}
                    />
                )}
                groupId={groupId}
                profile={member.profile}
                pending={member.status === GroupMemberStatus.Pending}
            />
        );
        const promoteAdminButton = member && (
            <GroupPromoteAdminModal
                activator={(show) => (
                    <Button
                        style={styles.controlButton}
                        icon={
                            <MaterialCommunityIcons
                                name="account-star"
                                style={[styles.controlIcon, {color: theme.accentTernary}]}
                            />
                        }
                        onPress={show}
                    />
                )}
                groupId={groupId}
                profile={member.profile}
            />
        );
        const acceptMemberButton = member && (
            <Button
                style={styles.controlButton}
                icon={<MaterialIcons name="person-add" style={[styles.controlIcon, {color: theme.accent}]} />}
                onPress={() => dispatch(setGroupMemberStatus(groupId, member.profile.id, GroupMemberStatus.Approved))}
            />
        );
        const unbanMemberButton = member && member.status === GroupMemberStatus.Banned && (
            <Button
                style={styles.controlButton}
                icon={<MaterialIcons name="cancel" style={[styles.controlIcon, {color: theme.accent}]} />}
                onPress={() => dispatch(deleteGroupMember(groupId, member.profile.id, false))}
            />
        );

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
                            {member.role !== "basic" && (
                                <View style={{flexDirection: "row", alignItems: "center"}}>
                                    {member.role === "admin" && (
                                        <MaterialIcons name="verified-user" style={styles.roleIcon} />
                                    )}
                                    <Text style={styles.role}>{i18n.t(`groups.roles.${member.role}`)}</Text>
                                </View>
                            )}
                        </View>
                        <View style={{flexDirection: "row", alignItems: "center"}}>
                            {adminView && member.status === GroupMemberStatus.Approved && !isLocalUser && (
                                <>
                                    {promoteAdminButton}
                                    {deleteMemberButton}
                                    {banMemberButton}
                                </>
                            )}
                            {adminView && member.status === GroupMemberStatus.Banned && <>{unbanMemberButton}</>}
                            {adminView && member.status === GroupMemberStatus.Pending && (
                                <>
                                    {acceptMemberButton}
                                    {deleteMemberButton}
                                    {banMemberButton}
                                </>
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
            backgroundColor: theme.accentSecondary,
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
        controlButton: {
            padding: 6,
        },
        controlIcon: {
            color: theme.textLight,
            fontSize: 24,
        },
    });
});

export default reduxConnector(withTheme(GroupMemberCard));
