import {ThemeProps as RNEThemeProps} from "react-native-elements";
import themes from "./constants/themes";

export type ThemeKey = "light" | "dark";
export type Theme = typeof themes.light;

export type FormProps<T> = {
    onSuccessfulSubmit?: (values: T) => void;
};

export type ThemeProps = RNEThemeProps<Theme>;
