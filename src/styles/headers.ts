import {Theme} from "../types";
import {preTheme} from "./utils";
import {StyleSheet} from "react-native";

export const headerStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        wrapper: {
            backgroundColor: theme.background,
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 6,
            },
            shadowOpacity: 0.37,
            shadowRadius: 7.49,
            elevation: 3,
            paddingHorizontal: 5,
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
        avatar: {
            borderWidth: 1,
            borderColor: theme.accentSlight,
        },
        title: {
            flex: 1,
            color: theme.text,
            fontWeight: "normal",
            fontSize: 20,
            //fontWeight: "bold",
            //...styleTextLight,
            //letterSpacing: 0,
        },
        rightButton: {
            marginLeft: 10,
        },
        rightIcon: {
            fontSize: 26,
            color: theme.text,
        },
    });
});
