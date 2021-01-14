import * as React from "react";
import {StyleSheet} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import LoginForm from "../components/forms/LoginForm";
import ForgotPasswordForm from "../components/forms/ForgotPasswordForm";
import {Theme, ThemeProps} from "../types";
import {LoginScreens} from "../navigation/types";
import ScrollFormWrapper from "../components/forms/ScrollFormWrapper";
import ScreenWrapper from "./ScreenWrapper";
import SignupForm from "../components/forms/SignupForm";
import {LOGIN_HEADER_WAVE_HEIGHT} from "../components/headers/LoginHeader";
import layout from "../constants/layout";
import {preTheme} from "../styles/utils";
import {withTheme} from "react-native-elements";

// Sign-in

type TabSigninScreenProps = ThemeProps & StackScreenProps<LoginScreens, "SigninScreen">;

class SigninScreenClass extends React.Component<TabSigninScreenProps> {
    render(): JSX.Element {
        const wide = layout.isWideDevice;
        const styles = themedStyles(this.props.theme);
        const form = <LoginForm containerStyle={styles.formContainer} />;

        return (
            <ScreenWrapper wrapperStyle={styles.screenWrapper} containerStyle={styles.screenContainer}>
                {wide && form}
                {!wide && <ScrollFormWrapper notKeyboardReactive={true}>{form}</ScrollFormWrapper>}
            </ScreenWrapper>
        );
    }
}

// Forgot password

type ForgotPasswordScreenProps = ThemeProps & StackScreenProps<LoginScreens, "ForgotPasswordScreen">;

class ForgotPasswordScreenClass extends React.Component<ForgotPasswordScreenProps> {
    render(): JSX.Element {
        const wide = layout.isWideDevice;
        const styles = themedStyles(this.props.theme);
        const form = <ForgotPasswordForm containerStyle={styles.formContainer} />;

        return (
            <ScreenWrapper wrapperStyle={styles.screenWrapper} containerStyle={styles.screenContainer}>
                {wide && form}
                {!wide && <ScrollFormWrapper notKeyboardReactive={true}>{form}</ScrollFormWrapper>}
            </ScreenWrapper>
        );
    }
}

// Sign-up

type SignupScreenProps = ThemeProps;

class SignupScreenClass extends React.Component<SignupScreenProps> {
    render(): JSX.Element {
        const wide = layout.isWideDevice;
        const styles = themedStyles(this.props.theme);
        const form = <SignupForm containerStyle={styles.formContainer} />;

        return (
            <ScreenWrapper wrapperStyle={styles.screenWrapper} containerStyle={styles.screenContainer}>
                {wide && form}
                {!wide && <ScrollFormWrapper notKeyboardReactive={true}>{form}</ScrollFormWrapper>}
            </ScreenWrapper>
        );
    }
}

export const themedStyles = preTheme((theme: Theme, wideDevice: boolean) => {
    if (wideDevice) {
        return StyleSheet.create({
            screenWrapper: {
                width: "50%",
                height: "100%",
                position: "absolute",
                top: 0,
                left: "50%",
            },
            screenContainer: {
                width: "100%",
                justifyContent: "center",
            },
            formContainer: {
                width: "80%",
                maxWidth: 400,
            },
        });
    } else {
        return StyleSheet.create({
            screenWrapper: {},
            screenContainer: {},
            formContainer: {
                // Add top padding to the form so the top is below the header wave
                paddingTop: LOGIN_HEADER_WAVE_HEIGHT,
                width: "80%",
                maxWidth: 400,
            },
        });
    }
});

export const SigninScreen = withTheme(SigninScreenClass);
export const ForgotPasswordScreen = withTheme(ForgotPasswordScreenClass);
export const SignupScreen = withTheme(SignupScreenClass);
