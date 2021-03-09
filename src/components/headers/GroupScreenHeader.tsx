import * as React from "react";
import {TouchableOpacity} from "react-native";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import MainHeader, {MainHeaderStackProps} from "./MainHeader";
import {Group} from "../../model/groups";
import {withTheme} from "react-native-elements";
import {ThemeProps} from "../../types";
import {connect, ConnectedProps} from "react-redux";
import {AppState} from "../../state/types";
import GroupSettingsMenu, {GroupSettingsMenuClass} from "../GroupSettingsMenu";

const reduxConnector = connect((state: AppState) => ({
    groupsDict: state.groups.groupsDict,
}));

// Component props
export type GroupScreenHeaderProps = MainHeaderStackProps &
    ThemeProps &
    ConnectedProps<typeof reduxConnector> & {
        groupId: string | null;
    };

class GroupScreenHeaderClass extends React.Component<GroupScreenHeaderProps> {
    settingsMenuRef = React.createRef<GroupSettingsMenuClass>();

    private getGroup(): Group | null {
        const {groupsDict, groupId} = this.props;
        return groupId ? groupsDict[groupId] || null : null;
    }

    render(): JSX.Element {
        const {theme, ...stackProps} = this.props;

        const group = this.getGroup();

        return (
            <>
                <MainHeader
                    {...stackProps}
                    backButton
                    noAvatar
                    noShadow
                    noSettingsButton
                    wrapperStyle={{position: "absolute", backgroundColor: "transparent", top: 0, left: 0, right: 0}}
                    color={theme.textWhite}
                    buttonBackgroundColor="transparent"
                    overrideTitle=""
                    navigateBackFallback={(nav) =>
                        nav.navigate("MainScreen", {screen: "TabGroups", params: {screen: "TabGroupsScreen"}})
                    }
                    rightButtons={
                        group
                            ? [
                                  ({buttonStyle, iconStyle}) => (
                                      <TouchableOpacity
                                          style={buttonStyle}
                                          onPress={() => this.settingsMenuRef.current?.show(group)}
                                      >
                                          <MaterialCommunityIcons
                                              name="dots-horizontal"
                                              style={[iconStyle, {fontSize: 30}]}
                                          />
                                      </TouchableOpacity>
                                  ),
                              ]
                            : []
                    }
                />
                <GroupSettingsMenu ref={this.settingsMenuRef} />
            </>
        );
    }
}

export default reduxConnector(withTheme((props: GroupScreenHeaderProps) => <GroupScreenHeaderClass {...props} />));
