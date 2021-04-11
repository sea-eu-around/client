import {ButtonGroupProps} from "react-native-elements";
import {Theme} from "../types";
import {ONBOARDING_INPUT_BORDER_RADIUS} from "./onboarding";

export type ToggleStyleVariant = "classic" | "classic-rounded" | "no-buttons" | "chips" | "onboarding";

export function getToggleStyleProps(variant: ToggleStyleVariant = "classic", theme: Theme): Partial<ButtonGroupProps> {
    if (variant === "no-buttons") {
        return {
            containerStyle: {
                backgroundColor: "transparent",
                height: 28,
                borderWidth: 0,
                marginHorizontal: 0,
                marginBottom: 5,
                flexDirection: "row",
                justifyContent: "space-evenly",
            },
            innerBorderStyle: {
                width: 0,
            },
            buttonContainerStyle: {
                marginHorizontal: 5,
                flex: 0,
            },
            buttonStyle: {
                paddingHorizontal: 10,
            },
            textStyle: {
                color: theme.textLight,
                opacity: 0.5,
                fontSize: 15,
                flexShrink: 1,
            },
            selectedButtonStyle: {
                backgroundColor: "transparent",
                borderColor: theme.accent,
                borderBottomWidth: 0.5,
            },
            selectedTextStyle: {
                color: theme.text,
                opacity: 1,
            },
        };
    } else if (variant === "chips") {
        return {
            containerStyle: {
                backgroundColor: "transparent",
                height: 32,
                borderWidth: 0,
                marginHorizontal: 0,
                marginBottom: 5,
                flexDirection: "row",
                justifyContent: "space-evenly",
            },
            innerBorderStyle: {
                width: 0,
            },
            buttonContainerStyle: {
                marginHorizontal: 4,
                flex: 1,
            },
            buttonStyle: {
                backgroundColor: theme.accentSlight,
                borderRadius: 50,
            },
            textStyle: {
                color: theme.textBlack,
                opacity: 0.5,
                fontSize: 15,
                flexShrink: 1,
            },
            selectedButtonStyle: {
                backgroundColor: theme.accent,
            },
            selectedTextStyle: {
                color: theme.textWhite,
                opacity: 1,
            },
        };
    } else if (variant === "classic-rounded") {
        return {
            containerStyle: {
                height: 36,
                marginLeft: 0,
                marginRight: 0,
                borderColor: theme.buttonGroupBorder,
                borderRadius: 20,
                borderWidth: 1,
            },
            innerBorderStyle: {
                color: theme.buttonGroupBorder,
                width: 1,
            },
            buttonStyle: {
                backgroundColor: theme.cardBackground,
            },
            textStyle: {
                color: theme.text,
            },
            selectedButtonStyle: {
                backgroundColor: theme.accent,
            },
            disabledStyle: {
                backgroundColor: theme.cardBackground,
            },
            disabledSelectedStyle: {
                backgroundColor: theme.background,
            },
            disabledSelectedTextStyle: {
                fontWeight: "bold",
            },
        };
    } else if (variant === "onboarding") {
        return {
            containerStyle: {
                height: 48,
                marginLeft: 0,
                marginRight: 0,
                borderRadius: ONBOARDING_INPUT_BORDER_RADIUS,
            },
            innerBorderStyle: {
                color: theme.buttonGroupBorder,
                width: 1,
            },
            buttonStyle: {
                backgroundColor: theme.onboardingInputBackground,
            },
            textStyle: {
                color: theme.textLight,
            },
            selectedTextStyle: {
                color: theme.text,
            },
            selectedButtonStyle: {
                backgroundColor: theme.accentSlight,
            },
            disabledStyle: {
                backgroundColor: theme.cardBackground,
            },
            disabledSelectedStyle: {
                backgroundColor: theme.background,
            },
            disabledSelectedTextStyle: {
                fontWeight: "bold",
            },
        };
    } else {
        return {
            containerStyle: {
                height: 35,
                marginLeft: 0,
                marginRight: 0,
                borderColor: theme.buttonGroupBorder,
                borderWidth: 1,
            },
            innerBorderStyle: {
                color: theme.buttonGroupBorder,
                width: 1,
            },
            buttonStyle: {
                backgroundColor: theme.cardBackground,
            },
            textStyle: {
                color: theme.text,
            },
            selectedButtonStyle: {
                backgroundColor: theme.accent,
            },
            disabledStyle: {
                backgroundColor: theme.cardBackground,
            },
            disabledSelectedStyle: {
                backgroundColor: theme.background,
            },
            disabledSelectedTextStyle: {
                fontWeight: "bold",
            },
        };
    }
}
