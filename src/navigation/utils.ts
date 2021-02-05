import * as React from "react";
import {NavigationContainerRef, Route} from "@react-navigation/native";
import {NavigatorRoute} from "./types";
import {Platform} from "react-native";
import {APP_SCHEME, WEB_TO_APP_TIMEOUT} from "../constants/config";
import i18n from "i18n-js";

// Store a ref to the root navigator
export const rootNavigationRef = React.createRef<NavigationContainerRef>();

// eslint-disable-next-line @typescript-eslint/ban-types
type RouteParams = Record<string, string | object | undefined | null>;

export function rootNavigate(route: NavigatorRoute, params?: RouteParams): void {
    rootNavigationRef.current?.navigate(route as string, params);
}

export function navigateBack(fallback?: NavigatorRoute): void {
    const nav = rootNavigationRef.current;
    if (nav) {
        if (nav.canGoBack()) nav.goBack();
        else if (fallback) nav.navigate(fallback);
    }
}

export function getRouteParams(route: Route<string>): {[key: string]: unknown} {
    const params = route.params;
    return params ? (params as {[key: string]: unknown}) : {};
}

export function attemptRedirectToApp(routeName: string, fallbackRoute: NavigatorRoute): void {
    const fallback = () => rootNavigate(fallbackRoute);

    if (Platform.OS === "web") {
        const link = `${APP_SCHEME}://${routeName}`;
        window.location.replace(link);

        // TODO look at Linking.openURL and Linking.canOpenURL
        setTimeout(() => {
            console.log(
                `Failed to redirect to ${link} (perhaps app is not installed on this device) - Staying on web version`,
            );
            fallback();
        }, WEB_TO_APP_TIMEOUT);
    } else fallback();
}

export function unauthorizedRedirect(): void {
    rootNavigate("LoginRoot", {screen: "WelcomeScreen"});
}

export function screenTitle(route: NavigatorRoute): string {
    return i18n.t(`screenTitles.${route}`) + i18n.t("screenTitles.suffix");
}

export function headerTitle(route: NavigatorRoute): string {
    return i18n.t(`screenTitles.${route}`);
}

export function openChat(roomId: string): void {
    rootNavigate("TabMessaging", {screen: "ChatScreen", params: {roomId}});
}
