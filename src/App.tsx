import {StatusBar} from "expo-status-bar";
import {registerRootComponent} from "expo";
import React from "react";
import {SafeAreaProvider} from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import store from "./state/store";
import {Provider} from "react-redux";
import configureLocalization from "./localization";
import {YellowBox} from "react-native";

configureLocalization();

// YellowBox.ignoreWarnings(["Require cycle"]); // TODO temporary

function App() {
    const isLoadingComplete = useCachedResources();
    const colorScheme = useColorScheme();

    if (!isLoadingComplete) {
        return null;
    } else {
        /* Original code from cli, replaced to add redux
        return (
            <SafeAreaProvider>
                <Navigation colorScheme={colorScheme} />
                <StatusBar />
            </SafeAreaProvider>
        );*/
        return (
            <Provider store={store}>
                <Navigation colorScheme={colorScheme} />
                <StatusBar />
            </Provider>
        );
    }
}

export default registerRootComponent(App);
