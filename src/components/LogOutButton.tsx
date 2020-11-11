import * as React from "react";
import i18n from "i18n-js";
import {Text, TextStyle, TouchableOpacity, StyleSheet} from "react-native";
import {logout} from "../state/auth/actions";
import {Theme, ThemeProps} from "../types";
import {withTheme} from "react-native-elements";
import {preTheme} from "../styles/utils";
import {connect, ConnectedProps} from "react-redux";

// Map props from store
const reduxConnector = connect();

// Component props
export type LogOutButtonProps = {
    onLogOut: () => void;
    style: TextStyle;
} & ConnectedProps<typeof reduxConnector> &
    ThemeProps;

class LogOutButton extends React.Component<LogOutButtonProps> {
    render(): JSX.Element {
        const {dispatch, theme, onLogOut, style} = this.props;
        const styles = themedStyles(theme);

        return (
            <TouchableOpacity
                onPress={() => {
                    dispatch(logout());
                    if (onLogOut) onLogOut();
                }}
            >
                <Text style={[styles.text, style]}>{i18n.t("logOut")}</Text>
            </TouchableOpacity>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        text: {
            fontSize: 20,
            color: theme.error,
        },
    });
});

export default reduxConnector(withTheme(LogOutButton));
