import {StyleSheet, Platform, TextStyle} from "react-native";
import {Theme} from "../types";
import {FormCheckBoxProps} from "../components/forms/FormCheckBox";
import {preTheme} from "./utils";
import {TextInputStyleProps} from "../components/ValidatedTextInput";

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
        placeholderTextColor: theme.inputPlaceholder,
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

export function getOnboardingTextInputsStyleProps(theme: Theme): TextInputStyleProps {
    return {
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
    };
}
