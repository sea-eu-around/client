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
import store from "../state/store";

export type NotFoundScreenProps = StackScreenProps<RootNavigatorScreens, "NotFoundScreen"> & ThemeProps;

class NotFoundScreen extends React.Component<NotFoundScreenProps> {
    render(): JSX.Element {
        const {navigation, theme} = this.props;
        const styles = themedStyles(theme);

        return (
            <ScreenWrapper>
                <View style={styles.container}>
                    <Text style={styles.title}>{i18n.t("notFoundScreen.title")}</Text>
                    <Text style={styles.subtitle}>{i18n.t("notFoundScreen.subtitle")}</Text>
                    <TouchableOpacity
                        onPress={() => {
                            const {authenticated, onboarded} = store.getState().auth;
                            if (authenticated) {
                                if (onboarded) navigation.replace("MainScreen");
                                else navigation.replace("OnboardingScreen");
                            } else navigation.replace("LoginRoot");
                        }}
                        style={styles.link}
                    >
                        <Text style={styles.linkText}>{i18n.t("notFoundScreen.redirect")}</Text>
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
