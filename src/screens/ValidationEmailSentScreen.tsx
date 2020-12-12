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
                    <Text style={styles.description}>
                        To validate your account, click the link in the email we just sent to
                    </Text>
                    <Text style={styles.email}>{registerEmail}</Text>

                    {DEBUG_MODE && (
                        <TouchableOpacity onPress={() => rootNavigate("ValidateEmailScreen")}>
                            <Text style={{marginVertical: 30, textAlign: "center", fontSize: 16, color: "blue"}}>
                                debug: click here
                            </Text>
                        </TouchableOpacity>
                    )}
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
        description: {
            fontSize: 16,
            textAlign: "center",
            color: theme.text,
        },
        mailIcon: {
            marginVertical: 30,
            fontSize: 50,
            color: theme.text,
        },
        email: {
            fontSize: 16,
            fontWeight: "bold",
            color: theme.text,
            width: "100%",
            textAlign: "center",
        },
    });
});

export default reduxConnector(withTheme(ValidationEmailSentScreen));
