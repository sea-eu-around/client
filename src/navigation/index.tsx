import {NavigationContainer, DefaultTheme, DarkTheme} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import * as React from "react";
import {ColorSchemeName} from "react-native";

import NotFoundScreen from "../screens/NotFoundScreen";
import {RootNavigatorScreens} from "../types";
import BottomTabNavigator from "./BottomTabNavigator";
import LinkingConfiguration from "./LinkingConfiguration";
import LoginNavigator from "./LoginNavigator";

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootNavigatorScreens>();

// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
export default function Navigation({colorScheme}: {colorScheme: ColorSchemeName}): JSX.Element {
    return (
        <NavigationContainer linking={LinkingConfiguration} theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
            <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen name="LoginScreen" component={LoginNavigator} options={{title: "Login"}} />
                <Stack.Screen name="RootScreen" component={BottomTabNavigator} />
                <Stack.Screen name="NotFoundScreen" component={NotFoundScreen} options={{title: "Oops!"}} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
