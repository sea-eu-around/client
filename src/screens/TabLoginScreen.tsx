import * as React from "react";
import {StyleSheet, View, KeyboardAvoidingView, Platform, TextStyle} from "react-native";
import Colors from "../constants/themes";
import {StackScreenProps} from "@react-navigation/stack";
import {LoginTabNavigatorScreens} from "../types";
import {connect, ConnectedProps} from "react-redux";
import {AppState} from "../state/types";
import {LoginForm} from "../components/LoginForm";
import ForgotPasswordForm from "../components/ForgotPasswordForm";
import {loginTabsStyles, formStyle} from "../styles/forms";
import {FormikProps} from "formik";

const commonStyle = StyleSheet.create({
    textInputWrapper: {
        width: "100%",
    },
    textInput: {
        width: "100%",
        height: 60,
        paddingHorizontal: 20,
        borderRadius: 5,
        borderWidth: 0,
    },
    textInputError: {
        borderBottomWidth: 2,
    },
    textInputValid: {
        borderBottomWidth: 2,
    },
    checkboxWrapper: {
        width: "100%",
        marginVertical: 5,
    },
    checkboxLabel: {
        fontSize: 14,
    },
});

export function getCommonTextInputProps<T>(
    theme: Record<string, string>,
    formikProps: FormikProps<T>,
    overrideVerticalMargin = 5,
) {
    const focusedStyle = Platform.OS === "web" ? ({outlineColor: "transparent"} as TextStyle) : null;

    return {
        placeholderTextColor: "#222",
        wrapperStyle: commonStyle.textInputWrapper,
        style: [commonStyle.textInput, {backgroundColor: theme.accentSlight, marginVertical: overrideVerticalMargin}],
        errorStyle: [commonStyle.textInputError, {borderBottomColor: theme.error}],
        validStyle: [commonStyle.textInputValid, {borderBottomColor: theme.okay}],
        focusedStyle: focusedStyle,
        errorTextStyle: [formStyle.errorText, {color: theme.error}],
        handleChange: formikProps.handleChange,
        handleBlur: formikProps.handleBlur,
    };
}

export function getCommonCheckBoxProps<T>(theme: Record<string, string>, formikProps: FormikProps<T>) {
    return {
        wrapperStyle: commonStyle.checkboxWrapper,
        labelStyle: [commonStyle.checkboxLabel, {color: theme.text}],
        errorTextStyle: [formStyle.errorText, {color: theme.error}],
        setFieldValue: formikProps.setFieldValue,
        setFieldTouched: formikProps.setFieldTouched,
    };
}

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
                    onSuccessfulSubmit={() => navigation.navigate("RootScreen")}
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
