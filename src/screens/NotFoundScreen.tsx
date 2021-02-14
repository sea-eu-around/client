import {StackScreenProps} from "@react-navigation/stack";
import * as React from "react";
import {StyleSheet, Text} from "react-native";
import i18n from "i18n-js";
import {RootNavigatorScreens} from "../navigation/types";
import {Theme, ThemeProps} from "../types";
import {preTheme} from "../styles/utils";
import {withTheme} from "react-native-elements";
import ScreenWrapper from "./ScreenWrapper";
import {styleTextLight} from "../styles/general";
import store from "../state/store";
import Button from "../components/Button";

export type NotFoundScreenProps = StackScreenProps<RootNavigatorScreens, "NotFoundScreen"> & ThemeProps;

class NotFoundScreen extends React.Component<NotFoundScreenProps> {
    render(): JSX.Element {
        const {navigation, theme} = this.props;
        const styles = themedStyles(theme);

        return (
            <ScreenWrapper containerStyle={styles.container}>
                <Text style={styles.title}>{i18n.t("notFoundScreen.title")}</Text>
                <Text style={styles.subtitle}>{i18n.t("notFoundScreen.subtitle")}</Text>
                <Button
                    onPress={() => {
                        const {authenticated, onboarded} = store.getState().auth;
                        if (authenticated) {
                            if (onboarded) navigation.replace("MainScreen");
                            else navigation.replace("OnboardingScreen");
                        } else navigation.replace("LoginRoot");
                    }}
                    skin="rounded-filled"
                    style={styles.redirectButton}
                    text={i18n.t("notFoundScreen.redirect")}
                />
            </ScreenWrapper>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        container: {
            justifyContent: "center",
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
            marginBottom: 20,
            color: theme.text,
        },
        redirectButton: {
            maxWidth: 280,
        },
    });
});

export default withTheme(NotFoundScreen);
