/* eslint-disable @typescript-eslint/ban-ts-comment */
import {colors} from "react-native-elements";

export function initPolyfills(): void {
    // FIXME: https://github.com/react-native-elements/react-native-elements/pull/2561

    // @ts-ignore react-native-elements typings are missing "web"
    if (!colors.platform.web) {
        // @ts-ignore react-native-elements typings are missing "web"
        colors.platform.web = {
            primary: "#2089dc",
            secondary: "#ca71eb",
            grey: "#393e42",
            searchBg: "#303337",
            success: "#52c41a",
            error: "#ff190c",
            warning: "#faad14",
        };
    }
}
