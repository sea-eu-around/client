import {MaterialIcons} from "@expo/vector-icons";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {createStackNavigator, StackScreenProps} from "@react-navigation/stack";
import * as React from "react";
import TabOneScreen from "../screens/TabOneScreen";
import TabTwoScreen from "../screens/TabTwoScreen";
import {TabOneParamList, TabTwoParamList, MainNavigatorTabs, RootNavigatorScreens} from "../types";
import {AppState} from "../state/types";
import themes from "../constants/themes";
import {connect, ConnectedProps} from "react-redux";

const TabNavigator = createBottomTabNavigator<MainNavigatorTabs>();

// Map props from store
const mapStateToProps = (state: AppState) => ({
    theme: themes[state.theming.theme],
});
const reduxConnector = connect(mapStateToProps);

// Component props
export type MainNavigatorProps = ConnectedProps<typeof reduxConnector> &
    StackScreenProps<RootNavigatorScreens, "MainScreen">;

function MainNavigatorComponent({theme}: MainNavigatorProps): JSX.Element {
    return (
        <TabNavigator.Navigator initialRouteName="TabOne" tabBarOptions={{activeTintColor: theme.tint}}>
            <TabNavigator.Screen
                name="TabOne"
                component={TabOneNavigator}
                options={{
                    // eslint-disable-next-line react/display-name, react/prop-types
                    tabBarIcon: ({color}) => <TabBarIcon name="person" color={color} />,
                }}
            />
            <TabNavigator.Screen
                name="TabTwo"
                component={TabTwoNavigator}
                options={{
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
const TabOneStack = createStackNavigator<TabOneParamList>();

function TabOneNavigator(): JSX.Element {
    return (
        <TabOneStack.Navigator>
            <TabOneStack.Screen name="TabOneScreen" component={TabOneScreen} options={{headerTitle: "Tab One Title"}} />
        </TabOneStack.Navigator>
    );
}

const TabTwoStack = createStackNavigator<TabTwoParamList>();

function TabTwoNavigator(): JSX.Element {
    return (
        <TabTwoStack.Navigator>
            <TabTwoStack.Screen name="TabTwoScreen" component={TabTwoScreen} options={{headerTitle: "Tab Two Title"}} />
        </TabTwoStack.Navigator>
    );
}

export default reduxConnector(MainNavigatorComponent);
