import * as React from "react";
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import IndividualMessagingTab from "../screens/messaging/IndividualMessagingTab";
import GroupMessagingTab from "../screens/messaging/GroupMessagingTab";
import i18n from "i18n-js";
import {TabMessagingRoot} from "./types";
import {screenTitle} from "./utils";

const Tab = createMaterialTopTabNavigator<TabMessagingRoot>();

export default function MessagingNavigator(): JSX.Element {
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
