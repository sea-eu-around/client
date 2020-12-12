import * as React from "react";
import {Text, View, StyleSheet} from "react-native";
import {connect, ConnectedProps} from "react-redux";
import {Theme, ThemeProps} from "../../types";
import {withTheme} from "react-native-elements";
import {preTheme} from "../../styles/utils";
import ScreenWrapper from "../ScreenWrapper";

const reduxConnector = connect(() => ({}));

type GroupMessagingTabProps = ConnectedProps<typeof reduxConnector> & ThemeProps;

class GroupMessagingTab extends React.Component<GroupMessagingTabProps> {
    render(): JSX.Element {
        const {theme} = this.props;
        const styles = themedStyles(theme);

        return (
            <ScreenWrapper>
                <View style={styles.wrapper}>
                    <Text style={styles.text}>Not implemented</Text>
                </View>
            </ScreenWrapper>
        );
    }
}

export const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        wrapper: {
            flex: 1,
            justifyContent: "center",
        },
        text: {
            color: theme.text,
        },
    });
});

export default reduxConnector(withTheme(GroupMessagingTab));
