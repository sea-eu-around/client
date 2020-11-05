import {StyleSheet, TextStyle} from "react-native";

export const onboardingStyle = StyleSheet.create({
    slideWrapper: {
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
    },
    header: {
        marginBottom: "20%",
    },
    slideContentWrapper: {
        width: "70%",
    },
    slideNavWrapper: {
        width: "100%",
        flexDirection: "row",
        height: 30,
        justifyContent: "center",
        position: "absolute",
        bottom: 40,
    },
    navButton: {
        flex: 1,
    },
    navButtonText: {
        fontSize: 20,
        textAlign: "center",
    },
    title: {
        fontFamily: "sans-serif-thin",
        fontSize: 40,
        letterSpacing: 1.75,
        marginBottom: 20,
    } as TextStyle,
    subtitle: {
        fontSize: 18,
        textAlign: "justify",
        letterSpacing: 0.4,
        lineHeight: 25,
    } as TextStyle,
});

export const tosSlideStyle = StyleSheet.create({
    actionsWrapper: {
        flexDirection: "row",
        justifyContent: "space-around",
    },
    actionButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    actionButtonText: {
        fontSize: 16,
        paddingHorizontal: 2,
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    readMoreText: {
        fontSize: 16,
        lineHeight: 20,
        textAlign: "justify",
        marginBottom: 40,
        letterSpacing: 0.4,
    },
});
