import * as React from "react";
import {Text, View, StyleSheet, TouchableOpacity, Linking, Platform, ActivityIndicator} from "react-native";
import {AppState} from "../state/types";
import themes from "../constants/themes";
import {connect, ConnectedProps} from "react-redux";
import {formStyle} from "../styles/forms";
import {rootNavigate} from "../navigation/utils";

const mapStateToProps = (state: AppState) => ({
    theme: themes[state.theming.theme],
    validated: state.auth.validated,
});
const reduxConnector = connect(mapStateToProps);

type ValidateEmailScreenProps = ConnectedProps<typeof reduxConnector>;

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
    title: {
        fontSize: 20,
        marginVertical: 20,
        textAlign: "center",
    },
    okButton: {
        height: 50,
        marginVertical: 20,
    },
});

class ValidateEmailScreen extends React.Component<ValidateEmailScreenProps> {
    componentDidMount() {
        if (Platform.OS == "web") {
            // Get the URL
            Linking.getInitialURL().then((url: string | null) => {
                // Extract the validation token out of the URL
                console.log(url);
            });
        }
    }

    render(): JSX.Element {
        const {theme, validated} = this.props;

        return (
            <View style={styles.container}>
                <View style={styles.wrapper}>
                    <Text style={styles.title}>Validating</Text>
                    {!validated && <ActivityIndicator size="large" color={theme.accentSecondary} />}

                    <TouchableOpacity
                        style={[formStyle.buttonMajor, styles.okButton, {backgroundColor: theme.accentSlight}]}
                        onPress={() => {
                            rootNavigate("OnboardingScreen");
                        }}
                    >
                        <Text style={[formStyle.buttonMajorText, {color: theme.text}]}>debug skip</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

export default reduxConnector(ValidateEmailScreen);
