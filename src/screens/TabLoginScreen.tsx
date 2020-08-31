import * as React from "react";
import {View, KeyboardAvoidingView} from "react-native";
import Colors from "../constants/themes";
import {StackScreenProps} from "@react-navigation/stack";
import {LoginTabNavigatorScreens} from "../types";
import {connect, ConnectedProps} from "react-redux";
import {AppState} from "../state/types";
import {LoginForm} from "../components/LoginForm";
import ForgotPasswordForm from "../components/ForgotPasswordForm";
import {loginTabsStyles} from "../styles/forms";

const mapStateToProps = (state: AppState) => ({
    theme: Colors[state.theming.theme],
});
const reduxConnector = connect(mapStateToProps);

type TabLoginScreenProps = ConnectedProps<typeof reduxConnector> &
    StackScreenProps<LoginTabNavigatorScreens, "LoginScreen">;

function LoginTabComponent({theme, navigation}: TabLoginScreenProps): JSX.Element {
    return (
        <KeyboardAvoidingView
            behavior="height"
            style={[loginTabsStyles.container, {backgroundColor: theme.background}]}
        >
            <View style={loginTabsStyles.formWrapper}>
                <LoginForm
                    onSuccessfulSubmit={() => navigation.navigate("MainScreen")}
                    navigation={navigation}
                ></LoginForm>
            </View>
        </KeyboardAvoidingView>
    );
}

type TabForgotPasswordProps = ConnectedProps<typeof reduxConnector> &
    StackScreenProps<LoginTabNavigatorScreens, "ForgotPassword">;

function ForgotPasswordTabComponent({theme, navigation}: TabForgotPasswordProps): JSX.Element {
    return (
        <View style={[loginTabsStyles.container, {backgroundColor: theme.background}]}>
            <View style={loginTabsStyles.formWrapper}>
                <ForgotPasswordForm navigation={navigation}></ForgotPasswordForm>
            </View>
        </View>
    );
}

export const SubTabLogin = reduxConnector(LoginTabComponent);
export const SubTabForgotPassword = connect(mapStateToProps)(ForgotPasswordTabComponent);
