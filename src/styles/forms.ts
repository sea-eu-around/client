import {StyleSheet, Platform, TextStyle} from "react-native";
import {Theme} from "../types";
import {FormCheckBoxProps} from "../components/forms/FormCheckBox";
import {preTheme} from "./utils";
import {TextInputStyleProps} from "../components/ValidatedTextInput";
import {ONBOARDING_INPUT_BORDER_RADIUS} from "./onboarding";

export const formStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        inputFieldIcon: {
            fontSize: 20,
            color: theme.inputPlaceholder,
            marginRight: 10,
        },
        inputFieldIconFocused: {
            color: theme.accent,
        },
    });
});

export function getLoginTextInputsStyleProps(theme: Theme, wrapperVerticalMargin = 0): TextInputStyleProps {
    return {
        wrapperStyle: {
            width: "100%",
            marginVertical: wrapperVerticalMargin,
        },
        style: {
            width: "100%",
            height: 50,
            borderBottomWidth: 2,
            borderColor: theme.componentBorder,
        },
        focusedStyle: {
            borderColor: theme.accent,
        },
        errorStyle: {
            borderBottomWidth: 2,
            borderBottomColor: theme.error,
        },
        validStyle: {
            borderBottomWidth: 2,
            borderBottomColor: theme.okay,
        },
        labelStyle: {
            marginBottom: 4,
        },
        inputStyle: {
            fontSize: 16,
            color: theme.accent,
        },
        inputFocusedStyle: Platform.OS === "web" ? ({outline: "none"} as TextStyle) : {},
        showPasswordButtonStyle: {
            padding: 8,
        },
        showPasswordIconStyle: {
            fontSize: 22,
            color: theme.textLight,
        },
        placeholderTextColor: theme.inputPlaceholder,
    };
}

export function getOnboardingTextInputsStyleProps(theme: Theme): TextInputStyleProps {
    /*return {
        wrapperStyle: {
            width: "100%",
            marginVertical: 10,
        },
        style: {
            width: "100%",
            height: 60,
            borderRadius: 0,
            borderWidth: 0,
            borderBottomWidth: 1,
            borderBottomColor: theme.accentTernary,
        },
        errorStyle: {
            borderBottomWidth: 2,
            borderBottomColor: theme.error,
        },
        validStyle: {
            borderBottomWidth: 2,
            borderBottomColor: theme.okay,
        },
        inputStyle: {
            fontSize: 20,
            color: theme.text,
        },
        inputFocusedStyle:
            Platform.OS === "web"
                ? ({
                      backgroundColor: "transparent",
                      outline: "none",
                  } as TextStyle)
                : {},
    };*/
    return {
        wrapperStyle: {
            width: "100%",
            marginVertical: 10,
        },
        style: {
            width: "100%",
            height: 55,
            borderRadius: ONBOARDING_INPUT_BORDER_RADIUS,
            borderWidth: 0,
            backgroundColor: theme.onboardingInputBackground,
        },
        focusedStyle: {
            backgroundColor: theme.accentSlight,
        },
        errorStyle: {
            borderBottomWidth: 2,
            borderBottomColor: theme.error,
        },
        validStyle: {},
        inputStyle: {
            fontSize: 18,
            color: theme.text,
            marginHorizontal: 15,
        },
        inputFocusedStyle: {
            ...(Platform.OS === "web" ? ({outline: "none"} as TextStyle) : {}),
        },
    };
}

export function getFormCheckBoxStyleProps(theme: Theme): Partial<FormCheckBoxProps> {
    const commonStyle = StyleSheet.create({
        checkboxWrapper: {
            width: "100%",
            marginVertical: 5,
        },
        checkboxContainer: {
            padding: 0,
            marginTop: 0,
            marginBottom: 0,
            marginLeft: 0,
            marginRight: 5,
        },
        checkboxLabel: {
            fontSize: 16,
            marginLeft: 5,
        },
    });

    return {
        wrapperStyle: commonStyle.checkboxWrapper,
        containerStyle: commonStyle.checkboxContainer,
        labelStyle: [commonStyle.checkboxLabel, {color: theme.text}],
    };
}
