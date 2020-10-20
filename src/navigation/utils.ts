import * as React from "react";
import {NavigationContainerRef} from "@react-navigation/native";
import {NavigatorRoute} from "./types";

// Store a ref to several navigators
export const rootNavigationRef = React.createRef<NavigationContainerRef>();

export function rootNavigate(route: NavigatorRoute): void {
    rootNavigationRef.current?.navigate(route as string);
}
