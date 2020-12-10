import {StyleSheet, TextStyle} from "react-native";
import {Theme} from "../types";
import {preTheme} from "./utils";
import {styleTextThin} from "./general";

export const onboardingStyle = preTheme((theme: Theme) => {
    return StyleSheet.create({
        header: {
            marginBottom: 20,
        },
        slideScrollView: {
            width: "100%",
            marginBottom: 80, // leave some space for the navigation controls
        },
        slideContentWrapper: {
            width: "75%",
            flexDirection: "column",
            alignSelf: "center",
            paddingTop: 150,
        },
        slideNavWrapper: {
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            position: "absolute",
            bottom: 20,
        },
        navButton: {
            padding: 10,
        },
        navButtonIcon: {
            fontSize: 40,
            color: theme.text,
        },
        finishButtonText: {
            fontSize: 20,
        },
        title: {
            ...styleTextThin,
            fontSize: 40,
            letterSpacing: 1.75,
            marginBottom: 20,
            color: theme.text,
        } as TextStyle,
        subtitle: {
            fontSize: 18,
            textAlign: "justify",
            letterSpacing: 0.4,
            lineHeight: 25,
            color: theme.textLight,
        } as TextStyle,
    });
});

export const tosSlideStyle = preTheme((theme: Theme) => {
    return StyleSheet.create({
        actionsWrapper: {
            flexDirection: "row",
            justifyContent: "space-around",
        },
        actionButton: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
        },
        actionButtonTextDecline: {
            fontSize: 16,
            paddingHorizontal: 2,
            textTransform: "uppercase",
            letterSpacing: 1,
            color: theme.error,
        },
        actionButtonTextAccept: {
            fontSize: 16,
            paddingHorizontal: 2,
            textTransform: "uppercase",
            letterSpacing: 1,
            color: theme.okay,
        },
        readMoreText: {
            fontSize: 16,
            lineHeight: 20,
            textAlign: "justify",
            marginBottom: 40,
            letterSpacing: 0.4,
            color: theme.textLight,
        },
    });
});

export const onboardingOffersStyle = preTheme(() => {
    return StyleSheet.create({
        categoryTitleText: {},
    });
});
