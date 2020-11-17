import {ButtonGroupProps} from "react-native-elements";
import {Theme} from "../types";

export function getToggleStyleProps(nobuttonBariant: boolean, theme: Theme): Partial<ButtonGroupProps> {
    if (nobuttonBariant) {
        return {
            containerStyle: {
                backgroundColor: "transparent",
                flex: 1,
                height: 30,
                borderWidth: 0,
                marginHorizontal: 0,
                marginTop: 2,
                marginBottom: 5,
            },
            innerBorderStyle: {width: 0},
            buttonContainerStyle: {marginHorizontal: 5},
            buttonStyle: {paddingBottom: 2},
            textStyle: {
                color: theme.textLight,
                opacity: 0.5,
            },
            selectedButtonStyle: {
                backgroundColor: "transparent",
                borderColor: theme.accent,
                borderStyle: "dashed",
                borderBottomWidth: 1,
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
            },
        };
    }
}
