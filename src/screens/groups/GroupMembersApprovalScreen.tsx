import {StackScreenProps} from "@react-navigation/stack";
import * as React from "react";
import {connect, ConnectedProps} from "react-redux";
import {AppState} from "../../state/types";
import {TabGroupsRoot} from "../../navigation/types";
import ScreenWrapper from "../ScreenWrapper";
import {Group, GroupMember} from "../../model/groups";
import {getRouteParams} from "../../navigation/utils";
import GroupMembersView from "../../components/GroupMembersView";
import {GroupMemberStatus, GroupRole} from "../../api/dto";
import {NavigationProp} from "@react-navigation/native";
import GroupMemberCard from "../../components/cards/GroupMemberCard";
import i18n from "i18n-js";

const reduxConnector = connect((state: AppState) => ({
    groupsDict: state.groups.groupsDict,
}));

// Component props
type GroupMembersApprovalScreenProps = ConnectedProps<typeof reduxConnector> &
    StackScreenProps<TabGroupsRoot, "GroupMembersApprovalScreen">;

// Component state
type GroupMembersApprovalScreenState = {
    groupId: string | null;
};

class GroupMembersApprovalScreen extends React.Component<
    GroupMembersApprovalScreenProps,
    GroupMembersApprovalScreenState
> {
    constructor(props: GroupMembersApprovalScreenProps) {
        super(props);
        this.state = {groupId: null};
    }

    componentDidMount() {
        const {navigation, route} = this.props;

        navigation.addListener("focus", () => {
            const groupId = getRouteParams(route).groupId as string;
            this.setState({...this.state, groupId});
        });
    }

    private getGroup(): Group | null {
        const {groupsDict} = this.props;
        const {groupId} = this.state;
        return groupId ? groupsDict[groupId] || null : null;
    }

    render(): JSX.Element {
        const {navigation} = this.props;

        const group = this.getGroup();
        const isAdmin = group?.myRole === GroupRole.Admin;

        return (
            <ScreenWrapper>
                <GroupMembersView
                    group={group}
                    navigation={(navigation as unknown) as NavigationProp<never>}
                    status={GroupMemberStatus.Pending}
                    renderItem={(member: GroupMember) =>
                        group ? (
                            <GroupMemberCard
                                key={`${group.id}-${member.profile.id}`}
                                groupId={group.id}
                                member={member}
                                adminView={isAdmin}
                            />
                        ) : (
                            <></>
                        )
                    }
                    noResultsText={i18n.t("groups.members.approval.noResults")}
                />
            </ScreenWrapper>
        );
    }
}

export default reduxConnector(GroupMembersApprovalScreen);
