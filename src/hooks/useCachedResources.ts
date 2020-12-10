import {FontAwesome} from "@expo/vector-icons";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as React from "react";
import {RootNavigatorScreens} from "../navigation/types";
import {attemptLoginFromCache} from "../state/auth/actions";
import {loadProfileInterests, loadProfileOffers} from "../state/profile/actions";
import store from "../state/store";
import {MyThunkDispatch} from "../state/types";

let loggedInFromCache = false;

export default function useCachedResources(): {isLoadingComplete: boolean; initialRoute?: keyof RootNavigatorScreens} {
    const [isLoadingComplete, setLoadingComplete] = React.useState(false);

    // Load any resources or data that we need prior to rendering the app
    React.useEffect(() => {
        async function loadResourcesAndDataAsync() {
            try {
                SplashScreen.preventAutoHideAsync();

                const dispatch = store.dispatch as MyThunkDispatch;

                // TODO Improve data loading
                //  - show something if the backend couldn't be reached

                // Load static data
                await dispatch(loadProfileOffers());
                await dispatch(loadProfileInterests());

                // Load fonts
                await Font.loadAsync({
                    ...FontAwesome.font,
                    raleway: require("@assets/fonts/Raleway-VariableFont_wght.ttf"),
                    //"space-mono": require("../../assets/fonts/SpaceMono-Regular.ttf"),
                });

                // Attempt to authenticate using cached data
                loggedInFromCache = await dispatch(attemptLoginFromCache());
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
    if (loggedInFromCache) initialRoute = "MainScreen";

    return {isLoadingComplete, initialRoute};
}
