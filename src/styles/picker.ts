import {Theme} from "../types";
import {StyleSheet, ViewStyle} from "react-native";
import {preTheme} from "./utils";

export const pickerStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
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
        dropdownActiveLabelStyle: {color: theme.accentSecondary},
        dropdownLabelStyle: {fontSize: 16},
        okButton: {
            width: "100%",
            height: 50,
            alignItems: "center",
            justifyContent: "center",
            marginVertical: 5,
            paddingVertical: 20,
            backgroundColor: theme.accent,
        },
        okButtonText: {
            fontSize: 20,
            color: theme.textInverted,
        },
        openButton: {
            width: "100%",
            height: 30,
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 20,
            paddingHorizontal: 20,
            borderWidth: 1,
            borderStyle: "solid",
            borderRadius: 2,
            backgroundColor: theme.background,
            borderColor: theme.componentBorder,
        },
        openButtonText: {
            fontSize: 14,
            color: theme.text,
        },
        selectedItemView: {
            width: "100%",
            height: 20,
            marginTop: 5,
            fontSize: 12,
            overflow: "hidden",
        },
        selectedItemText: {
            color: theme.text,
        },
    });
});
