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
import {statusBarRef} from "../ThemedStatusBar";
import themes from "../../constants/themes";

const reduxConnector = connect(
    (state: AppState) => ({
        groupsDict: state.groups.groupsDict,
    }),
    null,
    null,
    {forwardRef: true},
);

// Component props
export type GroupScreenHeaderProps = MainHeaderStackProps &
    ThemeProps &
    ConnectedProps<typeof reduxConnector> & {
        groupId: string | null;
    };

type GroupScreenHeaderState = {transparent: boolean};

export class GroupScreenHeaderClass extends React.Component<GroupScreenHeaderProps, GroupScreenHeaderState> {
    settingsMenuRef = React.createRef<GroupSettingsMenuClass>();

    constructor(props: GroupScreenHeaderProps) {
        super(props);
        this.state = {transparent: true};
    }

    private getGroup(): Group | null {
        const {groupsDict, groupId} = this.props;
        return groupId ? groupsDict[groupId] || null : null;
    }

    toggleTransparentMode(transparent: boolean): void {
        if (this.state.transparent !== transparent) {
            this.setState({transparent});
            statusBarRef.current?.setStyle(transparent ? "light" : undefined); // setting undefined will use the default depending on the theme
        }
    }

    render(): JSX.Element {
        const {theme, ...stackProps} = this.props;
        const {transparent} = this.state;

        const group = this.getGroup();

        return (
            <>
                <MainHeader
                    {...stackProps}
                    backButton
                    noAvatar
                    noShadow
                    noSettingsButton
                    wrapperStyle={[
                        {
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            zIndex: 10,
                        },
                        transparent && {backgroundColor: "transparent"},
                    ]}
                    color={transparent ? themes.dark.text : theme.text}
                    buttonBackgroundColor="transparent"
                    overrideTitle={transparent ? "" : group?.name || ""}
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

export default reduxConnector(withTheme(GroupScreenHeaderClass));
