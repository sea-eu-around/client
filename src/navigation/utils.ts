import * as React from "react";
import {NavigationContainerRef} from "@react-navigation/native";
import {NavigatorRoute} from "./types";
import {Platform} from "react-native";
import {APP_SCHEME} from "../constants/config";
import i18n from "i18n-js";

// Store a ref to the root navigator
export const rootNavigationRef = React.createRef<NavigationContainerRef>();

export function rootNavigate(route: NavigatorRoute): void {
    rootNavigationRef.current?.navigate(route as string);
}

export function attemptRedirectToApp(path: string, fallbackRoute: NavigatorRoute): void {
    const fallback = () => rootNavigate(fallbackRoute);

    if (Platform.OS == "web") {
        const link = `${APP_SCHEME}://${path}`;
        window.location.replace(link);

        console.log(`window.location.replace(${link})`);
        // TODO fallback after a timeout ?
        setTimeout(fallback, 5000);
    } else fallback();
}

export function screenTitle(route: NavigatorRoute): string {
    return i18n.t(`screenTitles.${route}`) + i18n.t("screenTitles.suffix");
}

export function headerTitle(route: NavigatorRoute): string {
    return i18n.t(`screenTitles.${route}`);
}
