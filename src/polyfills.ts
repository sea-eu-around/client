/* eslint-disable @typescript-eslint/ban-ts-comment */
import {Dimensions} from "react-native";
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

export function normalizeWheelEvent(e: WheelEvent): {spinY: number; pixelY: number} {
    // Reasonable defaults
    const PIXEL_STEP = 10;
    const LINE_HEIGHT = 40;
    const PAGE_HEIGHT = Dimensions.get("window").height;

    let sY = 0; // spinY
    let pY = 0; // pixelY

    // Legacy
    if ("detail" in e) sY = e.detail;
    if ("wheelDelta" in e) sY = -(e as {wheelDelta: number}).wheelDelta / 120;
    if ("wheelDeltaY" in e) sY = -(e as {wheelDeltaY: number}).wheelDeltaY / 120;

    if ("deltaY" in e) pY = e.deltaY;
    else pY = sY * PIXEL_STEP;

    if (pY && e.deltaMode) {
        // delta in LINE units
        if (e.deltaMode == 1) pY *= LINE_HEIGHT;
        // delta in PAGE units
        else pY *= PAGE_HEIGHT;
    }

    // Fall-back if spin cannot be determined
    if (pY && !sY) sY = pY < 1 ? -1 : 1;

    return {spinY: sY, pixelY: pY};
}
