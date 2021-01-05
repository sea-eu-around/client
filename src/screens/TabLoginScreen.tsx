import * as React from "react";
import {StackScreenProps} from "@react-navigation/stack";
import LoginForm from "../components/forms/LoginForm";
import ForgotPasswordForm from "../components/forms/ForgotPasswordForm";
import {ThemeProps} from "../types";
import {LoginScreens} from "../navigation/types";
import ScrollFormWrapper from "../components/forms/ScrollFormWrapper";
import ScreenWrapper from "./ScreenWrapper";
import SignupForm from "../components/forms/SignupForm";
import {LOGIN_HEADER_WAVE_HEIGHT} from "../components/headers/LoginHeader";

type TabSigninScreenProps = ThemeProps & StackScreenProps<LoginScreens, "SigninScreen">;

export class SigninScreen extends React.Component<TabSigninScreenProps> {
    render(): JSX.Element {
        return (
            <ScreenWrapper>
                <ScrollFormWrapper notKeyboardReactive={true}>
                    {/* Add top padding to the form so the top is below the header wave */}
                    <LoginForm containerStyle={{paddingTop: LOGIN_HEADER_WAVE_HEIGHT}} />
                </ScrollFormWrapper>
            </ScreenWrapper>
        );
    }
}

type ForgotPasswordScreenProps = ThemeProps & StackScreenProps<LoginScreens, "ForgotPasswordScreen">;

export class ForgotPasswordScreen extends React.Component<ForgotPasswordScreenProps> {
    render(): JSX.Element {
        return (
            <ScreenWrapper>
                <ScrollFormWrapper notKeyboardReactive={true}>
                    <ForgotPasswordForm containerStyle={{paddingTop: LOGIN_HEADER_WAVE_HEIGHT}} />
                </ScrollFormWrapper>
            </ScreenWrapper>
        );
    }
}
type SignupScreenProps = ThemeProps;

export class SignupScreen extends React.Component<SignupScreenProps> {
    render(): JSX.Element {
        return (
            <ScreenWrapper>
                <ScrollFormWrapper>
                    <SignupForm containerStyle={{paddingTop: LOGIN_HEADER_WAVE_HEIGHT}} />
                </ScrollFormWrapper>
            </ScreenWrapper>
        );
    }
}
