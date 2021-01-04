/* eslint-disable react/display-name */
import * as React from "react";
import ChatRoomsScreen from "../screens/messaging/ChatRoomsScreen";
import {TabMessagingRoot} from "./types";
import {screenTitle} from "./utils";
import MainHeader from "../components/headers/MainHeader";
import {createStackNavigator, StackHeaderProps} from "@react-navigation/stack";
import ChatScreenHeader from "../components/headers/ChatScreenHeader";
import ChatScreen from "../screens/messaging/ChatScreen";
import MatchScreenHeader from "../components/headers/MatchScreenHeader";

const Stack = createStackNavigator<TabMessagingRoot>();

const MessagingNavigator = (): JSX.Element => (
    <Stack.Navigator>
        <Stack.Screen
            name="ChatRoomsScreen"
            component={ChatRoomsScreen}
            options={{
                title: screenTitle("ChatRoomsScreen"),
                headerShown: true,
                header: (props: StackHeaderProps) => <MainHeader {...props} />,
            }}
        />
        <Stack.Screen name="ChatScreen" options={() => ({headerShown: false, title: screenTitle("ChatScreen")})}>
            {(props) => (
                <>
                    <ChatScreen {...props} />
                    {/*<ChatScreenHeader {...props} /> TODO CHAT */}
                    <MatchScreenHeader blur={true} {...props} />
                </>
            )}
        </Stack.Screen>
    </Stack.Navigator>
);

export default MessagingNavigator;
