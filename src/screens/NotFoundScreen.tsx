import {StackScreenProps} from "@react-navigation/stack";
import * as React from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import i18n from "i18n-js";
import {RootNavigatorScreens} from "../navigation/types";
import {Theme, ThemeProps} from "../types";
import {preTheme} from "../styles/utils";
import {withTheme} from "react-native-elements";
import ScreenWrapper from "./ScreenWrapper";
import {styleTextLight} from "../styles/general";

export type NotFoundScreenProps = StackScreenProps<RootNavigatorScreens, "NotFoundScreen"> & ThemeProps;

class NotFoundScreen extends React.Component<NotFoundScreenProps> {
    render(): JSX.Element {
        const {navigation, theme} = this.props;
        const styles = themedStyles(theme);

        return (
            <ScreenWrapper>
                <View style={styles.container}>
                    <Text style={styles.title}>{i18n.t("pageNotFound")}</Text>
                    <Text style={styles.subtitle}>{i18n.t("pageDoesntExist")}</Text>
                    <TouchableOpacity onPress={() => navigation.replace("LoginScreen")} style={styles.link}>
                        <Text style={styles.linkText}>{i18n.t("goHome")}</Text>
                    </TouchableOpacity>
                </View>
            </ScreenWrapper>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
        },
        title: {
            fontSize: 48,
            ...styleTextLight,
            textAlign: "center",
            color: theme.text,
        },
        subtitle: {
            fontSize: 20,
            marginTop: 50,
            color: theme.text,
        },
        link: {
            paddingVertical: 10,
        },
        linkText: {
            fontSize: 16,
            color: "#2e78b7",
        },
    });
});

export default withTheme(NotFoundScreen);
