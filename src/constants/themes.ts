const tintColorLight = "#2f95dc";
const tintColorDark = "#fff";

export default {
    light: {
        text: "#000",
        textLight: "#666",
        textInverted: "#fff",
        background: "#f9f9f9",
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
    },
    dark: {
        text: "#fff",
        textLight: "#ccc",
        textInverted: "#111",
        background: "#333",
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
    },
};
