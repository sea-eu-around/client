import {ThemeKey} from "../types";

const lightThemeText = "#000";
const darkThemeText = "#fff";

export default {
    light: {
        id: "light" as ThemeKey,
        text: lightThemeText,
        textLight: "#666",
        textInverted: "#fff",
        background: "#fff",
        cardBackground: "#f7f7f7",
        accent: "#003da5",
        themeAwareAccent: "#003da5",
        accentSlight: "#E0E8F4",
        accentSecondary: "#009ace",
        accentTernary: "#fbe122",
        error: "#ff3b30",
        actionNeutral: "#555555",
        okay: "#00b16a",
        warn: "#eecc00",
        componentBorder: "#bbb",
        buttonGroupBorder: "#dfdfdf",
        greenModalBackground: "#3caf82",
        chatBubble: "#ededed",
        inputPlaceholder: "#999",
        onboardingInputBackground: "#F2F2F7",
    },
    dark: {
        id: "dark" as ThemeKey,
        text: darkThemeText,
        textLight: "#ccc",
        textInverted: "#111",
        background: "#000",
        cardBackground: "#1c1c1e",
        accent: "#003da5",
        themeAwareAccent: "#448CFF", // a variant of the accent color that is usable against a dark background
        accentSlight: "#ccd8ea",
        accentSecondary: "#003da5",
        accentTernary: "#fbe122",
        error: "#ff453a",
        actionNeutral: "#777",
        okay: "#00b16a",
        warn: "#eecc00",
        componentBorder: "#555",
        buttonGroupBorder: "#1f1f1f",
        greenModalBackground: "#3caf82",
        chatBubble: "#333",
        inputPlaceholder: "#bbb",
        onboardingInputBackground: "#333337",
    },
};
