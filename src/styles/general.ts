import {Platform, TextStyle} from "react-native";

export const styleTextThin: TextStyle = {
    fontFamily: Platform.OS == "web" ? undefined : "sans-serif-thin",
    fontWeight: Platform.OS == "web" ? "100" : undefined,
};
