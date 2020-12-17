/* eslint-disable react/display-name */
import * as React from "react";
import {createStackNavigator, StackHeaderProps} from "@react-navigation/stack";
import {TabMatchingRoot} from "./types";
import TabMatchingScreen from "../screens/TabMatchingScreen";
import {screenTitle} from "./utils";
import MatchScreenHeader from "../components/headers/MatchScreenHeader";
import MatchFilteringScreen from "../screens/MatchFilteringScreen";
import FilteringScreenHeader from "../components/headers/FilteringScreenHeader";
import MatchHistoryScreen from "../screens/MatchHistoryScreen";

const TabMatchingStack = createStackNavigator<TabMatchingRoot>();

export const TabMatchingNavigator = (): JSX.Element => (
    <TabMatchingStack.Navigator>
        <TabMatchingStack.Screen
            name="TabMatchingScreen"
            component={TabMatchingScreen}
            options={() => ({
                headerShown: true,
                title: screenTitle("TabMatchingScreen"),
                header: MatchScreenHeader,
            })}
        />
        <TabMatchingStack.Screen
            name="MatchFilteringScreen"
            component={MatchFilteringScreen}
            options={{
                headerShown: true,
                title: screenTitle("MatchFilteringScreen"),
                header: FilteringScreenHeader,
            }}
        />
        <TabMatchingStack.Screen
            name="MatchHistoryScreen"
            component={MatchHistoryScreen}
            options={{
                headerShown: true,
                title: screenTitle("MatchHistoryScreen"),
                header: (props: StackHeaderProps) => <MatchScreenHeader backButton={true} {...props} />,
            }}
        />
    </TabMatchingStack.Navigator>
);
