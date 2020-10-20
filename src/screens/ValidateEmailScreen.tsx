import * as React from "react";
import {Text, View, StyleSheet, Linking, Platform, ActivityIndicator} from "react-native";
import {AppState, MyThunkDispatch} from "../state/types";
import themes from "../constants/themes";
import {connect, ConnectedProps} from "react-redux";
import {requestValidateAccount} from "../state/auth/actions";
import {rootNavigate} from "../navigation/utils";

const mapStateToProps = (state: AppState) => ({
    theme: themes[state.settings.theme],
    validated: state.auth.validated,
    registerEmail: state.auth.registerEmail,
    verificationToken: state.auth.verificationToken,
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

        // TODO remove this: temporary email validation request
        const {dispatch, verificationToken, registerEmail} = this.props;
        if (verificationToken) (dispatch as MyThunkDispatch)(requestValidateAccount(verificationToken, registerEmail));
    }

    componentDidUpdate() {
        if (this.props.validated) rootNavigate("TabLogin");
    }

    render(): JSX.Element {
        const {theme, validated} = this.props;

        return (
            <View style={styles.container}>
                <View style={styles.wrapper}>
                    <Text style={styles.title}>Validating</Text>
                    {!validated && <ActivityIndicator size="large" color={theme.accentSecondary} />}
                </View>
            </View>
        );
    }
}

/*
<TouchableOpacity
    style={[formStyle.buttonMajor, styles.okButton, {backgroundColor: theme.accentSlight}]}
    onPress={() => {
        rootNavigate("OnboardingScreen");
    }}
>
    <Text style={[formStyle.buttonMajorText, {color: theme.text}]}>debug skip</Text>
</TouchableOpacity>
*/

export default reduxConnector(ValidateEmailScreen);
