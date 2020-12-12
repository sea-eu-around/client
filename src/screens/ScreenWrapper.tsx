import * as React from "react";
import {Platform, StyleSheet, View} from "react-native";
import {withTheme} from "react-native-elements";
import {Theme, ThemeProps} from "../types";
import {preTheme} from "../styles/utils";

type ScreenWrapperProps = ThemeProps;

class ScreenWrapper extends React.Component<ScreenWrapperProps> {
    render(): JSX.Element {
        const {theme} = this.props;
        const styles = themedStyles(theme);

        return (
            <View style={styles.wrapper}>
                <View style={styles.container}>{this.props.children}</View>
            </View>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        wrapper: {
            flex: 1,
            backgroundColor: theme.background,
        },
        container: {
            flex: 1,
            alignItems: "center",
            ...(Platform.OS === "web" ? {maxWidth: 1000} : {}),
        },
    });
});

export default withTheme(ScreenWrapper);
