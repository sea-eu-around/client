import {createStackNavigator} from "@react-navigation/stack";
import * as React from "react";
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import ChatScreen from "../screens/messaging/ChatScreen";
import IndividualMessagingTab from "../screens/messaging/IndividualMessagingTab";
import GroupMessagingTab from "../screens/messaging/GroupMessagingTab";
import i18n from "i18n-js";
import {TabMessagingRoot, TabMessagingTabs} from "./types";
import {screenTitle} from "./utils";

const Stack = createStackNavigator<TabMessagingRoot>();
const Tab = createMaterialTopTabNavigator<TabMessagingTabs>();

function MessagingTabsNavigator(): JSX.Element {
    const insets = useSafeAreaInsets();
    return (
        <Tab.Navigator tabBarOptions={{style: {paddingTop: insets.top}}} initialRouteName="IndividualMessagingTab">
            <Tab.Screen
                name="IndividualMessagingTab"
                options={{
                    tabBarLabel: i18n.t("messaging.tabIndividual"),
                    title: screenTitle("IndividualMessagingTab"),
                }}
                component={IndividualMessagingTab}
            />
            <Tab.Screen
                name="GroupMessagingTab"
                options={{
                    tabBarLabel: i18n.t("messaging.tabGroup"),
                    title: screenTitle("GroupMessagingTab"),
                }}
                component={GroupMessagingTab}
            />
        </Tab.Navigator>
    );
}

export default function MessagingNavigator(): JSX.Element {
    return (
        <Stack.Navigator headerMode="none" initialRouteName="MessagingScreen">
            <Stack.Screen name="MessagingScreen" component={MessagingTabsNavigator} />
            <Stack.Screen name="ChatScreen" component={ChatScreen} />
        </Stack.Navigator>
    );
}
