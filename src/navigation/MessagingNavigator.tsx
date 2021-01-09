/* eslint-disable react/display-name */
import * as React from "react";
import ChatRoomsScreen from "../screens/messaging/ChatRoomsScreen";
import {NavigatorRoute, TabMessagingRoot} from "./types";
import {rootNavigationRef, screenTitle} from "./utils";
import MainHeader from "../components/headers/MainHeader";
import {createStackNavigator, StackHeaderProps} from "@react-navigation/stack";
import ChatScreenHeader from "../components/headers/ChatScreenHeader";
import ChatScreen from "../screens/messaging/ChatScreen";
import {AppStateStatus, AppState as RNAppState} from "react-native";
import chatSocket from "../api/chat-socket";
import {CHAT_CONNECTED_ROUTES} from "../constants/route-settings";
import {MyThunkDispatch} from "../state/types";
import {connectToChat, disconnectFromChat} from "../state/messaging/actions";
import store from "../state/store";

const Stack = createStackNavigator<TabMessagingRoot>();

class MessagingNavigator extends React.Component {
    componentDidMount(): void {
        // Handle app state changes (active / inactive)
        let previousAppStatus: AppStateStatus;
        RNAppState.addEventListener("change", (status: AppStateStatus) => {
            // If the app is now active
            if (previousAppStatus !== "active" && status === "active") this.onAppActive();
            // If the app is no longer active
            if (previousAppStatus === "active" && status !== "active") this.onAppInactive();
            previousAppStatus = status;
        });
    }

    private onAppActive(): void {
        // Reconnect to chat if needed
        if (!chatSocket.isConnected()) {
            const route = rootNavigationRef.current?.getCurrentRoute()?.name as NavigatorRoute;
            const isChat = CHAT_CONNECTED_ROUTES.includes(route);
            if (isChat) (store.dispatch as MyThunkDispatch)(connectToChat());
        }
    }

    private onAppInactive(): void {
        // Disconnect from the chat if connected
        if (chatSocket.isConnected()) store.dispatch(disconnectFromChat());
    }

    render(): JSX.Element {
        return (
            <Stack.Navigator headerMode="screen">
                <Stack.Screen
                    name="ChatRoomsScreen"
                    component={ChatRoomsScreen}
                    options={{
                        title: screenTitle("ChatRoomsScreen"),
                        headerShown: true,
                        header: (props: StackHeaderProps) => <MainHeader {...props} />,
                    }}
                />
                <Stack.Screen
                    name="ChatScreen"
                    options={() => ({headerShown: false, title: screenTitle("ChatScreen")})}
                >
                    {(props) => (
                        <>
                            <ChatScreen {...props} />
                            <ChatScreenHeader {...props} />
                        </>
                    )}
                </Stack.Screen>
            </Stack.Navigator>
        );
    }
}

/**
 * Handle connecting / disconnecting from the chat depending on the focused route.
 */
export function handleRouteChangeForChat(route: NavigatorRoute, previousRoute: NavigatorRoute | undefined): void {
    const toChat = CHAT_CONNECTED_ROUTES.includes(route);
    const fromChat = previousRoute && CHAT_CONNECTED_ROUTES.includes(previousRoute);
    if (!fromChat && toChat) (store.dispatch as MyThunkDispatch)(connectToChat());
    if (fromChat && !toChat) (store.dispatch as MyThunkDispatch)(disconnectFromChat());
}

export default MessagingNavigator;
