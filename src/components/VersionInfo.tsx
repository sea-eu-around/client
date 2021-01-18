import * as React from "react";
import {StyleSheet, Text, View} from "react-native";
import {withTheme} from "react-native-elements";
import {APP_VERSION} from "../constants/config";
import {preTheme} from "../styles/utils";
import {Theme, ThemeProps} from "../types";

// Component props
export type VersionInfoProps = ThemeProps;

function VersionInfo(props: VersionInfoProps): JSX.Element {
    const {theme} = props;
    const styles = themedStyles(theme);

    return (
        <View style={styles.versionInfoContainer}>
            <Text style={styles.versionText}>{APP_VERSION} </Text>
        </View>
    );
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        versionInfoContainer: {
            position: "absolute",
            flexDirection: "row",
            alignItems: "center",
            bottom: 5,
            left: 5,
        },
        versionText: {color: theme.textLight, fontSize: 12},
        versionDisclaimerIcon: {color: theme.error, fontSize: 13},
    });
});

export default withTheme(VersionInfo);
