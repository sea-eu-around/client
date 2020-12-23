import {StyleSheet, Platform, TextStyle} from "react-native";
import {Theme} from "../types";
import {FormCheckBoxProps} from "../components/forms/FormCheckBox";
import {preTheme} from "./utils";
import {TextInputStyleProps} from "../components/ValidatedTextInput";

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
            borderRadius: 10,
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

export const loginTabsStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        // TODO clean-up
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

        actionButton: {
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 30,
            height: 50,
            marginVertical: 10,
            borderRadius: 100,

            borderColor: theme.accent,
            borderWidth: 1,
        },
        actionText: {
            fontSize: 18,
            letterSpacing: 1,

            color: theme.accent,
        },
        actionButtonFilled: {
            backgroundColor: theme.accent,
        },
        actionTextFilled: {
            color: theme.textWhite,
        },

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
