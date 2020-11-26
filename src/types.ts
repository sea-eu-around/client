import {ThemeProps as RNEThemeProps} from "react-native-elements";
import themes from "./constants/themes";
import {AppThunk} from "./state/types";

export type ThemeKey = "light" | "dark";
export type Theme = typeof themes.light;

export type FormProps<T> = {
    onSuccessfulSubmit?: (values: T) => void;
};

export type ThemeProps = RNEThemeProps<Theme>;

export type FailableActionReturn = {success: boolean; errors?: string[]};
export type FailableAppThunk = AppThunk<Promise<FailableActionReturn>>;
