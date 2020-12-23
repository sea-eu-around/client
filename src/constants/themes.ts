import {ThemeKey} from "../types";

const lightThemeText = "#000";
const darkThemeText = "#fff";

export default {
    light: {
        id: "light" as ThemeKey,
        text: lightThemeText,
        textWhite: darkThemeText,
        textBlack: lightThemeText,
        textLight: "#666",
        textInverted: "#fff",
        background: "#fff",
        cardBackground: "#f7f7f7", //"#f7f7f7",
        almostBackground: "#f7f7f7",
        accent: "#003da5", // Pantone 293c
        accentSlight: "#ccd8ea",
        accentSecondary: "#009ace", // Pantone 801c
        accentTernary: "#fbe122", // Pantone 207c
        error: "rgba(255,59,48,1)",
        actionNeutral: "#555555",
        okay: "#00b16a",
        warn: "#eecc00",
        componentBorder: "#bbb",
        chatBubble: "#ededed",
        inputPlaceholder: "#999",
    },
    dark: {
        id: "dark" as ThemeKey,
        text: darkThemeText,
        textWhite: darkThemeText,
        textBlack: lightThemeText,
        textLight: "#ccc",
        textInverted: "#111",
        background: "rgba(0,0,0,1)",
        cardBackground: "rgba(28,28,30,1)",
        almostBackground: "rgba(28,28,30,1)",
        accent: "#003da5", // Pantone 801c
        accentSlight: "#ccd8ea",
        accentSecondary: "#003da5", // Pantone 293c
        accentTernary: "#fbe122", // Pantone 207c
        error: "rgba(255,69,58,1)",
        actionNeutral: "#777",
        okay: "#00b16a",
        warn: "#eecc00",
        componentBorder: "#555",
        chatBubble: "#333",
        inputPlaceholder: "#bbb",
    },
};
