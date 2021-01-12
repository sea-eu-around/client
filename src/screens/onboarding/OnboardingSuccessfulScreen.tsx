import {FontAwesome} from "@expo/vector-icons";
import * as React from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {withTheme} from "react-native-elements";
import {rootNavigate} from "../../navigation/utils";
import {preTheme} from "../../styles/utils";
import {Theme, ThemeProps} from "../../types";
import i18n from "i18n-js";
import {styleTextLight} from "../../styles/general";
import ScreenWrapper from "../ScreenWrapper";

export type OnboardingSuccessfulScreenProps = ThemeProps;

class OnboardingSuccessfulScreen extends React.Component<OnboardingSuccessfulScreenProps> {
    render(): JSX.Element {
        const {theme} = this.props;
        const styles = themedStyles(theme);

        return (
            <ScreenWrapper>
                <View style={styles.container}>
                    <FontAwesome style={styles.icon} name="home"></FontAwesome>
                    <Text style={styles.title}>{i18n.t("onboarding.success.title")}</Text>
                    <View style={styles.separator} />
                    <TouchableOpacity style={styles.button} onPress={() => rootNavigate("MainScreen")}>
                        <Text style={styles.buttonText}>{i18n.t("onboarding.success.button")}</Text>
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
            paddingHorizontal: 50,
            alignItems: "center",
            justifyContent: "center",
        },
        title: {
            textAlign: "center",
            fontSize: 20,
            letterSpacing: 0.5,
            color: theme.text,
        },
        icon: {
            color: theme.text,
            fontSize: 40,
            marginVertical: 20,
        },
        separator: {
            marginVertical: 30,
            height: 1,
            width: "80%",
            backgroundColor: theme.cardBackground,
        },
        button: {
            marginVertical: 20,
            padding: 5,
            borderBottomWidth: 0.6,
            borderBottomColor: theme.textLight,
        },
        buttonText: {
            ...styleTextLight,
            fontSize: 20,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            color: theme.text,
        },
    });
});

export default withTheme(OnboardingSuccessfulScreen);
