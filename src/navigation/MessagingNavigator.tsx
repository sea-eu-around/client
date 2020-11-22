import {createStackNavigator} from "@react-navigation/stack";
import * as React from "react";
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import ChatScreen from "../screens/messaging/ChatScreen";
import IndividualMessagingTab from "../screens/messaging/IndividualMessagingTab";
import GroupMessagingTab from "../screens/messaging/GroupMessagingTab";
import i18n from "i18n-js";
import {TabMessagingRoot, TabMessagingTabs} from "./types";

const Stack = createStackNavigator<TabMessagingRoot>();
const Tab = createMaterialTopTabNavigator<TabMessagingTabs>();

export default function MessagingNavigator(): JSX.Element {
    const insets = useSafeAreaInsets();
    return (
        <Stack.Navigator initialRouteName="MessagingScreen" headerMode="none">
            <Stack.Screen name="ChatScreen" component={ChatScreen} />
            <Stack.Screen name="MessagingScreen">
                {() => (
                    <Tab.Navigator tabBarOptions={{style: {paddingTop: insets.top}}}>
                        <Tab.Screen
                            name="IndividualMessagingTab"
                            options={{tabBarLabel: i18n.t("messaging.tabIndividual")}}
                            component={IndividualMessagingTab}
                        />
                        <Tab.Screen
                            name="GroupMessagingTab"
                            options={{tabBarLabel: i18n.t("messaging.tabGroup")}}
                            component={GroupMessagingTab}
                        />
                    </Tab.Navigator>
                )}
            </Stack.Screen>
        </Stack.Navigator>
    );
}
