import * as React from "react";
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import IndividualMessagingTab from "../screens/messaging/IndividualMessagingTab";
import GroupMessagingTab from "../screens/messaging/GroupMessagingTab";
import i18n from "i18n-js";
import {TabMessagingRoot, TabMessagingTabs} from "./types";
import {screenTitle} from "./utils";
import MainHeader from "../components/headers/MainHeader";
import {createStackNavigator, StackHeaderProps} from "@react-navigation/stack";
import {ThemeConsumer} from "react-native-elements";
import {ThemeProps} from "../types";
import {headerStyles} from "../styles/headers";

const Stack = createStackNavigator<TabMessagingRoot>();
const Tab = createMaterialTopTabNavigator<TabMessagingTabs>();

const Header = (stackProps: StackHeaderProps) => (
    <ThemeConsumer>
        {({theme}: ThemeProps) => {
            const hstyles = headerStyles(theme);
            return (
                <MainHeader
                    {...stackProps}
                    wrapperStyle={[hstyles.wrapperNoShadow, {backgroundColor: theme.background}]}
                />
            );
        }}
    </ThemeConsumer>
);

const MessagingNavigator = (): JSX.Element => (
    <Stack.Navigator screenOptions={{header: Header}}>
        <Stack.Screen name="MessagingScreen">
            {() => (
                <Tab.Navigator initialRouteName="IndividualMessagingTab">
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
            )}
        </Stack.Screen>
    </Stack.Navigator>
);

export default MessagingNavigator;
