import {StyleSheet} from "react-native";

export const tooltipStyles = StyleSheet.create({
    text: {
        textAlign: "justify",
        paddingVertical: 10,
    },
    container: {
        alignContent: "center",
        borderRadius: 4,
        width: undefined, // override default width so it adjusts based on the content
        maxWidth: 240,
        paddingHorizontal: 10,
    },
});
