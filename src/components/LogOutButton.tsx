import * as React from "react";

import i18n from "i18n-js";
import {connect, ConnectedProps} from "react-redux";
import {AppState} from "../state/types";
import themes from "../constants/themes";
import {Text, TextStyle, TouchableOpacity} from "react-native";
import {logout} from "../state/auth/actions";

// Map props from store
const mapStateToProps = (state: AppState) => ({
    theme: themes[state.settings.theme],
});
const reduxConnector = connect(mapStateToProps);

// Component props
export type LogOutButtonProps = ConnectedProps<typeof reduxConnector> & {
    onLogOut: () => void;
    style: TextStyle;
};

const styles = {
    text: {
        fontSize: 20,
    },
};

class LogOutButton extends React.Component<LogOutButtonProps> {
    render(): JSX.Element {
        const {dispatch, theme, onLogOut, style} = this.props;

        return (
            <TouchableOpacity
                onPress={() => {
                    dispatch(logout());
                    if (onLogOut) onLogOut();
                }}
            >
                <Text style={[styles.text, {color: theme.error}, style]}>{i18n.t("logOut")}</Text>
            </TouchableOpacity>
        );
    }
}

export default reduxConnector(LogOutButton);
