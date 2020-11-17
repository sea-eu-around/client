import {FontAwesome} from "@expo/vector-icons";
import * as React from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {withTheme} from "react-native-elements";
import {rootNavigate} from "../../navigation/utils";
import {preTheme} from "../../styles/utils";
import {Theme, ThemeProps} from "../../types";
import i18n from "i18n-js";

export type OnboardingSuccessfulScreenProps = ThemeProps;

class OnboardingSuccessfulScreen extends React.Component<OnboardingSuccessfulScreenProps> {
    render(): JSX.Element {
        const {theme} = this.props;
        const styles = themedStyles(theme);

        return (
            <View style={styles.container}>
                <FontAwesome style={styles.icon} name="home"></FontAwesome>
                <Text style={styles.title}>{i18n.t("onboarding.profileCreated")}</Text>
                <View style={styles.separator} />
                <TouchableOpacity style={styles.button} onPress={() => rootNavigate("MainScreen")}>
                    <Text style={styles.buttonText}>{i18n.t("onboarding.getStarted")}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.background,
        },
        title: {
            width: "85%",
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
            borderBottomWidth: 0.75,
            borderBottomColor: theme.textLight,
        },
        buttonText: {
            fontFamily: "sans-serif-thin",
            fontSize: 20,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            color: theme.text,
        },
    });
});

export default withTheme(OnboardingSuccessfulScreen);
