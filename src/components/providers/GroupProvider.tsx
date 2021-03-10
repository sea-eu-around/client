import React from "react";
import {connect, ConnectedProps} from "react-redux";
import {AppState, MyThunkDispatch} from "../../state/types";
import {fetchGroup} from "../../state/groups/actions";
import {Group} from "../../model/groups";
import {GroupMemberStatus} from "../../api/dto";
import {rootNavigate} from "../../navigation/utils";

// Map props from store
const reduxConnector = connect((state: AppState) => ({
    groupsDict: state.groups.groupsDict,
}));

export type GroupProviderProps = ConnectedProps<typeof reduxConnector> & {
    groupId?: string | null;
    onGroupReady?: (group: Group) => void;
    children: (props: {group: Group | null}) => React.ReactElement | null;
    redirectIfNotApproved?: boolean;
};

/**
 * This provider receives a group ID and loads the group if needed, passing it to its child.
 */
class GroupProvider extends React.Component<GroupProviderProps> {
    private redirect(): void {
        rootNavigate("MainScreen", {screen: "TabGroups", params: {screen: "TabGroupsScreen"}});
    }

    private setGroupReady(group: Group) {
        const {onGroupReady, redirectIfNotApproved} = this.props;

        if (onGroupReady) onGroupReady(group);

        if (redirectIfNotApproved) {
            // Redirect away if we're not supposed to be on this group
            if (group.myStatus !== GroupMemberStatus.Approved) this.redirect();
        }
    }

    componentDidUpdate(oldProps: GroupProviderProps): void {
        const {groupsDict, groupId} = this.props;
        const dispatch = this.props.dispatch as MyThunkDispatch;

        if (groupId && oldProps.groupId !== groupId) {
            const isGroupLoaded = groupsDict[groupId];
            if (isGroupLoaded) this.setGroupReady(groupsDict[groupId]);
            else {
                dispatch(fetchGroup(groupId)).then((group) => {
                    if (group) this.setGroupReady(group);
                    else this.redirect();
                });
            }
        }
    }

    render(): JSX.Element {
        const {children, groupId, groupsDict} = this.props;
        const group = groupId ? groupsDict[groupId] || null : null;
        return children({group}) || <></>;
    }
}

export default reduxConnector(GroupProvider);
