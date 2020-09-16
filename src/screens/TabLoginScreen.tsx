import * as React from "react";
import {View, KeyboardAvoidingView, Text} from "react-native";
import Colors from "../constants/themes";
import {StackScreenProps} from "@react-navigation/stack";
import {LoginTabNavigatorScreens} from "../types";
import {connect, ConnectedProps} from "react-redux";
import {AppState} from "../state/types";
import {LoginForm} from "../components/forms/LoginForm";
import ForgotPasswordForm from "../components/forms/ForgotPasswordForm";
import {loginTabsStyles} from "../styles/forms";
import {TouchableOpacity} from "react-native-gesture-handler";

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
                <TouchableOpacity onPress={() => navigation.navigate("MainScreen")}>
                    <Text style={{fontSize: 26}}>Skip</Text>
                </TouchableOpacity>
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
