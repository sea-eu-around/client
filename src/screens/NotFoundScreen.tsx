import {StackScreenProps} from "@react-navigation/stack";
import * as React from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import i18n from "i18n-js";
import {RootNavigatorScreens} from "../navigation/types";
import {Theme, ThemeProps} from "../types";
import {preTheme} from "../styles/utils";
import {withTheme} from "react-native-elements";

export type NotFoundScreenProps = StackScreenProps<RootNavigatorScreens, "NotFoundScreen"> & ThemeProps;

class NotFoundScreen extends React.Component<NotFoundScreenProps> {
    render(): JSX.Element {
        const {navigation, theme} = this.props;
        const styles = themedStyles(theme);

        return (
            <View style={styles.container}>
                <Text style={styles.title}>{i18n.t("pageNotFound")}</Text>
                <Text style={styles.subtitle}>{i18n.t("pageDoesntExist")}</Text>
                <TouchableOpacity onPress={() => navigation.replace("LoginScreen")} style={styles.link}>
                    <Text style={styles.linkText}>{i18n.t("goHome")}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            backgroundColor: theme.background,
        },
        title: {
            fontSize: 64,
            fontWeight: "100",
        },
        subtitle: {
            fontSize: 20,
            fontWeight: "bold",
            marginTop: 50,
        },
        link: {
            paddingVertical: 10,
        },
        linkText: {
            fontSize: 14,
            color: "#2e78b7",
        },
    });
});

export default withTheme(NotFoundScreen);
