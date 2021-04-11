import {ImageStyle, TextStyle, ViewStyle} from "react-native";
import layout from "../constants/layout";
import themes from "../constants/themes";
import {Theme} from "../types";

type NamedStyles<T> = {[P in keyof T]: ViewStyle | TextStyle | ImageStyle};
type ThemedStyles<T extends NamedStyles<T>> = (theme: Theme) => T;
type ThemedStylesInternal<T extends NamedStyles<T>> = (theme: Theme, wideDevice: boolean) => T;

/** Tool to pre-generate stylesheet variations for each theme.  */
export function preTheme<T extends NamedStyles<T>>(generator: ThemedStylesInternal<T>): ThemedStyles<T> {
    // Pre-generate the styles in a key:value map
    const styles: {[key: string]: T} = {};
    const wideDevice = layout.isWideDevice;
    Object.values(themes).forEach((theme: Theme) => (styles[theme.id] = generator(theme, wideDevice)));
    // Wrap the map as a function
    return (theme: Theme) => styles[theme.id];
}
