import {StatusBar} from "expo-status-bar";
import {registerRootComponent} from "expo";
import React from "react";
import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import store from "./state/store";
import {Provider} from "react-redux";
import configureLocalization from "./localization";
import {YellowBox} from "react-native";
import {SafeAreaProvider} from "react-native-safe-area-context";

// YellowBox.ignoreWarnings(["Require cycle"]); // TODO temporary
YellowBox.ignoreWarnings(["VirtualizedLists should never be nested"]); // TODO: Remove when fixed

function App() {
    const isLoadingComplete = useCachedResources();
    const colorScheme = useColorScheme();
    configureLocalization();

    if (!isLoadingComplete) {
        return null;
    } else {
        return (
            <SafeAreaProvider>
                <Provider store={store}>
                    <Navigation colorScheme={colorScheme} />
                    <StatusBar />
                </Provider>
            </SafeAreaProvider>
        );
    }
}

export default registerRootComponent(App);
