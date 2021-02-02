import {Theme} from "../types";
import {StyleSheet, TextStyle, ViewStyle} from "react-native";
import {preTheme} from "./utils";
import {ONBOARDING_INPUT_BORDER_RADIUS} from "./onboarding";

export type PickerButtonStyleVariant = "classic" | "onboarding";

export const pickerStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        overlay: {
            width: "90%",
            maxHeight: "70%",
            overflow: "hidden",
            paddingHorizontal: 0,
            paddingVertical: 0,
        },
        dropdownWrapper: {
            width: "100%",
            flex: 1,
        },
        dropdownStyle: {backgroundColor: "#fafafa", height: "100%"},
        dropdownItemStyle: {justifyContent: "flex-start"} as ViewStyle,
        dropdownActiveItemStyle: {},
        dropdownActiveLabelStyle: {color: theme.accentSecondary},
        dropdownLabelStyle: {fontSize: 16},
        okButton: {
            width: "100%",
            height: 50,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 4,
            backgroundColor: theme.accent,
        },
        okButtonText: {
            fontSize: 20,
            color: theme.textWhite,
        },
        chipContainer: {
            marginTop: 10,
        },
    });
});

export function getPickerButtonStyleProps(
    variant: PickerButtonStyleVariant = "classic",
    theme: Theme,
): {button: ViewStyle; text: TextStyle; textNoneSelected: TextStyle} {
    if (variant === "onboarding") {
        return {
            button: {
                width: "100%",
                height: 48,
                alignItems: "flex-start",
                justifyContent: "center",
                paddingHorizontal: 20,
                borderRadius: ONBOARDING_INPUT_BORDER_RADIUS,
                backgroundColor: theme.onboardingInputBackground,
            },
            text: {
                fontSize: 14,
                color: theme.text,
            },
            textNoneSelected: {
                color: theme.textLight,
            },
        };
    } else {
        return {
            button: {
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 20,
                borderWidth: 1,
                borderRadius: 2,
                backgroundColor: theme.background,
                borderColor: theme.componentBorder,
            },
            text: {
                fontSize: 14,
                color: theme.text,
            },
            textNoneSelected: {},
        };
    }
}
