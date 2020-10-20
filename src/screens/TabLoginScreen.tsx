import * as React from "react";
import {View, KeyboardAvoidingView, Text} from "react-native";
import Colors from "../constants/themes";
import {StackScreenProps} from "@react-navigation/stack";
import {LoginTabNavigatorScreens} from "../navigation/types";
import {connect, ConnectedProps} from "react-redux";
import {AppState} from "../state/types";
import {LoginForm} from "../components/forms/LoginForm";
import ForgotPasswordForm from "../components/forms/ForgotPasswordForm";
import {loginTabsStyles} from "../styles/forms";
import {TouchableOpacity} from "react-native-gesture-handler";
import {rootNavigate} from "../navigation/utils";

const mapStateToProps = (state: AppState) => ({
    theme: Colors[state.settings.theme],
    authenticated: state.auth.authenticated,
    onboarded: state.auth.onboarded,
});
const reduxConnector = connect(mapStateToProps);

type TabLoginScreenProps = ConnectedProps<typeof reduxConnector> &
    StackScreenProps<LoginTabNavigatorScreens, "LoginScreen">;

class LoginTabComponent extends React.Component<TabLoginScreenProps> {
    componentDidUpdate() {
        const {authenticated, onboarded} = this.props;
        if (authenticated) {
            if (onboarded) rootNavigate("MainScreen");
            else rootNavigate("OnboardingScreen");
        }
    }

    render(): JSX.Element {
        const {theme, navigation} = this.props;
        return (
            <KeyboardAvoidingView
                behavior="height"
                style={[loginTabsStyles.container, {backgroundColor: theme.background}]}
            >
                <View style={loginTabsStyles.formWrapper}>
                    <LoginForm navigation={navigation}></LoginForm>
                    <TouchableOpacity onPress={() => navigation.navigate("MainScreen")}>
                        <Text style={{fontSize: 22}}>debug: connect</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("OnboardingScreen")}>
                        <Text style={{fontSize: 22}}>debug: onboarding</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        );
    }
}

type TabForgotPasswordProps = ConnectedProps<typeof reduxConnector> &
    StackScreenProps<LoginTabNavigatorScreens, "ForgotPassword">;

class ForgotPasswordTabComponent extends React.Component<TabForgotPasswordProps> {
    render(): JSX.Element {
        const {theme, navigation} = this.props;
        return (
            <View style={[loginTabsStyles.container, {backgroundColor: theme.background}]}>
                <View style={loginTabsStyles.formWrapper}>
                    <ForgotPasswordForm navigation={navigation}></ForgotPasswordForm>
                </View>
            </View>
        );
    }
}

export const SubTabLogin = reduxConnector(LoginTabComponent);
export const SubTabForgotPassword = connect(mapStateToProps)(ForgotPasswordTabComponent);
