/* eslint-disable react/display-name */
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
import ProfileScreen from "../screens/ProfileScreen";
import SimpleScreenHeader from "../components/headers/SimpleScreenHeader";
import {CHAT_CONNECTED_ROUTES} from "../constants/config";
import {MyThunkDispatch} from "../state/types";
import {connectToChat, disconnectFromChat} from "../state/messaging/actions";
import store from "../state/store";
import MainHeader from "../components/headers/MainHeader";

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootNavigatorScreens>();

let consumedInitialRoute = false;
let previousRoute: string | undefined = undefined;

// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
function Navigation({theme, initialRoute}: ThemeProps & {initialRoute?: keyof RootNavigatorScreens}): JSX.Element {
    // Ensure we do not go back to the initial route when the navigation container updates (e.g. on theme change)
    const initialRouteName = consumedInitialRoute ? undefined : initialRoute;
    consumedInitialRoute = true;

    return (
        <NavigationContainer
            ref={rootNavigationRef}
            linking={LinkingConfiguration}
            theme={theme.id === "dark" ? DarkTheme : DefaultTheme}
            onReady={() => (previousRoute = rootNavigationRef.current?.getCurrentRoute()?.name)}
            onStateChange={() => {
                if (rootNavigationRef.current) {
                    const currentRoute = rootNavigationRef.current.getCurrentRoute()?.name;
                    const fromChat = CHAT_CONNECTED_ROUTES.find((r) => r === previousRoute);
                    const toChat = CHAT_CONNECTED_ROUTES.find((r) => r === currentRoute);
                    if (!fromChat && toChat) (store.dispatch as MyThunkDispatch)(connectToChat());
                    if (fromChat && !toChat) (store.dispatch as MyThunkDispatch)(disconnectFromChat());
                    previousRoute = currentRoute;
                }
            }}
        >
            <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName={initialRouteName}>
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
                    options={{header: ChatScreenHeader, headerShown: true, title: screenTitle("ChatScreen")}}
                />
                <Stack.Screen
                    name="MyProfileScreen"
                    component={MyProfileScreen}
                    options={{
                        headerShown: true,
                        title: screenTitle("MyProfileScreen"),
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
                <Stack.Screen
                    name="ProfileScreen"
                    component={ProfileScreen}
                    options={{
                        headerShown: true,
                        title: screenTitle("ProfileScreen"),
                        header: (props: StackHeaderProps) => <MainHeader {...props} backButton={true} />,
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
