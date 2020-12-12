import * as React from "react";
import {Text, View, StyleSheet, ActivityIndicator} from "react-native";
import {AppState, MyThunkDispatch} from "../state/types";
import {connect, ConnectedProps} from "react-redux";
import {requestValidateAccount} from "../state/auth/actions";
import {attemptRedirectToApp} from "../navigation/utils";
import i18n from "i18n-js";
import {Theme, ThemeProps} from "../types";
import {preTheme} from "../styles/utils";
import {withTheme} from "react-native-elements";
import {DEBUG_MODE, Environment, ENVIRONMENT} from "../constants/config";
import store from "../state/store";
import {StackScreenProps} from "@react-navigation/stack";
import {RootNavigatorScreens} from "../navigation/types";
import ScreenWrapper from "./ScreenWrapper";

const reduxConnector = connect((state: AppState) => ({
    validated: state.auth.validated,
}));

type ValidateEmailScreenProps = ConnectedProps<typeof reduxConnector> &
    ThemeProps &
    StackScreenProps<RootNavigatorScreens>;

class ValidateEmailScreen extends React.Component<ValidateEmailScreenProps> {
    componentDidMount() {
        const dispatch = this.props.dispatch as MyThunkDispatch;

        // In DEBUG_MODE / staging environment, attempt to use a verification token sent by the server
        const verificationToken = store.getState().auth.verificationToken;
        if (DEBUG_MODE && ENVIRONMENT == Environment.Staging && verificationToken) {
            dispatch(requestValidateAccount(verificationToken));
        } else if (this.props.route.params) {
            // Attempt to extract a validation token out of the URL
            const params = this.props.route.params as {[key: string]: string};
            const {token} = params;
            if (token) dispatch(requestValidateAccount(token));
        }
    }

    render(): JSX.Element {
        const {theme, validated} = this.props;
        const styles = themedStyles(theme);

        return (
            <ScreenWrapper>
                <View style={styles.container}>
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
                                <Text
                                    onPress={() => attemptRedirectToApp("login", "TabSignin")}
                                    style={{color: theme.accent}}
                                >
                                    {i18n.t("emailValidation.success")[1]}
                                </Text>
                            </Text>
                        </>
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
