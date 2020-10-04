import * as React from "react";
import {NavigationContainerRef} from "@react-navigation/native";
import {RootNavigatorScreens} from "./types";

// Store a ref to the root navigator
export const rootNavigationRef = React.createRef<NavigationContainerRef>();

export function rootNavigate(name: keyof RootNavigatorScreens): void {
    rootNavigationRef.current?.navigate(name);
}
