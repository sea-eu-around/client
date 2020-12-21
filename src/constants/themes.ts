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
        error: "#ff4a6a",
        actionNeutral: "#555555",
        okay: "#00b16a",
        warn: "#eecc00",
        componentBorder: "#eee",
        chatBubble: "#ededed",
    },
    dark: {
        id: "dark" as ThemeKey,
        text: darkThemeText,
        textWhite: darkThemeText,
        textBlack: lightThemeText,
        textLight: "#ccc",
        textInverted: "#111",
        background: "#333",
        cardBackground: "#3d3d3d",
        almostBackground: "#393c40",
        accent: "#009ace", // Pantone 801c
        accentSlight: "#ccd8ea",
        accentSecondary: "#003da5", // Pantone 293c
        accentTernary: "#fbe122", // Pantone 207c
        error: "#f9819d",
        actionNeutral: "#777",
        okay: "#00b16a",
        warn: "#eecc00",
        componentBorder: "#555",
        chatBubble: "#333",
    },
};
