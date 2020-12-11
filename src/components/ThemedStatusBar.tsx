import {StatusBar} from "expo-status-bar";
import * as React from "react";
import {withTheme} from "react-native-elements";
import {ThemeProps} from "../types";

// Component props
export type ThemedStatusBarProps = ThemeProps;

function ThemedStatusBar(props: ThemedStatusBarProps): JSX.Element {
    const {theme} = props;
    return <StatusBar style={theme.id == "dark" ? "light" : "dark"} />;
}

export default withTheme(ThemedStatusBar);
