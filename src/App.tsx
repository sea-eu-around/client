import {StatusBar} from "expo-status-bar";
import {registerRootComponent} from "expo";
import React from "react";
import useCachedResources from "./hooks/useCachedResources";
import Navigation from "./navigation";
import {Provider} from "react-redux";
import configureLocalization from "./localization";
import {SafeAreaProvider} from "react-native-safe-area-context";
import ConnectedThemeProvider from "./components/providers/ConnectedThemeProvider";
import store from "./state/store";

// Example for disabling a warning :
// YellowBox.ignoreWarnings(["VirtualizedLists should never be nested"]);

function App() {
    const isLoadingComplete = useCachedResources();
    configureLocalization();

    if (!isLoadingComplete) {
        return null;
    } else {
        return (
            <SafeAreaProvider>
                <Provider store={store}>
                    <ConnectedThemeProvider>
                        <Navigation />
                        <StatusBar />
                    </ConnectedThemeProvider>
                </Provider>
            </SafeAreaProvider>
        );
    }
}

export default registerRootComponent(App);
