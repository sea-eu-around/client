import * as React from "react";
import {TouchableOpacity} from "react-native";
import {MaterialIcons} from "@expo/vector-icons";
import MainHeader, {MainHeaderStackProps} from "./MainHeader";
import {Group} from "../../model/groups";
import {withTheme} from "react-native-elements";
import {ThemeProps} from "../../types";
import {connect, ConnectedProps} from "react-redux";
import {AppState} from "../../state/types";

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
    private getGroup(): Group | null {
        const {groupsDict, groupId} = this.props;
        return groupId ? groupsDict[groupId] || null : null;
    }

    render(): JSX.Element {
        const {theme, ...stackProps} = this.props;

        // const group = this.getGroup();

        return (
            <MainHeader
                {...stackProps}
                backButton
                noAvatar
                noShadow
                wrapperStyle={{position: "absolute", backgroundColor: "transparent", top: 0, left: 0, right: 0}}
                color={theme.textWhite}
                buttonBackgroundColor="transparent"
                // overrideTitle={group ? group.name : ""}
                overrideTitle=""
                rightButtons={[
                    ({buttonStyle, iconStyle}) => (
                        <TouchableOpacity style={buttonStyle} /*onPress={() => rootNavigate("MatchHistoryScreen")}*/>
                            <MaterialIcons name="search" style={iconStyle} />
                        </TouchableOpacity>
                    ),
                ]}
            />
        );
    }
}

export default reduxConnector(withTheme((props: GroupScreenHeaderProps) => <GroupScreenHeaderClass {...props} />));
