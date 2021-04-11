import {StackScreenProps} from "@react-navigation/stack";
import * as React from "react";
import {TabGroupsRoot} from "../../navigation/types";
import ScreenWrapper from "../ScreenWrapper";
import {GroupMember} from "../../model/groups";
import {getRouteParams} from "../../navigation/utils";
import GroupMembersView from "../../components/GroupMembersView";
import {GroupMemberStatus, GroupRole} from "../../api/dto";
import {NavigationProp} from "@react-navigation/native";
import GroupMemberCard from "../../components/cards/GroupMemberCard";
import i18n from "i18n-js";
import GroupProvider from "../../components/providers/GroupProvider";

// Component props
type GroupMembersApprovalScreenProps = StackScreenProps<TabGroupsRoot, "GroupMembersApprovalScreen">;

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

    componentDidMount(): void {
        const {navigation, route} = this.props;

        navigation.addListener("focus", () => {
            const groupId = getRouteParams(route).groupId as string;
            this.setState({...this.state, groupId});
        });
    }

    render(): JSX.Element {
        const {navigation} = this.props;
        const {groupId} = this.state;

        return (
            <ScreenWrapper>
                <GroupProvider groupId={groupId} redirectIfNotApproved>
                    {({group}) => (
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
                                        adminView={group?.myRole === GroupRole.Admin}
                                    />
                                ) : (
                                    <></>
                                )
                            }
                            noResultsText={i18n.t("groups.members.approval.noResults")}
                        />
                    )}
                </GroupProvider>
            </ScreenWrapper>
        );
    }
}

export default GroupMembersApprovalScreen;
