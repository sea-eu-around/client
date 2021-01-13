import {StyleSheet, TextStyle} from "react-native";
import {Theme} from "../types";
import {preTheme} from "./utils";
import {styleTextThin} from "./general";

export const onboardingStyle = preTheme((theme: Theme) => {
    return StyleSheet.create({
        wrapper: {
            width: "100%",
            height: "100%",
            alignItems: "center",
        },
        header: {
            marginBottom: 20,
        },
        slideScrollView: {
            width: "100%",
        },
        slideContentWrapper: {
            width: "75%",
            flexDirection: "column",
            alignSelf: "center",
            paddingTop: 150,
            paddingBottom: 20,
        },
        slideNavWrapper: {
            width: "75%",
            alignItems: "center",
            marginTop: 20,
            marginBottom: 40,
        },
        slideNavButtons: {
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-around",
        },
        navButton: {
            flex: 1,
            marginHorizontal: 0,
            marginVertical: 0,
            maxWidth: 200,
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

export const onboardingOffersStyle = preTheme((theme: Theme) => {
    return StyleSheet.create({
        categoryTitleText: {},
        offerControl: {
            marginVertical: 10,
        },
        offerControlPreText: {
            fontSize: 18,
            letterSpacing: 0.4,
            color: theme.textLight,
            marginVertical: 10,
        },
    });
});
