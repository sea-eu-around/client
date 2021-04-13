import {FontAwesome} from "@expo/vector-icons";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as React from "react";
import {APP_VERSION} from "../constants/config";
import {SupportedLocale} from "../localization";
import {User} from "../model/user";
import {CookiesPreferences} from "../model/user-settings";
import {RootNavigatorScreens} from "../navigation/types";
import {getInitialRoute} from "../navigation/utils";
import {attemptLoginFromCache, verifyBackendConnection} from "../state/auth/actions";
import {readCachedStaticData, storeStaticData} from "../state/persistent-storage/static";
import {loadProfileInterests, loadProfileOffers} from "../state/profile/actions";
import {loadCookiesPreferences, loadVersionInfo, setLocale, setTheme} from "../state/settings/actions";
import store from "../state/store";
import {MyThunkDispatch} from "../state/types";
import {ThemeKey} from "../types";

let loggedInFromCache: User | undefined = undefined;
let isBackendReachable = false;

export default function useCachedResources(): {isLoadingComplete: boolean; initialRoute?: keyof RootNavigatorScreens} {
    const [isLoadingComplete, setLoadingComplete] = React.useState(false);

    // Load any resources or data that we need prior to rendering the app
    React.useEffect(() => {
        async function loadResourcesAndDataAsync() {
            try {
                SplashScreen.preventAutoHideAsync();

                const dispatch = store.dispatch as MyThunkDispatch;

                // Load fonts
                await Font.loadAsync({
                    ...FontAwesome.font,
                    Raleway: require("@assets/fonts/Raleway-Regular.ttf"),
                    RalewayThin: require("@assets/fonts/Raleway-Thin.ttf"),
                    RalewayLight: require("@assets/fonts/Raleway-Light.ttf"),
                    RalewaySemiBold: require("@assets/fonts/Raleway-SemiBold.ttf"),
                    RalewayBold: require("@assets/fonts/Raleway-Bold.ttf"),
                });

                // Read cookie consent information from persistent storage
                readCachedStaticData("cookieConsentDate").then((consentDate) => {
                    readCachedStaticData("cookies").then((cookies) => {
                        if (consentDate && cookies) {
                            const date = new Date(consentDate.data as string);
                            dispatch(loadCookiesPreferences(cookies.data as CookiesPreferences, date));
                        } else {
                            // On mobile, storage is turned on by default on the first visit
                            dispatch(loadCookiesPreferences({auth: true, cache: true, settings: true}, new Date()));
                        }
                    });
                });

                // Read previous version of the app, so we know if we are launching the app after an update
                readCachedStaticData("version").then((version) => {
                    dispatch(loadVersionInfo(version ? (version.data as string) : null));
                    storeStaticData("version", APP_VERSION, true);
                });

                // Attempt to read the settings from persistent storage
                readCachedStaticData("theme").then((theme) => {
                    if (theme) dispatch(setTheme(theme.data as ThemeKey, true));
                });
                readCachedStaticData("locale").then((locale) => {
                    if (locale) dispatch(setLocale(locale.data as SupportedLocale, true));
                    else store.dispatch(setLocale("en" as SupportedLocale, true));
                });

                const {reachable, userLoggedInFromCache} = await connectToBackend();
                isBackendReachable = reachable;
                loggedInFromCache = userLoggedInFromCache;
            } catch (e) {
                // We might want to provide this error information to an error reporting service
                console.warn(e);
            } finally {
                setLoadingComplete(true);
                SplashScreen.hideAsync();
            }
        }

        loadResourcesAndDataAsync();
    }, []);

    let initialRoute: undefined | keyof RootNavigatorScreens = undefined;
    if (!isBackendReachable) initialRoute = "BackendUnreachableScreen";
    else if (loggedInFromCache) initialRoute = getInitialRoute(true, loggedInFromCache.onboarded);

    return {isLoadingComplete, initialRoute};
}

export async function connectToBackend(): Promise<{
    reachable: boolean;
    userLoggedInFromCache: User | undefined;
}> {
    const dispatch = store.dispatch as MyThunkDispatch;

    const reachable = await dispatch(verifyBackendConnection());

    if (reachable) {
        // Load static data
        await Promise.all([dispatch(loadProfileOffers()), dispatch(loadProfileInterests())]);

        // Attempt to authenticate using cached data
        const userLoggedInFromCache = await dispatch(attemptLoginFromCache());

        return {reachable: true, userLoggedInFromCache};
    }

    return {reachable: false, userLoggedInFromCache: undefined};
}
