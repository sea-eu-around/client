import * as React from "react";
import {Text, View, StyleSheet, Linking, Platform, ActivityIndicator} from "react-native";
import {AppState, MyThunkDispatch} from "../state/types";
import {connect, ConnectedProps} from "react-redux";
import {requestValidateAccount} from "../state/auth/actions";
import {rootNavigate} from "../navigation/utils";
import i18n from "i18n-js";
import {Theme, ThemeProps} from "../types";
import {preTheme} from "../styles/utils";
import {withTheme} from "react-native-elements";

const mapStateToProps = (state: AppState) => ({
    validated: state.auth.validated,
    registerEmail: state.auth.registerEmail,
    verificationToken: state.auth.verificationToken,
});
const reduxConnector = connect(mapStateToProps);

type ValidateEmailScreenProps = ConnectedProps<typeof reduxConnector> & ThemeProps;

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
        const {dispatch, verificationToken} = this.props;
        if (verificationToken) (dispatch as MyThunkDispatch)(requestValidateAccount(verificationToken));
    }

    render(): JSX.Element {
        const {theme, validated} = this.props;
        const styles = themedStyles(theme);

        return (
            <View style={styles.container}>
                <View style={styles.wrapper}>
                    {!validated && (
                        <>
                            <Text style={styles.title}>{i18n.t("emailValidation.validating")}</Text>
                            <ActivityIndicator size="large" color={theme.accentSecondary} />
                        </>
                    )}
                    {validated && (
                        <>
                            <Text style={styles.successText}>
                                {i18n.t("emailValidation.success")[0]}
                                <Text onPress={() => rootNavigate("TabSignin")} style={{color: theme.accent}}>
                                    {i18n.t("emailValidation.success")[1]}
                                </Text>
                            </Text>
                        </>
                    )}
                </View>
            </View>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        container: {
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
            backgroundColor: theme.background,
        },
        wrapper: {
            width: "70%",
        },
        title: {
            fontSize: 20,
            marginVertical: 20,
            textAlign: "center",
            color: theme.text,
        },
        successText: {
            fontSize: 18,
            lineHeight: 40,
            textAlign: "center",
            color: theme.text,
        },
    });
});

export default reduxConnector(withTheme(ValidateEmailScreen));
