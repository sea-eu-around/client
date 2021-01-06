/* eslint-disable react/display-name */
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {createStackNavigator, StackScreenProps} from "@react-navigation/stack";
import * as React from "react";
import TabNotImplementedScreen from "../screens/TabNotImplementedScreen";
import {MainNavigatorTabs, RootNavigatorScreens, TabHomeRoot, TabNotificationsRoot} from "../navigation/types";
import {withTheme} from "react-native-elements";
import MessagingNavigator from "./MessagingNavigator";
import {BottomTabBarProps} from "@react-navigation/bottom-tabs/lib/typescript/src/types";
import {ThemeProps} from "../types";
import TabHomeScreen from "../screens/TabHomeScreen";
import {screenTitle} from "./utils";
import MainHeader from "../components/headers/MainHeader";
import {TabMatchingNavigator} from "./TabMatchingNavigator";
import MainTabBar, {MainTabBarIcon} from "../components/tabs/MainTabBar";
import {getFocusedRouteNameFromRoute} from "@react-navigation/native";

const TabNavigator = createBottomTabNavigator<MainNavigatorTabs>();

// Component props
export type MainNavigatorProps = ThemeProps & StackScreenProps<RootNavigatorScreens, "MainScreen">;

function MainNavigatorComponent(): JSX.Element {
    return (
        <TabNavigator.Navigator
            initialRouteName="TabHome"
            tabBar={(props: BottomTabBarProps) => <MainTabBar {...props} />}
        >
            <TabNavigator.Screen
                name="TabHome"
                component={TabHomeNavigator}
                options={{
                    //tabBarLabel: (props) => <MainTabBarLabel text={i18n.t("tabs.home")} {...props} />,
                    tabBarIcon: (props) => <MainTabBarIcon name="home" {...props} />,
                }}
            />
            <TabNavigator.Screen
                name="TabMatching"
                component={TabMatchingNavigator}
                options={{
                    //tabBarLabel: (props) => <MainTabBarLabel text={i18n.t("tabs.matching")} {...props} />,
                    tabBarIcon: (props) => <MainTabBarIcon name="contacts" {...props} />,
                }}
            />
            <TabNavigator.Screen
                name="TabMessaging"
                component={MessagingNavigator}
                options={({route}) => ({
                    tabBarVisible: getFocusedRouteNameFromRoute(route) !== "ChatScreen",
                    //tabBarLabel: (props) => <MainTabBarLabel text={i18n.t("tabs.messaging")} {...props} />,
                    tabBarIcon: (props) => <MainTabBarIcon name="message" {...props} />,
                })}
            />
            {/*
            <TabNavigator.Screen
                name="TabNotifications"
                component={TabNotificationsNavigator}
                options={{
                    //tabBarLabel: (props)  => <MainTabBarLabel text={i18n.t("tabs.notifications")} {...props} />,
                    tabBarIcon: (props) => <MainTabBarIcon name="notifications" {...props} />,
                }}
            />
            */}
        </TabNavigator.Navigator>
    );
}

const TabHomeStack = createStackNavigator<TabHomeRoot>();

const TabHomeNavigator = (): JSX.Element => (
    <TabHomeStack.Navigator screenOptions={{header: MainHeader}}>
        <TabHomeStack.Screen
            name="TabHomeScreen"
            component={TabHomeScreen}
            options={{title: screenTitle("TabHomeScreen")}}
        />
    </TabHomeStack.Navigator>
);

const TabNotificationsStack = createStackNavigator<TabNotificationsRoot>();

const TabNotificationsNavigator = (): JSX.Element => (
    <TabNotificationsStack.Navigator screenOptions={{header: MainHeader}}>
        <TabNotificationsStack.Screen
            name="TabNotificationsScreen"
            component={TabNotImplementedScreen}
            options={{title: screenTitle("TabNotificationsScreen")}}
        />
    </TabNotificationsStack.Navigator>
);

export default withTheme(MainNavigatorComponent);
