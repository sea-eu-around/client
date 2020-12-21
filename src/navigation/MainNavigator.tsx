/* eslint-disable react/display-name */
import {MaterialIcons} from "@expo/vector-icons";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {createStackNavigator, StackScreenProps} from "@react-navigation/stack";
import * as React from "react";
import TabNotImplementedScreen from "../screens/TabNotImplementedScreen";
import {MainNavigatorTabs, RootNavigatorScreens, TabHomeRoot, TabNotificationsRoot} from "../navigation/types";
import i18n from "i18n-js";
import {withTheme} from "react-native-elements";
import MessagingNavigator from "./MessagingNavigator";
import {Text} from "react-native";
import {LabelPosition} from "@react-navigation/bottom-tabs/lib/typescript/src/types";
import {ThemeProps} from "../types";
import TabHomeScreen from "../screens/TabHomeScreen";
import {screenTitle} from "./utils";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import MainHeader from "../components/headers/MainHeader";
import {TabMatchingNavigator} from "./TabMatchingNavigator";

const TabNavigator = createBottomTabNavigator<MainNavigatorTabs>();

// Component props
export type MainNavigatorProps = ThemeProps & StackScreenProps<RootNavigatorScreens, "MainScreen">;

function MainNavigatorComponent({theme}: MainNavigatorProps): JSX.Element {
    const {bottom} = useSafeAreaInsets();
    return (
        <TabNavigator.Navigator
            initialRouteName="TabHome"
            tabBarOptions={{
                activeTintColor: theme.accent,
                style: {
                    height: 55 + bottom,
                    paddingTop: 5,
                    paddingBottom: 5,
                    backgroundColor: "rgba(255,255,255,1)",
                    borderTopWidth: 0,
                    position: "absolute",
                },
                tabStyle: {flexDirection: "column", paddingBottom: bottom},
                iconStyle: {flex: 1},
                showLabel: false,
            }}
        >
            <TabNavigator.Screen
                name="TabHome"
                component={TabHomeNavigator}
                options={{
                    tabBarLabel: (props: TabBarLabelProps) => <TabBarLabel text={i18n.t("tabs.home")} {...props} />,
                    tabBarIcon: (props: TabBarIconProps) => <TabBarIcon name="home" {...props} />,
                }}
            />
            <TabNavigator.Screen
                name="TabMatching"
                component={TabMatchingNavigator}
                options={{
                    tabBarLabel: (props: TabBarLabelProps) => <TabBarLabel text={i18n.t("tabs.matching")} {...props} />,
                    tabBarIcon: (props: TabBarIconProps) => <TabBarIcon name="contacts" {...props} />,
                }}
            />
            <TabNavigator.Screen
                name="TabMessaging"
                component={MessagingNavigator}
                options={{
                    tabBarLabel: (props: TabBarLabelProps) => (
                        <TabBarLabel text={i18n.t("tabs.messaging")} {...props} />
                    ),
                    tabBarIcon: (props: TabBarIconProps) => <TabBarIcon name="message" {...props} />,
                }}
            />
            <TabNavigator.Screen
                name="TabNotifications"
                component={TabNotificationsNavigator}
                options={{
                    tabBarLabel: (props: TabBarLabelProps) => (
                        <TabBarLabel text={i18n.t("tabs.notifications")} {...props} />
                    ),
                    tabBarIcon: (props: TabBarIconProps) => <TabBarIcon name="notifications" {...props} />,
                }}
            />
        </TabNavigator.Navigator>
    );
}

type TabBarIconProps = {
    focused: boolean;
    color: string;
    size: number;
};
type TabBarLabelProps = {
    focused: boolean;
    color: string;
    position: LabelPosition;
};

function TabBarIcon({name, color}: {name: string} & TabBarIconProps): JSX.Element {
    return <MaterialIcons size={26} name={name} color={color} />;
}

function TabBarLabel({text, color}: {text: string} & TabBarLabelProps): JSX.Element {
    return <Text style={{color, fontSize: 12}}>{text}</Text>;
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
