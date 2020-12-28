import {Theme} from "../types";
import {preTheme} from "./utils";
import {StyleSheet} from "react-native";

export const headerStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        wrapper: {
            backgroundColor: theme.background,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 15,
            paddingBottom: 10,
            height: 100,
        },
        wrapperBlur: {
            backgroundColor: "transparent",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
        },
        wrapperNoShadow: {
            shadowColor: "transparent",
            elevation: 0,
        },
        backButton: {
            width: 40,
            height: 40,
            marginRight: 5,
            justifyContent: "center",
            alignItems: "center",
        },
        backButtonIcon: {
            fontSize: 28,
        },
        avatarContainer: {
            backgroundColor: theme.accentSecondary,
            borderWidth: 1,
            borderColor: theme.componentBorder,
        },
        avatarTitle: {
            color: theme.textWhite,
        },
        title: {
            flex: 1,
            color: theme.text,
            fontWeight: "600",
            fontSize: 20,
        },
        rightButton: {
            width: 36,
            height: 36,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 50,
            marginLeft: 8,
        },
        rightIcon: {
            fontSize: 22,
        },
    });
});
