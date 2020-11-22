import * as React from "react";
import {NavigationContainerRef} from "@react-navigation/native";
import {NavigatorRoute} from "./types";
import {Platform} from "react-native";
import {APP_SCHEME} from "../constants/config";

// Store a ref to several navigators
export const rootNavigationRef = React.createRef<NavigationContainerRef>();

export function rootNavigate(route: NavigatorRoute): void {
    rootNavigationRef.current?.navigate(route as string);
}

export function attemptRedirectToApp(path: string, fallbackRoute: NavigatorRoute): void {
    const fallback = () => rootNavigate(fallbackRoute);

    if (Platform.OS == "web") {
        const link = `${APP_SCHEME}://${path}`;
        window.location.replace(link);
        // TODO fallback after a timeout ?
        console.log(`window.location.replace(${link})`);
    } else fallback();
}
