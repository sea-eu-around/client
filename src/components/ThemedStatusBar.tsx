import {StatusBar} from "expo-status-bar";
import * as React from "react";
import {connect, ConnectedProps} from "react-redux";
import {AppState} from "../state/types";

// Map props from store
const reduxConnector = connect((state: AppState) => ({
    theme: state.settings.theme,
}));

// Component props
export type ThemedStatusBarProps = ConnectedProps<typeof reduxConnector>;

function ThemedStatusBar(props: ThemedStatusBarProps): JSX.Element {
    const {theme} = props;
    return <StatusBar style={theme == "dark" ? "dark" : "light"} />;
}

export default reduxConnector(ThemedStatusBar);
