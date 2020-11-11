import {ThemeKey} from "../types";

const tintColorLight = "#2f95dc";
const tintColorDark = "#fff";

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
        background: "#f9f9f9",
        cardBackground: "#f8f8f8",
        accent: "#003da5", // Pantone 293c
        accentSlight: "#ccd8ea",
        accentSecondary: "#009ace", // Pantone 801c
        accentTernary: "#fbe122", // Pantone 207c
        tint: tintColorLight,
        error: "#ff4a6a",
        actionNeutral: "#555555",
        okay: "#00b16a",
        tabIconDefault: "#ccc",
        tabIconSelected: tintColorLight,
        componentBorder: "#eee",
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
        accent: "#009ace", // Pantone 801c
        accentSlight: "#ccd8ea",
        accentSecondary: "#003da5", // Pantone 293c
        accentTernary: "#fbe122", // Pantone 207c
        tint: tintColorDark,
        error: "#f9819d",
        actionNeutral: "#777",
        okay: "#00b16a",
        tabIconDefault: "#ccc",
        tabIconSelected: tintColorDark,
        componentBorder: "#555",
    },
};
