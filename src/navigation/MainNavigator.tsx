/* eslint-disable react/display-name */
import {MaterialIcons} from "@expo/vector-icons";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {createStackNavigator, StackHeaderLeftButtonProps, StackScreenProps} from "@react-navigation/stack";
import * as React from "react";
import TabNotImplementedScreen from "../screens/TabNotImplementedScreen";
import {
    MainNavigatorTabs,
    RootNavigatorScreens,
    TabHomeRoot,
    TabMatchingRoot,
    TabNotificationsRoot,
    TabProfileRoot,
} from "../navigation/types";
import TabProfileScreen from "../screens/TabProfileScreen";
import i18n from "i18n-js";
import TabMatchingScreen, {MatchingHeaderRight} from "../screens/TabMatchingScreen";
import MatchFilteringScreen, {FilteringHeaderLeft, FilteringHeaderRight} from "../screens/MatchFilteringScreen";
import {withTheme} from "react-native-elements";
import MessagingNavigator from "./MessagingNavigator";
import {Text} from "react-native";
import {LabelPosition} from "@react-navigation/bottom-tabs/lib/typescript/src/types";
import {ThemeProps} from "../types";
import TabHomeScreen from "../screens/TabHomeScreen";
import {screenTitle} from "./utils";

const TabNavigator = createBottomTabNavigator<MainNavigatorTabs>();

// Component props
export type MainNavigatorProps = ThemeProps & StackScreenProps<RootNavigatorScreens, "MainScreen">;

function MainNavigatorComponent({theme}: MainNavigatorProps): JSX.Element {
    return (
        <TabNavigator.Navigator
            initialRouteName="TabHome"
            tabBarOptions={{
                activeTintColor: theme.tint,
                style: {height: 55, paddingTop: 5, paddingBottom: 5},
                tabStyle: {flexDirection: "column"},
                iconStyle: {flex: 1},
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
                name="TabProfile"
                component={TabProfileNavigator}
                options={{
                    tabBarLabel: (props: TabBarLabelProps) => <TabBarLabel text={i18n.t("tabs.profile")} {...props} />,
                    tabBarIcon: (props: TabBarIconProps) => <TabBarIcon name="person" {...props} />,
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

// TODO move
function TabBarIcon({name, color}: {name: string} & TabBarIconProps): JSX.Element {
    return <MaterialIcons size={26} name={name} color={color} />;
}

function TabBarLabel({text, color}: {text: string} & TabBarLabelProps): JSX.Element {
    return <Text style={{color, fontSize: 12}}>{text}</Text>;
}

const TabHomeStack = createStackNavigator<TabHomeRoot>();

const TabHomeNavigator = (): JSX.Element => (
    <TabHomeStack.Navigator>
        <TabHomeStack.Screen
            name="TabHomeScreen"
            component={TabHomeScreen}
            options={{headerShown: false, title: screenTitle("TabHomeScreen")}}
        />
    </TabHomeStack.Navigator>
);

const TabMatchingStack = createStackNavigator<TabMatchingRoot>();

const TabMatchingNavigator = withTheme(
    (): JSX.Element => (
        <TabMatchingStack.Navigator>
            <TabMatchingStack.Screen
                name="TabMatchingScreen"
                component={TabMatchingScreen}
                options={({navigation}) => ({
                    headerShown: true,
                    headerLeft: () => <></>,
                    headerTitle: "Matching",
                    headerTitleStyle: {
                        letterSpacing: 0.5,
                        paddingLeft: 10,
                    },
                    headerTitleAlign: "left",
                    // eslint-disable-next-line react/display-name
                    headerRight: () => <MatchingHeaderRight navigation={navigation} />,
                    title: screenTitle("TabMatchingScreen"),
                })}
            />
            <TabMatchingStack.Screen
                name="MatchFilteringScreen"
                component={MatchFilteringScreen}
                options={{
                    headerShown: true,
                    headerTitle: "Filters",
                    headerTitleAlign: "center",
                    headerLeft: (props: StackHeaderLeftButtonProps) => <FilteringHeaderLeft {...props} />,
                    headerRight: () => <FilteringHeaderRight />,
                    title: screenTitle("MatchFilteringScreen"),
                }}
            />
        </TabMatchingStack.Navigator>
    ),
);

const TabNotificationsStack = createStackNavigator<TabNotificationsRoot>();

const TabNotificationsNavigator = (): JSX.Element => (
    <TabNotificationsStack.Navigator>
        <TabNotificationsStack.Screen
            name="TabNotificationsScreen"
            component={TabNotImplementedScreen}
            options={{headerShown: false, title: screenTitle("TabNotificationsScreen")}}
        />
    </TabNotificationsStack.Navigator>
);

const TabProfileStack = createStackNavigator<TabProfileRoot>();

const TabProfileNavigator = (): JSX.Element => (
    <TabProfileStack.Navigator>
        <TabProfileStack.Screen
            name="TabProfileScreen"
            component={TabProfileScreen}
            options={{headerShown: false, title: screenTitle("TabProfileScreen")}}
        />
    </TabProfileStack.Navigator>
);

export default withTheme(MainNavigatorComponent);
