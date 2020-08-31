import {SetThemeAction} from "../types";
import {Theme} from "../../types";

export enum THEMING_ACTION_TYPES {
    SET_THEME = "THEMING/SET_THEME",
}

export const setTheme = (theme: Theme): SetThemeAction => ({
    type: THEMING_ACTION_TYPES.SET_THEME,
    theme,
} as SetThemeAction);
