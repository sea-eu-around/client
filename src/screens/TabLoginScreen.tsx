import * as React from "react";
import {View, KeyboardAvoidingView, Text} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {LoginTabNavigatorScreens} from "../navigation/types";
import {MyThunkDispatch} from "../state/types";
import {LoginForm} from "../components/forms/LoginForm";
import ForgotPasswordForm from "../components/forms/ForgotPasswordForm";
import {loginTabsStyles} from "../styles/forms";
import {TouchableOpacity} from "react-native-gesture-handler";
import {debugConnect} from "../state/auth/actions";
import {rootNavigate} from "../navigation/utils";
import {ThemeProps} from "../types";
import store from "../state/store";
import {withTheme} from "react-native-elements";

type TabLoginScreenProps = ThemeProps & StackScreenProps<LoginTabNavigatorScreens, "LoginScreen">;

class LoginTabComponent extends React.Component<TabLoginScreenProps> {
    render(): JSX.Element {
        const {theme, navigation} = this.props;
        const styles = loginTabsStyles(theme);

        return (
            <KeyboardAvoidingView behavior="height" style={styles.container}>
                <View style={styles.formWrapper}>
                    <LoginForm navigation={navigation}></LoginForm>
                    <View style={{flexDirection: "row"}}>
                        <Text style={{fontSize: 20}}>debug:&nbsp;&nbsp;&nbsp;</Text>
                        <TouchableOpacity onPress={() => rootNavigate("MainScreen")}>
                            <Text style={{fontSize: 20}}>access</Text>
                        </TouchableOpacity>
                        <Text style={{fontSize: 20}}> | </Text>
                        <TouchableOpacity
                            onPress={() => {
                                (store.dispatch as MyThunkDispatch)(debugConnect());
                            }}
                        >
                            <Text style={{fontSize: 20}}>register</Text>
                        </TouchableOpacity>
                        <Text style={{fontSize: 20}}> | </Text>
                        <TouchableOpacity onPress={() => navigation.navigate("OnboardingScreen")}>
                            <Text style={{fontSize: 20}}>on-boarding</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        );
    }
}

type TabForgotPasswordProps = ThemeProps & StackScreenProps<LoginTabNavigatorScreens, "ForgotPassword">;

class ForgotPasswordTabComponent extends React.Component<TabForgotPasswordProps> {
    render(): JSX.Element {
        const {theme, navigation} = this.props;
        const styles = loginTabsStyles(theme);

        return (
            <View style={styles.container}>
                <View style={styles.formWrapper}>
                    <ForgotPasswordForm navigation={navigation}></ForgotPasswordForm>
                </View>
            </View>
        );
    }
}

export const SubTabLogin = withTheme(LoginTabComponent);
export const SubTabForgotPassword = withTheme(ForgotPasswordTabComponent);
