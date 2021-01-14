import * as React from "react";
import {StyleSheet, Text, View} from "react-native";
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
import Button from "../components/Button";

export type WelcomeScreenProps = ThemeProps & StackScreenProps<RootNavigatorScreens>;

class WelcomeScreen extends React.Component<WelcomeScreenProps> {
    render(): JSX.Element {
        const {theme} = this.props;
        const styles = themedStyles(theme);

        const WelcomeImage = getLocalSvg("welcome", () => this.forceUpdate());

        return (
            <ScreenWrapper>
                <View style={styles.container}>
                    <View style={styles.imageAndTextContainer}>
                        <View style={styles.imageContainer}>
                            <WelcomeImage />
                        </View>
                        <View style={styles.textContainer}>
                            <SemiHighlightedText text={i18n.t("appName")} fontSize={32} textStyle={styles.appName} />
                            <Text style={styles.subtitle} numberOfLines={2}>
                                {i18n.t("welcomeScreen.subtitle")}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.actionsContainer}>
                        <Button
                            text={i18n.t("welcomeScreen.signIn")}
                            onPress={() => {
                                rootNavigate("LoginRoot", {
                                    screen: "LoginScreens",
                                    params: {screen: "SigninScreen"},
                                });
                            }}
                            skin="rounded-filled"
                        />
                        <Button
                            text={i18n.t("welcomeScreen.signUp")}
                            onPress={() => {
                                rootNavigate("LoginRoot", {
                                    screen: "LoginScreens",
                                    params: {screen: "SignupScreen"},
                                });
                            }}
                            skin="rounded-hollow"
                        />
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
            justifyContent: "space-between",
            alignItems: "center",
        },
        imageAndTextContainer: {
            flex: 1,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
        },
        imageContainer: {
            width: "100%",
            height: 300,
        },
        textContainer: {
            marginVertical: 20,
        },
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
