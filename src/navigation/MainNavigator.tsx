/* eslint-disable react/display-name */
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {createStackNavigator, StackScreenProps} from "@react-navigation/stack";
import * as React from "react";
import {MainNavigatorTabs, RootNavigatorScreens, TabHomeRoot} from "../navigation/types";
import {withTheme} from "react-native-elements";
import MessagingNavigator from "./MessagingNavigator";
import {BottomTabBarButtonProps, BottomTabBarProps} from "@react-navigation/bottom-tabs/lib/typescript/src/types";
import {ThemeProps} from "../types";
import TabHomeScreen from "../screens/TabHomeScreen";
import {rootNavigate, screenTitle} from "./utils";
import MainHeader from "../components/headers/MainHeader";
import {TabMatchingNavigator} from "./TabMatchingNavigator";
import MainTabBar, {MainTabBarIcon} from "../components/tabs/MainTabBar";
import {getFocusedRouteNameFromRoute} from "@react-navigation/native";
import {TouchableOpacity} from "react-native";

const TabNavigator = createBottomTabNavigator<MainNavigatorTabs>();

// Component props
export type MainNavigatorProps = ThemeProps & StackScreenProps<RootNavigatorScreens, "MainScreen">;

function MainNavigatorComponent(): JSX.Element {
    return (
        <TabNavigator.Navigator
            initialRouteName="TabMatching"
            tabBar={(props: BottomTabBarProps) => <MainTabBar {...props} />}
        >
            {/*<TabNavigator.Screen
                name="TabHome"
                component={TabHomeNavigator}
                options={{
                    tabBarIcon: (props) => <MainTabBarIcon name="home" {...props} />,
                }}
            />*/}
            <TabNavigator.Screen
                name="TabMatching"
                component={TabMatchingNavigator}
                options={{
                    tabBarIcon: (props) => <MainTabBarIcon name="contacts" {...props} />,
                }}
            />
            <TabNavigator.Screen
                name="TabMessaging"
                component={MessagingNavigator}
                options={({route}) => ({
                    tabBarVisible: getFocusedRouteNameFromRoute(route) !== "ChatScreen",
                    tabBarIcon: (props) => <MainTabBarIcon name="message" {...props} />,
                    // Override the button to make sure we redirect to the rooms screen instead of a previously open conversation
                    tabBarButton: (props: BottomTabBarButtonProps) => (
                        <TouchableOpacity
                            {...props}
                            activeOpacity={1}
                            onPress={() => rootNavigate("TabMessaging", {screen: "ChatRoomsScreen"})}
                        />
                    ),
                })}
            />
            {/*
            <TabNavigator.Screen
                name="TabNotifications"
                component={TabNotificationsNavigator}
                options={{
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

/*
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
*/

export default withTheme(MainNavigatorComponent);
