import * as React from "react";
import {Text, View, StyleSheet} from "react-native";
import {AppState} from "../../state/types";
import {connect, ConnectedProps} from "react-redux";
import {Theme, ThemeProps} from "../../types";
import {withTheme} from "react-native-elements";
import {preTheme} from "../../styles/utils";

const mapStateToProps = (state: AppState) => ({});
const reduxConnector = connect(mapStateToProps);

type GroupMessagingTabProps = ConnectedProps<typeof reduxConnector> & ThemeProps;

class GroupMessagingTab extends React.Component<GroupMessagingTabProps> {
    render(): JSX.Element {
        const {theme} = this.props;
        const styles = themedStyles(theme);

        return (
            <View style={styles.wrapper}>
                <Text>Not implemented</Text>
            </View>
        );
    }
}

export const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        wrapper: {
            flex: 1,
            paddingHorizontal: 0,
            paddingVertical: 20,
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: theme.background,
        },
    });
});

export default reduxConnector(withTheme(GroupMessagingTab));
