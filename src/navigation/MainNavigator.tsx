/* eslint-disable react/display-name */
import {MaterialIcons} from "@expo/vector-icons";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {createStackNavigator, StackScreenProps} from "@react-navigation/stack";
import * as React from "react";
import TabNotImplementedScreen from "../screens/TabNotImplementedScreen";
import {
    MainNavigatorTabs,
    RootNavigatorScreens,
    TabMatchingParamList,
    TabNotificationsParamList,
    TabDiscoverParamList,
    TabProfileParamList,
} from "../navigation/types";
import {AppState} from "../state/types";
import themes from "../constants/themes";
import {connect, ConnectedProps} from "react-redux";
import TabProfileScreen from "../screens/TabProfileScreen";
import i18n from "i18n-js";
import TabMatchingScreen, {MatchingHeaderRight} from "../screens/TabMatchingScreen";
import MatchFilteringScreen, {FilteringHeaderBackImage, FilteringHeaderRight} from "../screens/MatchFilteringScreen";
import {withTheme} from "react-native-elements";
import MessagingNavigator from "./MessagingNavigator";
import {Text} from "react-native";
import {LabelPosition} from "@react-navigation/bottom-tabs/lib/typescript/src/types";

const TabNavigator = createBottomTabNavigator<MainNavigatorTabs>();

// Map props from store
const mapStateToProps = (state: AppState) => ({
    theme: themes[state.settings.theme],
});
const reduxConnector = connect(mapStateToProps);

// Component props
export type MainNavigatorProps = ConnectedProps<typeof reduxConnector> &
    StackScreenProps<RootNavigatorScreens, "MainScreen">;

function MainNavigatorComponent({theme}: MainNavigatorProps): JSX.Element {
    return (
        <TabNavigator.Navigator initialRouteName="TabDiscover" tabBarOptions={{activeTintColor: theme.tint}}>
            <TabNavigator.Screen
                name="TabDiscover"
                component={TabDiscoverNavigator}
                options={{
                    tabBarLabel: (props: TabBarLabelProps) => <TabBarLabel text={i18n.t("tabs.discover")} {...props} />,
                    tabBarIcon: (props: TabBarIconProps) => <TabBarIcon name="public" {...props} />,
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

function TabBarIcon({name, color}: {name: string} & TabBarIconProps): JSX.Element {
    return <MaterialIcons size={26} style={{marginTop: 3}} name={name} color={color} />;
}

function TabBarLabel({text, color}: {text: string} & TabBarLabelProps): JSX.Element {
    return <Text style={{color: color, fontSize: 11, marginBottom: 3}}>{text}</Text>;
}

// Each tab has its own navigation stack.
// Read more about this pattern here: https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const TabDiscoverStack = createStackNavigator<TabDiscoverParamList>();

function TabDiscoverNavigator(): JSX.Element {
    return (
        <TabDiscoverStack.Navigator>
            <TabDiscoverStack.Screen
                name="TabDiscoverScreen"
                component={TabNotImplementedScreen}
                options={{headerTitle: "Discover"}}
            />
        </TabDiscoverStack.Navigator>
    );
}

const TabMatchingStack = createStackNavigator<TabMatchingParamList>();

const TabMatchingNavigator = withTheme(
    (): JSX.Element => {
        return (
            <TabMatchingStack.Navigator>
                <TabMatchingStack.Screen
                    name="TabMatchingScreen"
                    component={TabMatchingScreen}
                    options={({navigation}) => ({
                        headerShown: true,
                        headerLeft: () => null,
                        headerStyle: {
                            //backgroundColor: theme.accentSlight,
                        },
                        headerTitle: "Matching",
                        headerTitleStyle: {
                            letterSpacing: 0.5,
                            paddingLeft: 10,
                        },
                        headerTitleAlign: "left",
                        // eslint-disable-next-line react/display-name
                        headerRight: () => <MatchingHeaderRight navigation={navigation} />,
                    })}
                />
                <TabMatchingStack.Screen
                    name="MatchFilteringScreen"
                    component={MatchFilteringScreen}
                    options={{
                        headerShown: true,
                        headerTitle: "Filters",
                        headerTitleAlign: "center",
                        headerBackImage: FilteringHeaderBackImage,
                        headerRight: FilteringHeaderRight,
                    }}
                />
            </TabMatchingStack.Navigator>
        );
    },
);

const TabNotificationsStack = createStackNavigator<TabNotificationsParamList>();

function TabNotificationsNavigator(): JSX.Element {
    return (
        <TabNotificationsStack.Navigator>
            <TabNotificationsStack.Screen
                name="TabNotificationsScreen"
                component={TabNotImplementedScreen}
                options={{headerTitle: "Tab Title"}}
            />
        </TabNotificationsStack.Navigator>
    );
}

const TabProfileStack = createStackNavigator<TabProfileParamList>();

function TabProfileNavigator(): JSX.Element {
    return (
        <TabProfileStack.Navigator>
            <TabProfileStack.Screen
                name="TabProfileScreen"
                component={TabProfileScreen}
                options={{/*headerTitle: "Profile"*/ headerShown: false}}
            />
        </TabProfileStack.Navigator>
    );
}

export default reduxConnector(MainNavigatorComponent);
