import {registerRootComponent} from "expo";
import React, {useState} from "react";
import useCachedResources from "./hooks/useCachedResources";
import Navigation from "./navigation";
import {Provider} from "react-redux";
import configureLocalization from "./localization";
import {SafeAreaProvider} from "react-native-safe-area-context";
import ConnectedThemeProvider from "./components/providers/ConnectedThemeProvider";
import store from "./state/store";
import ThemedStatusBar from "./components/ThemedStatusBar";
import {configureNotifications} from "./notifications";
import {initPolyfills} from "./polyfills";
import CookieBanner from "./components/CookieBanner";
import BottomSheetModalProvider from "./components/bottom-sheet/BottomSheetModalProvider";

function App() {
    initPolyfills();
    const {isLoadingComplete, initialRoute} = useCachedResources();
    configureLocalization();
    configureNotifications();

    const [navigationReady, setNavigationReady] = useState<boolean>(false);

    if (!isLoadingComplete) {
        return null;
    } else {
        return (
            <SafeAreaProvider>
                <Provider store={store}>
                    <ConnectedThemeProvider>
                        <BottomSheetModalProvider>
                            <Navigation onReady={() => setNavigationReady(true)} initialRoute={initialRoute} />
                            {navigationReady && <ThemedStatusBar />}
                        </BottomSheetModalProvider>
                        <CookieBanner />
                    </ConnectedThemeProvider>
                </Provider>
            </SafeAreaProvider>
        );
    }
}

export default registerRootComponent(App);
