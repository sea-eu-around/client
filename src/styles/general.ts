import {Platform, TextStyle} from "react-native";

export const styleTextThin: TextStyle =
    Platform.OS == "android" ? {fontFamily: "sans-serif-thin"} : {fontWeight: "100"};

export const styleTextLight: TextStyle =
    Platform.OS == "android" ? {fontFamily: "sans-serif-light"} : {fontWeight: "200"};

export const webFontFamily = {fontFamily: `"Segoe UI", Roboto, "Helvetica Neue", sans-serif`};
