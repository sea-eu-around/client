import {StyleSheet} from "react-native";
import {preTheme} from "./utils";

export const tooltipStyles = preTheme(() => {
    return StyleSheet.create({
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
});
