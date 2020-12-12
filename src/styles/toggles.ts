import {ButtonGroupProps} from "react-native-elements";
import {Theme} from "../types";

export function getToggleStyleProps(nobuttonBariant: boolean, theme: Theme): Partial<ButtonGroupProps> {
    if (nobuttonBariant) {
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
    } else {
        return {
            containerStyle: {
                height: 35,
                marginLeft: 0,
                marginRight: 0,
                borderColor: theme.componentBorder,
            },
            innerBorderStyle: {
                color: theme.componentBorder,
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
