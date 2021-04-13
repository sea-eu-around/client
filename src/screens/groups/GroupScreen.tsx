import {StackScreenProps} from "@react-navigation/stack";
import * as React from "react";
import {Theme, ThemeProps} from "../../types";
import {withTheme} from "react-native-elements";
import ScreenWrapper from "../ScreenWrapper";
import {Group} from "../../model/groups";
import {Text, View, StyleSheet} from "react-native";
import {RootNavigatorScreens} from "../../navigation/types";
import {getRouteParams, rootNavigate} from "../../navigation/utils";
import {preTheme} from "../../styles/utils";
import {MyThunkDispatch} from "../../state/types";
import {fetchGroupMembers, fetchGroupMembersRefresh, updateGroup} from "../../state/groups/actions";
import GroupPostsView from "../../components/GroupPostsView";
import EditableText from "../../components/EditableText";
import GroupCover, {GROUP_COVER_HEIGHT} from "../../components/GroupCover";
import i18n from "i18n-js";
import {FontAwesome, MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";
import {GroupMemberStatus, GroupRole} from "../../api/dto";
import Button from "../../components/Button";
import WavyHeader from "../../components/headers/WavyHeader";
import GroupProvider from "../../components/providers/GroupProvider";
import store from "../../state/store";
import GroupScreenHeader, {GroupScreenHeaderClass} from "../../components/headers/GroupScreenHeader";
import themes from "../../constants/themes";

// Component props
type GroupScreenProps = ThemeProps & StackScreenProps<RootNavigatorScreens>;

// Component state
type GroupScreenState = {
    groupId: string | null;
};

const APPROBATION_REQ_INDICATOR_SIZE = 12;

class GroupScreen extends React.Component<GroupScreenProps, GroupScreenState> {
    headerRef = React.createRef<GroupScreenHeaderClass>();

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

    private fetchFirstGroupMembers(group: Group, refresh = false): void {
        const dispatch = store.dispatch as MyThunkDispatch;
        if (refresh) {
            dispatch(fetchGroupMembersRefresh(group.id, GroupMemberStatus.Approved));
            dispatch(fetchGroupMembersRefresh(group.id, GroupMemberStatus.Pending));
        }
        dispatch(fetchGroupMembers(group.id, GroupMemberStatus.Approved));
        dispatch(fetchGroupMembers(group.id, GroupMemberStatus.Pending));
    }

    private renderTop(group: Group | null): JSX.Element {
        const {theme} = this.props;
        const {groupId} = this.state;
        const styles = themedStyles(theme);

        const dispatch = store.dispatch as MyThunkDispatch;

        const pendingMemberIds = group ? group.memberIds[GroupMemberStatus.Pending] : [];
        const isAdmin = group && group.myRole === GroupRole.Admin;
        const numApprovedMembers = group?.numApprovedMembers;

        return (
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
                            onSubmit={(name: string) => group && dispatch(updateGroup(group.id, {name}))}
                        />
                        <EditableText
                            text={group ? group.description : ""}
                            placeholder={group ? i18n.t(`groups.description.${isAdmin ? "placeholder" : "none"}`) : ""}
                            nonEditable={!isAdmin}
                            fontSize={16}
                            numberOfLines={4}
                            maxLength={150}
                            onSubmit={(description: string) => group && dispatch(updateGroup(group.id, {description}))}
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
                                    groupId &&
                                    rootNavigate("TabGroups", {screen: "GroupMembersScreen", params: {groupId}})
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
                                    groupId &&
                                    rootNavigate("TabGroups", {screen: "GroupInviteScreen", params: {groupId}})
                                }
                            />
                            {isAdmin && (
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
                                                        color={themes.dark.text}
                                                    />
                                                </View>
                                            )}
                                        </>
                                    }
                                    onPress={() =>
                                        groupId &&
                                        rootNavigate("TabGroups", {
                                            screen: "GroupMembersApprovalScreen",
                                            params: {groupId},
                                        })
                                    }
                                />
                            )}
                        </View>
                    </View>
                </WavyHeader>
            </View>
        );
    }

    render(): JSX.Element {
        const {theme, navigation} = this.props;
        const {groupId} = this.state;
        const styles = themedStyles(theme);
        return (
            <ScreenWrapper forceFullWidth>
                <GroupProvider
                    groupId={groupId}
                    onGroupReady={(group) =>
                        group.myStatus === GroupMemberStatus.Approved && this.fetchFirstGroupMembers(group)
                    }
                    redirectIfNotApproved
                >
                    {({group}) => (
                        <GroupPostsView
                            top={this.renderTop(group)}
                            navigation={navigation as never}
                            group={group}
                            titleContainerStyle={styles.postsTitle}
                            onRefresh={() => group && this.fetchFirstGroupMembers(group, true)}
                            onScroll={(y) => this.headerRef.current?.toggleTransparentMode(y <= GROUP_COVER_HEIGHT)}
                        />
                    )}
                </GroupProvider>
                <GroupScreenHeader ref={this.headerRef} groupId={getRouteParams(this.props.route).groupId as string} />
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

export default withTheme(GroupScreen);
