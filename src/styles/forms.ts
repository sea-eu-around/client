import {StyleSheet} from "react-native";

export const formStyle = StyleSheet.create({
    errorText: {
        fontSize: 12,
    },
    inputRow: {
        flexDirection: "row",
        justifyContent: "center",
        width: "100%",
    },
    actionRow: {
        flexDirection: "row",
        justifyContent: "center",
        width: "100%",
        marginTop: 30,
    },
    buttonMajor: {
        height: 60,
        borderRadius: 5,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonMajorText: {
        color: "white",
        textAlign: "center",
        fontSize: 16,
        lineHeight: 60,
        letterSpacing: 1,
        textTransform: "uppercase",
    },
});

export const loginTabsStyles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        padding: 0,
    },
    formWrapper: {
        flex: 1,
        width: "70%",
        maxWidth: 400,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        //backgroundColor: "red",
    },
});
