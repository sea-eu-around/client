/* eslint-disable react/display-name */
import * as React from "react";
import IndividualMessagingTab from "../screens/messaging/IndividualMessagingTab";
import {TabMessagingRoot} from "./types";
import {screenTitle} from "./utils";
import MainHeader from "../components/headers/MainHeader";
import {createStackNavigator} from "@react-navigation/stack";
import ChatScreenHeader from "../components/headers/ChatScreenHeader";
import ChatScreen from "../screens/messaging/ChatScreen";

const Stack = createStackNavigator<TabMessagingRoot>();

const MessagingNavigator = (): JSX.Element => (
    <Stack.Navigator>
        <Stack.Screen
            name="MessagingScreen"
            component={IndividualMessagingTab}
            options={{
                title: screenTitle("MessagingScreen"),
                headerShown: true,
                header: MainHeader,
            }}
        />
        <Stack.Screen name="ChatScreen" options={{headerShown: false, title: screenTitle("ChatScreen")}}>
            {(props) => (
                <>
                    <ChatScreen {...props} />
                    <ChatScreenHeader {...props} />
                </>
            )}
        </Stack.Screen>
    </Stack.Navigator>
);

export default MessagingNavigator;
