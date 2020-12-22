import {registerRootComponent} from "expo";
import React from "react";
import useCachedResources from "./hooks/useCachedResources";
import Navigation from "./navigation";
import {Provider} from "react-redux";
import configureLocalization from "./localization";
import {SafeAreaProvider} from "react-native-safe-area-context";
import ConnectedThemeProvider from "./components/providers/ConnectedThemeProvider";
import store from "./state/store";
import ThemedStatusBar from "./components/ThemedStatusBar";
import {configureNotifications} from "./notifications";

function App() {
    const {isLoadingComplete, initialRoute} = useCachedResources();
    configureLocalization();
    configureNotifications();

    if (!isLoadingComplete) {
        return null;
    } else {
        return (
            <SafeAreaProvider>
                <Provider store={store}>
                    <ConnectedThemeProvider>
                        <Navigation initialRoute={initialRoute} />
                        <ThemedStatusBar />
                    </ConnectedThemeProvider>
                </Provider>
            </SafeAreaProvider>
        );
    }
}

export default registerRootComponent(App);
