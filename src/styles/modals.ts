import {StyleSheet} from "react-native";

export const modalStyles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.05)",
    },
    modalView: {
        width: "80%",
        maxWidth: 300,
        margin: 20,
        borderRadius: 3,
        paddingVertical: 20,
        paddingHorizontal: 30,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});

export const tosDeclineModalStyles = StyleSheet.create({
    actionButtonsWrapper: {
        width: "100%",
        flexDirection: "row",
        marginTop: 20,
        justifyContent: "space-evenly",
    },
    actionButton: {
        width: 110,
        maxWidth: "40%",
        borderRadius: 3,
        paddingVertical: 10,
        elevation: 2,
    },
    actionText: {
        fontWeight: "bold",
        textAlign: "center",
    },
    text: {
        fontSize: 16,
        textAlign: "justify",
    },
});
