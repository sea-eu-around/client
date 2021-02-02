import {StyleSheet, TextStyle} from "react-native";
import {Theme} from "../types";
import {preTheme} from "./utils";
import {styleTextThin} from "./general";

export const ONBOARDING_INPUT_BORDER_RADIUS = 12;

export const onboardingStyle = preTheme((theme: Theme, wideDevice: boolean) => {
    return StyleSheet.create({
        root: {
            flexDirection: "row",
            justifyContent: "center",
        },
        wideDeviceLeftPanel: {
            width: "50%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
        },
        slideWrapper: {
            width: wideDevice ? "50%" : "100%",
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
            width: "100%",
            flexDirection: "column",
            paddingTop: 100,
            paddingBottom: 20,
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
        },
        slideContentContainer: {
            width: "80%",
        },
        slideNavWrapper: {
            width: "80%",
            alignItems: "center",
            marginTop: 15,
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
        },
        navButtonBack: {
            backgroundColor: "#fff",
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
