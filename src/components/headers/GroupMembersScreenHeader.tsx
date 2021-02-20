import * as React from "react";
import {TouchableOpacity} from "react-native";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import MainHeader, {MainHeaderStackProps} from "./MainHeader";
import {Group} from "../../model/groups";
import {withTheme} from "react-native-elements";
import {ThemeProps} from "../../types";
import {connect, ConnectedProps} from "react-redux";
import {AppState} from "../../state/types";
import {rootNavigate} from "../../navigation/utils";

const reduxConnector = connect((state: AppState) => ({
    groupsDict: state.groups.groupsDict,
}));

// Component props
export type GroupMembersScreenHeaderProps = MainHeaderStackProps &
    ThemeProps &
    ConnectedProps<typeof reduxConnector> & {
        groupId: string | null;
        keepScreenTitle?: boolean;
        noInviteButton?: boolean;
    };

class GroupMembersScreenHeaderClass extends React.Component<GroupMembersScreenHeaderProps> {
    private getGroup(): Group | null {
        const {groupsDict, groupId} = this.props;
        return groupId ? groupsDict[groupId] || null : null;
    }

    render(): JSX.Element {
        const {keepScreenTitle, noInviteButton, ...stackProps} = this.props;

        const group = this.getGroup();

        return (
            <MainHeader
                {...stackProps}
                backButton
                noAvatar
                noShadow
                {...(!keepScreenTitle ? {overrideTitle: group ? group.name : ""} : {})}
                titleStyle={{fontSize: 18}}
                rightButtons={
                    group && !noInviteButton
                        ? [
                              ({buttonStyle, iconStyle}) => (
                                  <TouchableOpacity
                                      style={buttonStyle}
                                      onPress={() =>
                                          group &&
                                          rootNavigate("TabGroups", {
                                              screen: "GroupInviteScreen",
                                              params: {groupId: group.id},
                                          })
                                      }
                                  >
                                      <MaterialCommunityIcons name="account-plus-outline" style={iconStyle} />
                                  </TouchableOpacity>
                              ),
                          ]
                        : []
                }
            />
        );
    }
}

export default reduxConnector(
    withTheme((props: GroupMembersScreenHeaderProps) => <GroupMembersScreenHeaderClass {...props} />),
);
