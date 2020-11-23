import {Platform, TextStyle} from "react-native";

export const styleTextThin: TextStyle = {
    fontFamily: Platform.OS == "web" ? undefined : "sans-serif-thin",
    fontWeight: Platform.OS == "web" ? "100" : undefined,
};

export const styleTextLight: TextStyle = {
    fontFamily: Platform.OS == "web" ? undefined : "sans-serif-light",
    fontWeight: Platform.OS == "web" ? "200" : undefined,
};
