import {StyleSheet, Platform, TextStyle} from "react-native";
import {ThemeValues} from "../types";
import {FormTextInputProps} from "../components/FormTextInput";
import {FormCheckBoxProps} from "../components/FormCheckBox";

export const formStyle = StyleSheet.create({
    inputErrorText: {
        fontSize: 12,
    },
    inputRow: {
        flexDirection: "row",
        justifyContent: "center",
        width: "100%",
    },
    actionRow: {
        flexDirection: "row",
        justifyContent: "center",
        width: "100%",
        marginTop: 25,
    },
    buttonMajor: {
        justifyContent: "center",
        height: 60,
        borderRadius: 5,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonMajorText: {
        color: "white",
        textAlign: "center",
        fontSize: 16,
        letterSpacing: 1,
        textTransform: "uppercase",
    },
});

export function getLoginTextInputsStyleProps(
    theme: ThemeValues,
    wrapperVerticalMargin = 0,
): Partial<FormTextInputProps> {
    const focusedStyle = Platform.OS === "web" ? ({outlineColor: "transparent"} as TextStyle) : null;

    const commonStyle = StyleSheet.create({
        textInputWrapper: {
            width: "100%",
            marginVertical: wrapperVerticalMargin,
        },
        textInput: {
            width: "100%",
            height: 60,
            paddingHorizontal: 20,
            borderRadius: 5,
            borderWidth: 0,
            backgroundColor: theme.accentSlight,
        },
        textInputError: {
            borderBottomWidth: 2,
            borderBottomColor: theme.error,
        },
        textInputValid: {
            borderBottomWidth: 2,
            borderBottomColor: theme.okay,
        },
    });

    return {
        placeholderTextColor: "#222",
        wrapperStyle: commonStyle.textInputWrapper,
        style: commonStyle.textInput,
        errorStyle: commonStyle.textInputError,
        validStyle: commonStyle.textInputValid,
        focusedStyle: focusedStyle,
        errorTextStyle: [formStyle.inputErrorText, {color: theme.error}],
    };
}

export function getLoginCheckBoxStyleProps(theme: ThemeValues): Partial<FormCheckBoxProps> {
    const commonStyle = StyleSheet.create({
        checkboxWrapper: {
            width: "100%",
            marginVertical: 5,
        },
        checkboxLabel: {
            fontSize: 14,
        },
    });

    return {
        wrapperStyle: commonStyle.checkboxWrapper,
        labelStyle: [commonStyle.checkboxLabel, {color: theme.text}],
        errorTextStyle: [formStyle.inputErrorText, {color: theme.error}],
    };
}

export const loginTabsStyles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        padding: 0,
    },
    formWrapper: {
        flex: 1,
        width: "70%",
        maxWidth: 400,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        //backgroundColor: "red",
    },
});
