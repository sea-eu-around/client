import * as React from "react";
import {Text, View, StyleSheet, TouchableOpacity} from "react-native";
import {AppState} from "../state/types";
import themes from "../constants/themes";
import {connect, ConnectedProps} from "react-redux";
import {rootNavigate} from "../navigation/utils";

const mapStateToProps = (state: AppState) => ({
    theme: themes[state.settings.theme],
    registerEmail: state.auth.registerEmail,
});
const reduxConnector = connect(mapStateToProps);

type ValidationEmailSentScreenProps = ConnectedProps<typeof reduxConnector>;

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
    },
    wrapper: {
        width: "70%",
    },
    description: {
        fontSize: 16,
        textAlign: "center",
    },
    email: {
        fontSize: 16,
        textAlign: "center",
        fontWeight: "bold",
    },
    okButton: {
        height: 50,
        marginVertical: 20,
    },
});

function ValidationEmailSentScreen({registerEmail}: ValidationEmailSentScreenProps): JSX.Element {
    return (
        <View style={styles.container}>
            <View style={styles.wrapper}>
                <Text style={{marginVertical: 100, textAlign: "center"}}>image here</Text>
                <Text style={styles.description}>
                    To validate your account, click the link in the email we just sent to
                </Text>
                <Text style={styles.email}>{registerEmail}</Text>

                <TouchableOpacity
                    onPress={() => {
                        rootNavigate("ValidateEmailScreen");
                    }}
                >
                    <Text style={{marginVertical: 30, textAlign: "center", fontSize: 16, color: "blue"}}>
                        debug: click here
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default reduxConnector(ValidationEmailSentScreen);
