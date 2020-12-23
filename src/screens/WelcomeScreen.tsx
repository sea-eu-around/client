import * as React from "react";
import {StyleSheet, Text, View, TouchableOpacity} from "react-native";
import {withTheme} from "react-native-elements";
import {rootNavigate} from "../navigation/utils";
import {preTheme} from "../styles/utils";
import {Theme, ThemeProps} from "../types";
import i18n from "i18n-js";
import {StackScreenProps} from "@react-navigation/stack";
import {RootNavigatorScreens} from "../navigation/types";
import ScreenWrapper from "./ScreenWrapper";
import SemiHighlightedText from "../components/SemiHighlightedText";
import {getLocalSvg} from "../assets";
import {loginTabsStyles} from "../styles/forms";

export type WelcomeScreenProps = ThemeProps & StackScreenProps<RootNavigatorScreens>;

class WelcomeScreen extends React.Component<WelcomeScreenProps> {
    render(): JSX.Element {
        const {theme} = this.props;
        const styles = themedStyles(theme);
        const lstyles = loginTabsStyles(theme);

        const WelcomeImage = getLocalSvg("welcome", () => this.forceUpdate());

        return (
            <ScreenWrapper>
                <View style={styles.container}>
                    <View style={styles.imageContainer}>
                        <WelcomeImage width={"100%"} />
                    </View>
                    <View style={styles.textContainer}>
                        <SemiHighlightedText text={i18n.t("appName")} fontSize={32} textStyle={styles.appName} />
                        <Text style={styles.subtitle} numberOfLines={2}>
                            {i18n.t("welcomeScreen.subtitle")}
                        </Text>
                    </View>
                    <View style={styles.actionsContainer}>
                        <TouchableOpacity
                            style={[lstyles.actionButton, lstyles.actionButtonFilled]}
                            onPress={() => rootNavigate("SigninScreen")}
                        >
                            <Text style={[lstyles.actionText, lstyles.actionTextFilled]}>
                                {i18n.t("welcomeScreen.signIn")}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={lstyles.actionButton} onPress={() => rootNavigate("SignupScreen")}>
                            <Text style={lstyles.actionText}>{i18n.t("welcomeScreen.signUp")}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScreenWrapper>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            width: "85%",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "20%",
        },
        imageContainer: {
            width: "100%",
            height: 0,
            paddingTop: 300,
            justifyContent: "center",
        },

        textContainer: {},
        appName: {
            color: theme.accent,
            fontFamily: "RalewayBold",
        },
        subtitle: {
            color: theme.accent,
            fontFamily: "RalewaySemiBold",
            fontSize: 16,
            textAlign: "center",
            alignSelf: "center",
            maxWidth: 250,
            marginTop: 10,
        },

        actionsContainer: {
            width: "100%",
            marginBottom: 30,
        },
    });
});

export default withTheme(WelcomeScreen);
