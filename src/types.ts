import themes from "./constants/themes";

export type Theme = "light" | "dark";
export type ThemeValues = typeof themes.light;

export type FormProps<T> = {
    onSuccessfulSubmit?: (values: T) => void;
};
