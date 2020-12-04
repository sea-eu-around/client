import {NavigationContainer, DefaultTheme, DarkTheme} from "@react-navigation/native";
import {CardStyleInterpolators, createStackNavigator, StackHeaderProps} from "@react-navigation/stack";
import * as React from "react";
import NotFoundScreen from "../screens/NotFoundScreen";
import ValidateEmailScreen from "../screens/ValidateEmailScreen";
import ValidationEmailSentScreen from "../screens/ValidationEmailSentScreen";
import {RootNavigatorScreens} from "../navigation/types";
import LinkingConfiguration from "./linking-config";
import LoginNavigator from "./LoginNavigator";
import MainNavigator from "./MainNavigator";
import OnboardingNavigator from "./OnboardingNavigator";
import {rootNavigationRef, screenTitle} from "./utils";
import {withTheme} from "react-native-elements";
import {ThemeProps} from "../types";
import OnboardingSuccessfulScreen from "../screens/onboarding/OnboardingSuccessfulScreen";
import MatchSuccessScreen from "../screens/MatchSuccessScreen";
import {Platform} from "react-native";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";
import ForgotPasswordEmailSentScreen from "../screens/ForgotPasswordEmailSentScreen";
import ResetPasswordSuccessScreen from "../screens/ResetPasswordSuccessScreen";
import ChatScreen from "../screens/messaging/ChatScreen";
import ChatScreenHeader from "../components/headers/ChatScreenHeader";
import MyProfileScreen from "../screens/MyProfileScreen";
import SimpleScreenHeader from "../components/headers/SimpleScreenHeader";

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootNavigatorScreens>();

// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
function Navigation({theme, initialRoute}: ThemeProps & {initialRoute?: keyof RootNavigatorScreens}): JSX.Element {
    return (
        <NavigationContainer
            ref={rootNavigationRef}
            linking={LinkingConfiguration}
            theme={theme.id === "dark" ? DarkTheme : DefaultTheme}
        >
            <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName={initialRoute}>
                <Stack.Screen name="LoginScreen" component={LoginNavigator} />
                <Stack.Screen
                    name="ForgotPasswordEmailSentScreen"
                    component={ForgotPasswordEmailSentScreen}
                    options={{title: screenTitle("ForgotPasswordEmailSentScreen")}}
                />
                <Stack.Screen
                    name="ValidationEmailSentScreen"
                    component={ValidationEmailSentScreen}
                    options={{title: screenTitle("ValidationEmailSentScreen")}}
                />
                <Stack.Screen
                    name="ValidateEmailScreen"
                    component={ValidateEmailScreen}
                    options={{title: screenTitle("ValidateEmailScreen")}}
                />
                <Stack.Screen
                    name="ResetPasswordScreen"
                    component={ResetPasswordScreen}
                    options={{title: screenTitle("ResetPasswordScreen")}}
                />
                <Stack.Screen
                    name="ResetPasswordSuccessScreen"
                    component={ResetPasswordSuccessScreen}
                    options={{title: screenTitle("ResetPasswordSuccessScreen")}}
                />
                <Stack.Screen name="MainScreen" component={MainNavigator} />
                <Stack.Screen
                    name="ChatScreen"
                    component={ChatScreen}
                    options={{header: ChatScreenHeader, headerShown: true}}
                />
                <Stack.Screen
                    name="MyProfileScreen"
                    component={MyProfileScreen}
                    options={{
                        headerShown: true,
                        title: screenTitle("MyProfileScreen"),
                        // eslint-disable-next-line react/display-name
                        header: (props: StackHeaderProps) => (
                            <SimpleScreenHeader
                                {...props}
                                noShadow={true}
                                wrapperStyle={{backgroundColor: theme.accent}}
                                color={theme.textWhite}
                            />
                        ),
                    }}
                />
                <Stack.Screen name="OnboardingScreen" component={OnboardingNavigator} />
                <Stack.Screen
                    name="OnboardingSuccessfulScreen"
                    component={OnboardingSuccessfulScreen}
                    options={{title: screenTitle("OnboardingSuccessfulScreen")}}
                />
                <Stack.Screen
                    name="NotFoundScreen"
                    component={NotFoundScreen}
                    options={{title: screenTitle("NotFoundScreen")}}
                />
                <Stack.Screen
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
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default withTheme(Navigation);
