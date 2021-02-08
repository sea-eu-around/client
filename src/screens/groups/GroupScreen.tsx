import {StackScreenProps} from "@react-navigation/stack";
import * as React from "react";
import {connect, ConnectedProps} from "react-redux";
import {Theme, ThemeProps} from "../../types";
import {withTheme} from "react-native-elements";
import ScreenWrapper from "../ScreenWrapper";
import {Group} from "../../model/groups";
import {Text, View, StyleSheet} from "react-native";
import {RootNavigatorScreens} from "../../navigation/types";
import {getRouteParams} from "../../navigation/utils";
import {preTheme} from "../../styles/utils";
import {AppState, MyThunkDispatch} from "../../state/types";
import {fetchGroupMembers, updateGroup} from "../../state/groups/actions";
import GroupPostsView from "../../components/GroupPostsView";
import EditableText from "../../components/EditableText";
import GroupCover from "../../components/GroupCover";
import i18n from "i18n-js";

const reduxConnector = connect((state: AppState) => ({
    groupsDict: state.groups.groupsDict,
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
        const {theme, dispatch} = this.props;
        const styles = themedStyles(theme);

        const group = this.getGroup();

        const isAdmin = true;

        return (
            <ScreenWrapper forceFullWidth>
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
                        <Text style={styles.groupInfo}>
                            {group && group.members
                                ? group.members.length === 0
                                    ? i18n.t("groups.members.zero")
                                    : group.members.length === 1
                                    ? i18n.t("groups.members.singular")
                                    : i18n.t("groups.members.plural", {num: group.members.length})
                                : ""}
                        </Text>
                    </View>
                </View>
                <GroupPostsView group={group} containerStyle={styles.posts} />
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
        groupInfo: {
            width: "100%",
            fontSize: 16,
            color: theme.text,
        },
        posts: {
            width: "100%",
            marginVertical: 20,
        },
    });
});

export default reduxConnector(withTheme(GroupScreen));
