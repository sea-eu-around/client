import {NavigationContainer, DefaultTheme, DarkTheme} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import * as React from "react";
import NotFoundScreen from "../screens/NotFoundScreen";
import ValidateEmailScreen from "../screens/ValidateEmailScreen";
import ValidationEmailSentScreen from "../screens/ValidationEmailSentScreen";
import {RootNavigatorScreens} from "../navigation/types";
import LinkingConfiguration from "./linking-config";
import LoginNavigator from "./LoginNavigator";
import MainNavigator from "./MainNavigator";
import OnboardingNavigator from "./OnboardingNavigator";
import {rootNavigationRef} from "./utils";
import {withTheme} from "react-native-elements";
import {ThemeProps} from "../types";

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootNavigatorScreens>();

// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
function Navigation({theme}: ThemeProps): JSX.Element {
    return (
        <NavigationContainer
            ref={rootNavigationRef}
            linking={LinkingConfiguration}
            theme={theme.id === "dark" ? DarkTheme : DefaultTheme}
        >
            <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen name="LoginScreen" component={LoginNavigator} options={{title: "Login"}} />
                <Stack.Screen name="ValidationEmailSentScreen" component={ValidationEmailSentScreen} />
                <Stack.Screen name="MainScreen" component={MainNavigator} />
                <Stack.Screen name="ValidateEmailScreen" component={ValidateEmailScreen} />
                <Stack.Screen name="OnboardingScreen" component={OnboardingNavigator} />
                <Stack.Screen name="NotFoundScreen" component={NotFoundScreen} options={{title: "Oops!"}} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default withTheme(Navigation);
