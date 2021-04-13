import * as React from "react";
import {Text, View, StyleSheet, TouchableOpacity} from "react-native";
import {AppState} from "../state/types";
import {connect, ConnectedProps} from "react-redux";
import {rootNavigate} from "../navigation/utils";
import {Theme, ThemeProps} from "../types";
import {preTheme} from "../styles/utils";
import {withTheme} from "react-native-elements";
import {FontAwesome} from "@expo/vector-icons";
import {DEBUG_MODE} from "../constants/config";
import ScreenWrapper from "./ScreenWrapper";
import i18n from "i18n-js";
import Button from "../components/Button";

// Map props from state
const reduxConnector = connect((state: AppState) => ({
    registerEmail: state.auth.registerEmail,
}));

type ValidationEmailSentScreenProps = ConnectedProps<typeof reduxConnector> & ThemeProps;

class ValidationEmailSentScreen extends React.Component<ValidationEmailSentScreenProps> {
    render(): JSX.Element {
        const {registerEmail, theme} = this.props;
        const styles = themedStyles(theme);

        return (
            <ScreenWrapper>
                <View style={styles.container}>
                    <FontAwesome name="envelope-o" style={styles.mailIcon}></FontAwesome>
                    <Text style={styles.infoText}>{i18n.t("emailValidation.sent")}</Text>
                    <Text style={[styles.infoText, styles.email]}>{registerEmail}</Text>

                    {DEBUG_MODE && (
                        <TouchableOpacity onPress={() => rootNavigate("ValidateEmailScreen")}>
                            <Text style={[styles.infoText, {marginBottom: 25}]}>Debug: Click here</Text>
                        </TouchableOpacity>
                    )}

                    <View style={styles.actionsContainer}>
                        <Button
                            text={i18n.t("ok")}
                            onPress={() =>
                                rootNavigate("LoginRoot", {
                                    screen: "LoginScreens",
                                    params: {screen: "SigninScreen"},
                                })
                            }
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
            width: "75%",
            justifyContent: "center",
            alignItems: "center",
        },
        infoText: {
            color: theme.themeAwareAccent,
            fontFamily: "RalewaySemiBold",
            fontSize: 18,
            lineHeight: 22,
            textAlign: "center",
            marginTop: 25,
            maxWidth: 300,
        },
        email: {
            width: "100%",
        },
        mailIcon: {
            marginVertical: 30,
            fontSize: 50,
            color: theme.text,
        },
        actionsContainer: {
            width: "100%",
            maxWidth: 300,
            marginBottom: 30,
        },
    });
});

export default reduxConnector(withTheme(ValidationEmailSentScreen));
