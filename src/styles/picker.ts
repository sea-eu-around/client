import {Theme} from "../types";
import {StyleSheet, ViewStyle} from "react-native";
import {preTheme} from "./utils";

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
        openButton: {
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderWidth: 1,
            borderRadius: 2,
            backgroundColor: theme.background,
            borderColor: theme.componentBorder,
        },
        openButtonText: {
            fontSize: 14,
            color: theme.text,
        },
        chipContainer: {
            marginTop: 10,
        },
    });
});
