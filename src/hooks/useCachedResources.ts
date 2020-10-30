import {FontAwesome, Ionicons} from "@expo/vector-icons";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as React from "react";
import {loadProfileInterests, loadProfileOffers} from "../state/profile/actions";
import store from "../state/store";
import {MyThunkDispatch} from "../state/types";

export default function useCachedResources(): boolean {
    const [isLoadingComplete, setLoadingComplete] = React.useState(false);

    // Load any resources or data that we need prior to rendering the app
    React.useEffect(() => {
        async function loadResourcesAndDataAsync() {
            try {
                SplashScreen.preventAutoHideAsync();

                // Start loading profile offers
                // TODO show something if the backend couldn't be reached
                // TODO store in AsyncStorage so the data doesn't need to be fetched every time (maybe use versioning so it can be updated when needed)
                (store.dispatch as MyThunkDispatch)(loadProfileOffers());

                // Start loading profile interests
                (store.dispatch as MyThunkDispatch)(loadProfileInterests());

                // Load fonts
                await Font.loadAsync({
                    ...Ionicons.font,
                    ...FontAwesome.font,
                    "space-mono": require("../../assets/fonts/SpaceMono-Regular.ttf"),
                });
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

    return isLoadingComplete;
}
