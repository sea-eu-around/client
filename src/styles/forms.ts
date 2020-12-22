import {StyleSheet, Platform, TextStyle} from "react-native";
import {Theme} from "../types";
import {FormTextInputProps} from "../components/forms/FormTextInput";
import {FormCheckBoxProps} from "../components/forms/FormCheckBox";
import {preTheme} from "./utils";

export const formStyles = preTheme(() => {
    return StyleSheet.create({
        inputErrorText: {
            fontSize: 12,
            marginTop: 2,
            marginBottom: -12, // prevents an offset from appearing when there is an error
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
            height: 55,
            borderRadius: 8,

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
});

export function getLoginTextInputsStyleProps(theme: Theme, wrapperVerticalMargin = 0): Partial<FormTextInputProps> {
    const focusedStyle = Platform.OS === "web" ? ({outline: "none"} as TextStyle) : null;

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
            color: theme.textBlack,
        },
        textInputError: {
            borderBottomWidth: 2,
            borderBottomColor: theme.error,
        },
        textInputValid: {
            borderBottomWidth: 2,
            borderBottomColor: theme.okay,
        },
        label: {
            marginBottom: 4,
        },
    });

    return {
        placeholderTextColor: "#222",
        wrapperStyle: commonStyle.textInputWrapper,
        style: commonStyle.textInput,
        errorStyle: commonStyle.textInputError,
        validStyle: commonStyle.textInputValid,
        labelStyle: commonStyle.label,
        focusedStyle: focusedStyle,
    };
}

export function getLoginCheckBoxStyleProps(theme: Theme): Partial<FormCheckBoxProps> {
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
    };
}

export const loginTabsStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        versionInfoContainer: {
            position: "absolute",
            flexDirection: "column",
            bottom: 5,
            left: 5,
        },
        versionText: {color: theme.textLight},
        versionDisclaimerContainer: {
            flexDirection: "row",
            alignItems: "center",
        },
        versionDisclaimerIcon: {color: theme.error},
        debugContainer: {
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 10,
        },
        debugTitle: {
            fontWeight: "bold",
            width: 75,
            fontSize: 16,
            color: theme.textLight,
            letterSpacing: 0.8,
        },
        debugButton: {
            padding: 6,
        },
        debugButtonText: {
            fontSize: 16,
            color: theme.error,
        },
        toggleThemeContainer: {
            position: "absolute",
            bottom: 0,
            right: 0,
        },
        toggleThemeButton: {
            width: 48,
            height: 48,
            justifyContent: "center",
            alignItems: "center",
        },
        toggleThemeIcon: {
            fontSize: 26,
            color: theme.textLight,
        },
        erasmusLogo: {
            width: "100%",
            height: 40,
            marginTop: 40,
        },
    });
});

export function getOnboardingTextInputsStyleProps(theme: Theme): Partial<FormTextInputProps> {
    const focusedStyle =
        Platform.OS === "web"
            ? ({
                  backgroundColor: "transparent",
                  outline: "none",
              } as TextStyle)
            : null;

    const commonStyle = StyleSheet.create({
        textInputWrapper: {
            width: "100%",
            marginVertical: 10,
        },
        textInput: {
            width: "100%",
            height: 60,
            borderRadius: 0,
            borderWidth: 0,
            borderBottomWidth: 1,
            borderBottomColor: theme.accentTernary,
            backgroundColor: "transparent",
            fontSize: 20,
            color: theme.text,
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
        wrapperStyle: commonStyle.textInputWrapper,
        style: commonStyle.textInput,
        errorStyle: commonStyle.textInputError,
        validStyle: commonStyle.textInputValid,
        focusedStyle: focusedStyle,
    };
}
