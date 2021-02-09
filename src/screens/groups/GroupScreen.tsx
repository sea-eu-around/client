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
import {fetchGroupMembers, updateGroup} from "../../state/groups/actions";
import GroupPostsView from "../../components/GroupPostsView";
import EditableText from "../../components/EditableText";
import GroupCover from "../../components/GroupCover";
import i18n from "i18n-js";
import {TouchableOpacity} from "react-native-gesture-handler";
import {MaterialCommunityIcons} from "@expo/vector-icons";

const reduxConnector = connect((state: AppState) => ({
    groupsDict: state.groups.groupsDict,
    localUser: state.profile.user,
}));

// Component props
type GroupScreenProps = ConnectedProps<typeof reduxConnector> & ThemeProps & StackScreenProps<RootNavigatorScreens>;

// Component state
type GroupScreenState = {
    groupId: string | null;
};

class GroupScreen extends React.Component<GroupScreenProps, GroupScreenState> {
    constructor(props: GroupScreenProps) {
        super(props);
        this.state = {groupId: null};
    }

    componentDidMount() {
        const {dispatch, navigation, route} = this.props;

        navigation.addListener("focus", () => {
            const groupId = getRouteParams(route).groupId as string;
            this.setState({...this.state, groupId});

            (dispatch as MyThunkDispatch)(fetchGroupMembers(groupId));
        });
    }

    private getGroup(): Group | null {
        const {groupsDict} = this.props;
        const {groupId} = this.state;
        return groupId ? groupsDict[groupId] || null : null;
    }

    render(): JSX.Element {
        const {theme, dispatch, navigation, localUser} = this.props;
        const styles = themedStyles(theme);

        const group = this.getGroup();

        const isAdmin = true;

        return (
            <ScreenWrapper forceFullWidth>
                <GroupPostsView
                    top={
                        <View style={styles.top}>
                            <GroupCover group={group} />
                            <View style={styles.topInfo}>
                                <EditableText
                                    text={group ? group.name : ""}
                                    nonEditable={!group || !isAdmin}
                                    fontSize={22}
                                    numberOfLines={1}
                                    maxLength={30}
                                    onSubmit={(name: string) => {
                                        if (group) (dispatch as MyThunkDispatch)(updateGroup(group.id, {name}));
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
                                    nonEditable={!group || !isAdmin}
                                    fontSize={16}
                                    numberOfLines={4}
                                    maxLength={150}
                                    onSubmit={(description: string) => {
                                        if (group) (dispatch as MyThunkDispatch)(updateGroup(group.id, {description}));
                                    }}
                                />
                                <View style={styles.members}>
                                    <Text style={styles.groupInfo}>
                                        {group && group.members
                                            ? group.members.length === 0
                                                ? i18n.t("groups.members.zero")
                                                : group.members.length === 1
                                                ? i18n.t("groups.members.singular")
                                                : i18n.t("groups.members.plural", {num: group.members.length})
                                            : ""}
                                    </Text>
                                    {group && (
                                        <>
                                            <TouchableOpacity
                                                style={styles.membersButton}
                                                onPress={() =>
                                                    rootNavigate("TabGroups", {
                                                        screen: "GroupMembersScreen",
                                                        params: {groupId: group.id},
                                                    })
                                                }
                                            >
                                                <MaterialCommunityIcons
                                                    style={styles.membersButtonIcon}
                                                    name="dots-horizontal-circle-outline"
                                                />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={styles.membersButton}
                                                onPress={() =>
                                                    rootNavigate("TabGroups", {
                                                        screen: "GroupInviteScreen",
                                                        params: {groupId: group.id},
                                                    })
                                                }
                                            >
                                                <MaterialCommunityIcons
                                                    style={styles.membersButtonIcon}
                                                    name="account-plus-outline"
                                                />
                                            </TouchableOpacity>
                                        </>
                                    )}
                                </View>
                            </View>
                        </View>
                    }
                    navigation={navigation as never}
                    group={group}
                    titleContainerStyle={styles.postsTitle}
                />
            </ScreenWrapper>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        top: {
            width: "100%",
            backgroundColor: theme.accentSlight,
        },
        topInfo: {
            padding: 15,
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
            marginTop: 30,
        },
        membersButton: {
            padding: 4,
        },
        membersButtonIcon: {
            fontSize: 24,
            color: theme.textLight,
        },
    });
});

export default reduxConnector(withTheme(GroupScreen));
