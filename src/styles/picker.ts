import {ThemeValues} from "../types";
import {ImageStyle, StyleSheet, TextStyle, ViewStyle} from "react-native";

const defaults = StyleSheet.create({
    overlay: {
        width: "90%",
        height: "70%",
        overflow: "hidden",
    },
    dropdownWrapper: {
        flex: 1,
    },
    dropdownContainerStyle: {height: 50},
    dropdownStyle: {backgroundColor: "#fafafa"},
    dropdownItemStyle: {justifyContent: "flex-start"} as ViewStyle,
    dropdownActiveItemStyle: {},
    dropdownActiveLabelStyle: {},
    dropdownLabelStyle: {fontSize: 16},
    okButton: {
        width: "100%",
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 5,
        paddingVertical: 20,
    },
    okButtonText: {
        fontSize: 20,
    },
    openButton: {
        width: "100%",
        height: 30,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 5,
        paddingVertical: 20,
        borderWidth: 1,
        borderStyle: "solid",
        borderRadius: 2,
    },
    openButtonText: {
        fontSize: 14,
    },
    selectedItemView: {
        width: "100%",
        height: 20,
        fontSize: 12,
        overflow: "hidden",
    },
});

export function getPickerStyles(theme: ThemeValues): {[key: string]: ViewStyle | TextStyle | ImageStyle} {
    return {
        ...defaults,
        okButton: {...defaults.okButton, backgroundColor: theme.accent},
        okButtonText: {...defaults.okButtonText, color: theme.textInverted},
        openButton: {...defaults.openButton, backgroundColor: theme.background, borderColor: theme.componentBorder},
        openButtonText: {...defaults.openButtonText, color: theme.text},
        dropdownActiveLabelStyle: {color: theme.accentSecondary},
    };
}
