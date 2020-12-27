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
import {initPolyfills} from "./state/polyfills";
import CookieBanner from "./components/CookieBanner";

function App() {
    initPolyfills();
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
                        <CookieBanner />
                    </ConnectedThemeProvider>
                </Provider>
            </SafeAreaProvider>
        );
    }
}

export default registerRootComponent(App);
