import * as React from "react";
import {Text, TouchableOpacity} from "react-native";
import MainHeader, {MainHeaderStackProps} from "./MainHeader";
import {Group} from "../../model/groups";
import {withTheme} from "react-native-elements";
import {ThemeProps} from "../../types";
import {connect, ConnectedProps} from "react-redux";
import {AppState} from "../../state/types";
import i18n from "i18n-js";

const reduxConnector = connect((state: AppState) => ({
    groupsDict: state.groups.groupsDict,
}));

// Component props
export type GroupInviteScreenHeaderProps = MainHeaderStackProps &
    ThemeProps &
    ConnectedProps<typeof reduxConnector> & {
        groupId: string | null;
    };

class GroupInviteScreenHeaderClass extends React.Component<GroupInviteScreenHeaderProps> {
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
                noSettingsButton
                overrideTitle={i18n.t("groups.inviteNew")}
                rightButtons={[
                    () => (
                        <TouchableOpacity style={{padding: 5}} onPress={() => stackProps.navigation?.goBack()}>
                            <Text style={{fontSize: 16, color: theme.text}}>Done</Text>
                        </TouchableOpacity>
                    ),
                ]}
            />
        );
    }
}

export default reduxConnector(
    withTheme((props: GroupInviteScreenHeaderProps) => <GroupInviteScreenHeaderClass {...props} />),
);
