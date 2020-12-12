import * as React from "react";
import {View, Text, TouchableOpacity} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {MyThunkDispatch} from "../state/types";
import LoginForm from "../components/forms/LoginForm";
import ForgotPasswordForm from "../components/forms/ForgotPasswordForm";
import {loginTabsStyles} from "../styles/forms";
import {debugConnect} from "../state/auth/actions";
import {rootNavigate} from "../navigation/utils";
import {ThemeProps} from "../types";
import store from "../state/store";
import {withTheme} from "react-native-elements";
import {APP_VERSION, DEBUG_MODE} from "../constants/config";
import {MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";
import {toggleTheme} from "../state/settings/actions";
import {TabLoginSigninScreens} from "../navigation/types";
import LocalImage from "../components/LocalImage";
import ScrollFormWrapper from "../components/forms/ScrollFormWrapper";
import ScreenWrapper from "./ScreenWrapper";

type TabLoginScreenProps = ThemeProps & StackScreenProps<TabLoginSigninScreens, "LoginForm">;

class LoginTabComponent extends React.Component<TabLoginScreenProps> {
    render(): JSX.Element {
        const {theme, navigation} = this.props;
        const styles = loginTabsStyles(theme);

        return (
            <ScreenWrapper>
                <ScrollFormWrapper>
                    <LoginForm navigation={navigation} />

                    <LocalImage resizeMode={"contain"} style={styles.erasmusLogo} imageKey={"logos.erasmusLeft"} />

                    {DEBUG_MODE && (
                        <View style={styles.debugContainer}>
                            <Text style={styles.debugTitle}>[DEBUG]</Text>
                            <TouchableOpacity style={styles.debugButton} onPress={() => rootNavigate("MainScreen")}>
                                <Text style={styles.debugButtonText}>access</Text>
                            </TouchableOpacity>
                            <Text style={styles.debugButtonText}> | </Text>
                            <TouchableOpacity
                                style={styles.debugButton}
                                onPress={() => {
                                    (store.dispatch as MyThunkDispatch)(debugConnect());
                                }}
                            >
                                <Text style={styles.debugButtonText}>register</Text>
                            </TouchableOpacity>
                            <Text style={styles.debugButtonText}> | </Text>
                            <TouchableOpacity
                                style={styles.debugButton}
                                onPress={() => rootNavigate("OnboardingScreen")}
                            >
                                <Text style={styles.debugButtonText}>on-boarding</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </ScrollFormWrapper>
                <View style={styles.versionInfoContainer}>
                    <Text style={styles.versionText}>
                        <Text style={{fontWeight: "bold"}}>Version:</Text>
                        <Text> {APP_VERSION}</Text>
                    </Text>
                    <View style={styles.versionDisclaimerContainer}>
                        <MaterialIcons style={styles.versionDisclaimerIcon} name="warning" size={16}></MaterialIcons>
                        <Text style={styles.versionText}> This is an alpha version</Text>
                    </View>
                </View>
                <View style={styles.toggleThemeContainer}>
                    <TouchableOpacity style={styles.toggleThemeButton} onPress={() => store.dispatch(toggleTheme())}>
                        <MaterialCommunityIcons style={styles.toggleThemeIcon} name="theme-light-dark" color="black" />
                    </TouchableOpacity>
                </View>
            </ScreenWrapper>
        );
    }
}

type TabForgotPasswordProps = ThemeProps & StackScreenProps<TabLoginSigninScreens, "ForgotPassword">;

class ForgotPasswordTabComponent extends React.Component<TabForgotPasswordProps> {
    render(): JSX.Element {
        const {navigation} = this.props;

        return (
            <ScreenWrapper>
                <ScrollFormWrapper>
                    <ForgotPasswordForm navigation={navigation}></ForgotPasswordForm>
                </ScrollFormWrapper>
            </ScreenWrapper>
        );
    }
}

export const SubTabLogin = withTheme(LoginTabComponent);
export const SubTabForgotPassword = withTheme(ForgotPasswordTabComponent);
