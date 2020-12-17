import {Theme} from "../types";
import {preTheme} from "./utils";
import {StyleSheet} from "react-native";

export const headerStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        wrapper: {
            backgroundColor: theme.background,
            paddingHorizontal: 5,
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 1,
            },
            shadowOpacity: 0.2,
            shadowRadius: 1.41,
            elevation: 2,
        },
        wrapperNoShadow: {
            shadowColor: "transparent",
            elevation: 0,
        },
        container: {
            flexDirection: "row",
            alignItems: "center",
            height: 60,
            paddingHorizontal: 10,
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
            fontWeight: "normal",
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
