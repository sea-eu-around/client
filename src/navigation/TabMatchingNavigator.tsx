/* eslint-disable react/display-name */
import * as React from "react";
import {CardStyleInterpolators, createStackNavigator, StackHeaderProps} from "@react-navigation/stack";
import {TabMatchingRoot} from "./types";
import TabMatchingScreen from "../screens/TabMatchingScreen";
import {screenTitle} from "./utils";
import MatchScreenHeader from "../components/headers/MatchScreenHeader";
import MatchFilteringScreen from "../screens/MatchFilteringScreen";
import FilteringScreenHeader from "../components/headers/FilteringScreenHeader";
import MatchHistoryScreen from "../screens/MatchHistoryScreen";
import MainHeader from "../components/headers/MainHeader";
import MatchSuccessScreen from "../screens/MatchSuccessScreen";
import {Platform} from "react-native";

const TabMatchingStack = createStackNavigator<TabMatchingRoot>();

export const TabMatchingNavigator = (): JSX.Element => (
    <TabMatchingStack.Navigator>
        <TabMatchingStack.Screen
            name="TabMatchingScreen"
            options={() => ({
                headerShown: false,
                title: screenTitle("TabMatchingScreen"),
            })}
        >
            {(props) => (
                <>
                    <TabMatchingScreen {...props} />
                    <MatchScreenHeader blur={true} {...props} />
                </>
            )}
        </TabMatchingStack.Screen>
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
                header: (props: StackHeaderProps) => <MainHeader backButton={true} {...props} />,
            }}
        />
        <TabMatchingStack.Screen
            name="MatchSuccessScreen"
            component={MatchSuccessScreen}
            options={{
                headerShown: false,
                cardStyleInterpolator:
                    Platform.OS == "ios"
                        ? CardStyleInterpolators.forVerticalIOS
                        : CardStyleInterpolators.forFadeFromBottomAndroid,
                title: screenTitle("MatchSuccessScreen"),
            }}
        />
    </TabMatchingStack.Navigator>
);
