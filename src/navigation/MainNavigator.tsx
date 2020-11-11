import {FontAwesome, MaterialIcons} from "@expo/vector-icons";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {createStackNavigator, StackNavigationProp, StackScreenProps} from "@react-navigation/stack";
import * as React from "react";
import TabNotImplementedScreen from "../screens/TabNotImplementedScreen";
import {
    MainNavigatorTabs,
    RootNavigatorScreens,
    TabMessagingParamList,
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
import TabMatchingScreen from "../screens/TabMatchingScreen";
import MatchFilteringScreen from "../screens/MatchFilteringScreen";
import {Text, TouchableOpacity, View} from "react-native";
import store from "../state/store";
import {resetMatchingFilters} from "../state/matching/actions";

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
                    title: i18n.t("tabs.discover"),
                    // eslint-disable-next-line react/display-name, react/prop-types
                    tabBarIcon: ({color}) => <TabBarIcon name="contacts" color={color} />,
                }}
            />
            <TabNavigator.Screen
                name="TabMatching"
                component={TabMatchingNavigator}
                options={{
                    title: i18n.t("tabs.matching"),
                    // eslint-disable-next-line react/display-name, react/prop-types
                    tabBarIcon: ({color}) => <TabBarIcon name="notifications" color={color} />,
                }}
            />
            <TabNavigator.Screen
                name="TabMessaging"
                component={TabMessagingNavigator}
                options={{
                    title: i18n.t("tabs.messaging"),
                    // eslint-disable-next-line react/display-name, react/prop-types
                    tabBarIcon: ({color}) => <TabBarIcon name="notifications" color={color} />,
                }}
            />
            <TabNavigator.Screen
                name="TabProfile"
                component={TabProfileNavigator}
                options={{
                    title: i18n.t("tabs.profile"),
                    // eslint-disable-next-line react/display-name, react/prop-types
                    tabBarIcon: ({color}) => <TabBarIcon name="person" color={color} />,
                }}
            />
            <TabNavigator.Screen
                name="TabNotifications"
                component={TabNotificationsNavigator}
                options={{
                    title: i18n.t("tabs.notifications"),
                    // eslint-disable-next-line react/display-name, react/prop-types
                    tabBarIcon: ({color}) => <TabBarIcon name="notifications" color={color} />,
                }}
            />
        </TabNavigator.Navigator>
    );
}

function TabBarIcon(props: {name: string; color: string}): JSX.Element {
    return <MaterialIcons size={26} style={{marginBottom: -3}} {...props} />;
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

function TabMatchingNavigator(): JSX.Element {
    const filteringHeaderBackImage = (): JSX.Element => {
        return <MaterialIcons name="close" size={32} />;
    };
    const filteringHeaderReset = (): JSX.Element => {
        //return <MaterialIcons name="refresh" size={32} style={{paddingRight: 10}} />;
        return (
            <TouchableOpacity
                style={{marginRight: 16, padding: 10}}
                onPress={() => store.dispatch(resetMatchingFilters())}
            >
                <Text>reset</Text>
            </TouchableOpacity>
        );
    };
    const matchingHeaderRight = (
        navigation: StackNavigationProp<TabMatchingParamList, "TabMatchingScreen">,
    ) => (): JSX.Element => {
        return (
            <View style={{flexDirection: "row", paddingRight: 10}}>
                <TouchableOpacity>
                    <MaterialIcons name="refresh" size={32} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate("MatchFilteringScreen");
                    }}
                >
                    <FontAwesome name="sliders" size={30} style={{paddingHorizontal: 5}} />
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <TabMatchingStack.Navigator>
            <TabMatchingStack.Screen
                name="TabMatchingScreen"
                component={TabMatchingScreen}
                options={({navigation}) => ({
                    headerShown: true,
                    headerLeft: () => null,
                    headerTitle: "Matching",
                    headerTitleAlign: "center",
                    headerRight: matchingHeaderRight(navigation),
                })}
            />
            <TabMatchingStack.Screen
                name="MatchFilteringScreen"
                component={MatchFilteringScreen}
                options={{
                    headerShown: true,
                    headerTitle: "Filters",
                    headerTitleAlign: "center",
                    headerBackImage: filteringHeaderBackImage,
                    headerRight: filteringHeaderReset,
                }}
            />
        </TabMatchingStack.Navigator>
    );
}

const TabMessagingStack = createStackNavigator<TabMessagingParamList>();

function TabMessagingNavigator(): JSX.Element {
    return (
        <TabMessagingStack.Navigator>
            <TabMessagingStack.Screen
                name="TabMessagingScreen"
                component={TabNotImplementedScreen}
                options={{headerTitle: "Tab Title"}}
            />
        </TabMessagingStack.Navigator>
    );
}

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
