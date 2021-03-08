import {StackScreenProps} from "@react-navigation/stack";
import * as React from "react";
import {connect, ConnectedProps} from "react-redux";
import {Theme, ThemeProps} from "../../types";
import {withTheme} from "react-native-elements";
import ScreenWrapper from "../ScreenWrapper";
import {Group} from "../../model/groups";
import {Text, View, StyleSheet} from "react-native";
import {RootNavigatorScreens} from "../../navigation/types";
import {getRouteParams, rootNavigate} from "../../navigation/utils";
import {preTheme} from "../../styles/utils";
import {AppState, MyThunkDispatch} from "../../state/types";
import {fetchGroup, fetchGroupMembers, fetchGroupMembersRefresh, updateGroup} from "../../state/groups/actions";
import GroupPostsView from "../../components/GroupPostsView";
import EditableText from "../../components/EditableText";
import GroupCover from "../../components/GroupCover";
import i18n from "i18n-js";
import {FontAwesome, MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";
import {GroupMemberStatus, GroupRole} from "../../api/dto";
import Button from "../../components/Button";
import WavyHeader from "../../components/headers/WavyHeader";

const reduxConnector = connect((state: AppState) => ({
    groupsDict: state.groups.groupsDict,
}));

// Component props
type GroupScreenProps = ConnectedProps<typeof reduxConnector> & ThemeProps & StackScreenProps<RootNavigatorScreens>;

// Component state
type GroupScreenState = {
    groupId: string | null;
};
const APPROBATION_REQ_INDICATOR_SIZE = 12;

class GroupScreen extends React.Component<GroupScreenProps, GroupScreenState> {
    constructor(props: GroupScreenProps) {
        super(props);
        this.state = {groupId: null};
    }

    componentDidMount(): void {
        const {navigation, route} = this.props;

        navigation.addListener("focus", () => {
            const groupId = getRouteParams(route).groupId as string;
            this.setState({...this.state, groupId});
        });
    }

    componentDidUpdate(oldProps: GroupScreenProps, oldState: GroupScreenState): void {
        const {groupsDict} = this.props;
        const {groupId} = this.state;
        const dispatch = this.props.dispatch as MyThunkDispatch;

        if (groupId && oldState.groupId !== groupId) {
            const isGroupLoaded = groupsDict[groupId];
            if (isGroupLoaded) this.fetchFirstGroupMembers();
            else {
                dispatch(fetchGroup(groupId)).then((group) => {
                    // Redirect away if we're not supposed to be on this group
                    if (!group || group.myStatus !== GroupMemberStatus.Approved)
                        rootNavigate("MainScreen", {screen: "TabGroups", params: {screen: "TabGroupsScreen"}});
                    else this.fetchFirstGroupMembers();
                });
            }
        }
    }

    private fetchFirstGroupMembers(refresh = false): void {
        const dispatch = this.props.dispatch as MyThunkDispatch;
        const group = this.getGroup();
        if (group) {
            if (refresh) {
                dispatch(fetchGroupMembersRefresh(group.id, GroupMemberStatus.Approved));
                dispatch(fetchGroupMembersRefresh(group.id, GroupMemberStatus.Pending));
            }
            dispatch(fetchGroupMembers(group.id, GroupMemberStatus.Approved));
            dispatch(fetchGroupMembers(group.id, GroupMemberStatus.Pending));
        }
    }

    private getGroup(): Group | null {
        const {groupsDict} = this.props;
        const {groupId} = this.state;
        return groupId ? groupsDict[groupId] || null : null;
    }

    render(): JSX.Element {
        const {theme, navigation} = this.props;
        const styles = themedStyles(theme);

        const dispatch = this.props.dispatch as MyThunkDispatch;
        const group = this.getGroup();

        const pendingMemberIds = group ? group.memberIds[GroupMemberStatus.Pending] : [];
        const isAdmin = group && group.myRole === GroupRole.Admin;
        const numApprovedMembers = group?.numApprovedMembers;

        const top = (
            <View style={styles.top}>
                <GroupCover group={group} />
                <WavyHeader color={theme.cardBackground} wavePatternIndex={[2, 4, 6, 7]}>
                    <View style={styles.topInfo}>
                        <EditableText
                            text={group ? group.name : ""}
                            nonEditable={!isAdmin}
                            fontSize={22}
                            numberOfLines={1}
                            maxLength={30}
                            onSubmit={(name: string) => {
                                if (group) dispatch(updateGroup(group.id, {name}));
                            }}
                        />
                        <EditableText
                            text={group ? group.description : ""}
                            placeholder={
                                group
                                    ? isAdmin
                                        ? i18n.t("groups.description.placeholder")
                                        : i18n.t("groups.description.none")
                                    : ""
                            }
                            nonEditable={!isAdmin}
                            fontSize={16}
                            numberOfLines={4}
                            maxLength={150}
                            onSubmit={(description: string) => {
                                if (group) dispatch(updateGroup(group.id, {description}));
                            }}
                        />
                        <View style={styles.members}>
                            <Text style={styles.groupInfo}>
                                {numApprovedMembers === null || numApprovedMembers === undefined
                                    ? ""
                                    : numApprovedMembers === 0
                                    ? i18n.t("groups.members.zero")
                                    : numApprovedMembers === 1
                                    ? i18n.t("groups.members.singular")
                                    : i18n.t("groups.members.plural", {num: numApprovedMembers})}
                            </Text>
                            <Button
                                style={styles.membersButton}
                                icon={
                                    <MaterialCommunityIcons
                                        style={styles.membersButtonIcon}
                                        name="dots-horizontal-circle-outline"
                                    />
                                }
                                onPress={() =>
                                    group &&
                                    rootNavigate("TabGroups", {
                                        screen: "GroupMembersScreen",
                                        params: {groupId: group.id},
                                    })
                                }
                            />
                            <Button
                                style={styles.membersButton}
                                icon={
                                    <MaterialCommunityIcons
                                        style={styles.membersButtonIcon}
                                        name="account-plus-outline"
                                    />
                                }
                                onPress={() =>
                                    group &&
                                    rootNavigate("TabGroups", {
                                        screen: "GroupInviteScreen",
                                        params: {groupId: group.id},
                                    })
                                }
                            />
                            <Button
                                style={styles.membersButton}
                                icon={
                                    <>
                                        <MaterialIcons
                                            style={styles.membersButtonIcon}
                                            name={pendingMemberIds.length > 0 ? "person" : "person-outline"}
                                        />
                                        {pendingMemberIds.length > 0 && (
                                            <View style={styles.approbationRequestIndicatorContainer}>
                                                <FontAwesome
                                                    size={APPROBATION_REQ_INDICATOR_SIZE - 4}
                                                    name="exclamation"
                                                    color={theme.textWhite}
                                                />
                                            </View>
                                        )}
                                    </>
                                }
                                onPress={() =>
                                    group &&
                                    rootNavigate("TabGroups", {
                                        screen: "GroupMembersApprovalScreen",
                                        params: {groupId: group.id},
                                    })
                                }
                            />
                        </View>
                    </View>
                </WavyHeader>
            </View>
        );

        return (
            <ScreenWrapper forceFullWidth>
                <GroupPostsView
                    top={top}
                    navigation={navigation as never}
                    group={group}
                    titleContainerStyle={styles.postsTitle}
                    onRefresh={() => this.fetchFirstGroupMembers(true)}
                />
            </ScreenWrapper>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        top: {
            width: "100%",
            backgroundColor: theme.cardBackground,
            marginBottom: 30,
        },
        topInfo: {
            paddingHorizontal: 15,
            paddingTop: 10,
            paddingBottom: 5,
        },
        members: {
            flexDirection: "row",
            alignItems: "center",
        },
        groupInfo: {
            fontSize: 16,
            color: theme.text,
        },
        postsTitle: {
            marginTop: 10,
        },
        membersButton: {
            padding: 4,
        },
        membersButtonIcon: {
            fontSize: 24,
            color: theme.textLight,
        },
        approbationRequestIndicatorContainer: {
            position: "absolute",
            backgroundColor: theme.error,
            width: APPROBATION_REQ_INDICATOR_SIZE,
            height: APPROBATION_REQ_INDICATOR_SIZE,
            borderRadius: APPROBATION_REQ_INDICATOR_SIZE,
            justifyContent: "center",
            alignItems: "center",
            left: 16,
            bottom: 12,
        },
    });
});

export default reduxConnector(withTheme(GroupScreen));
