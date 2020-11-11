import * as React from "react";
import {Text, View, StyleSheet, TouchableOpacity} from "react-native";
import {AppState} from "../state/types";
import {connect, ConnectedProps} from "react-redux";
import {rootNavigate} from "../navigation/utils";
import {ThemeProps} from "../types";
import {preTheme} from "../styles/utils";
import {withTheme} from "react-native-elements";

// Map props from state
const mapStateToProps = (state: AppState) => ({
    registerEmail: state.auth.registerEmail,
});
const reduxConnector = connect(mapStateToProps);

type ValidationEmailSentScreenProps = ConnectedProps<typeof reduxConnector> & ThemeProps;

class ValidationEmailSentScreen extends React.Component<ValidationEmailSentScreenProps> {
    render(): JSX.Element {
        const {registerEmail, theme} = this.props;
        const styles = themedStyles(theme);

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
}

const themedStyles = preTheme(() => {
    return StyleSheet.create({
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
});

export default reduxConnector(withTheme(ValidationEmailSentScreen));
