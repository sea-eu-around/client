import {MaterialCommunityIcons} from "@expo/vector-icons";
import * as React from "react";
import {StyleSheet, TouchableOpacity, View} from "react-native";
import {withTheme} from "react-native-elements";
import {toggleTheme} from "../state/settings/actions";
import store from "../state/store";
import {preTheme} from "../styles/utils";
import {Theme, ThemeProps} from "../types";

// Component props
export type FloatingThemeToggleProps = ThemeProps;

function FloatingThemeToggle(props: FloatingThemeToggleProps): JSX.Element {
    const {theme} = props;
    const styles = themedStyles(theme);

    return (
        <View style={styles.toggleThemeContainer}>
            <TouchableOpacity style={styles.toggleThemeButton} onPress={() => store.dispatch(toggleTheme())}>
                <MaterialCommunityIcons style={styles.toggleThemeIcon} name="theme-light-dark" color="black" />
            </TouchableOpacity>
        </View>
    );
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        toggleThemeContainer: {
            position: "absolute",
            bottom: 0,
            right: 0,
        },
        toggleThemeButton: {
            width: 48,
            height: 48,
            justifyContent: "center",
            alignItems: "center",
        },
        toggleThemeIcon: {
            fontSize: 26,
            color: theme.textLight,
        },
    });
});

export default withTheme(FloatingThemeToggle);
