/* eslint-disable react/display-name */
import {NavigationContainer, DefaultTheme, DarkTheme, NavigationState} from "@react-navigation/native";
import {createStackNavigator, StackHeaderProps} from "@react-navigation/stack";
import * as React from "react";
import NotFoundScreen from "../screens/NotFoundScreen";
import ValidateEmailScreen from "../screens/ValidateEmailScreen";
import ValidationEmailSentScreen from "../screens/ValidationEmailSentScreen";
import {NavigatorRoute, RootNavigatorScreens} from "../navigation/types";
import LinkingConfiguration from "./linking-config";
import LoginNavigator from "./LoginNavigator";
import MainNavigator from "./MainNavigator";
import OnboardingNavigator from "./OnboardingNavigator";
import {rootNavigationRef, screenTitle, unauthorizedRedirect} from "./utils";
import {withTheme} from "react-native-elements";
import {ThemeProps} from "../types";
import OnboardingSuccessfulScreen from "../screens/onboarding/OnboardingSuccessfulScreen";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";
import ForgotPasswordEmailSentScreen from "../screens/ForgotPasswordEmailSentScreen";
import ResetPasswordSuccessScreen from "../screens/ResetPasswordSuccessScreen";
import MyProfileScreen from "../screens/MyProfileScreen";
import ProfileScreen from "../screens/ProfileScreen";
import {AUTHENTICATED_ROUTES} from "../constants/route-settings";
import store from "../state/store";
import MainHeader from "../components/headers/MainHeader";
import SettingsScreen from "../screens/SettingsScreen";
import DeleteAccountSuccessScreen from "../screens/DeleteAccountSuccessScreen";
import DeleteAccountScreen from "../screens/DeleteAccountScreen";
import {handleRouteChangeForChat} from "./MessagingNavigator";
import {DEBUG_FORCE_INITIAL_ROUTE, DEBUG_MODE} from "../constants/config";
import {BackHandler} from "react-native";
import BackendUnreachableScreen from "../screens/BackendUnreachableScreen";
import ResendVerifyEmailScreen from "../screens/ResendVerifyEmailScreen";
import themes from "../constants/themes";

type RootNavigationProps = React.PropsWithRef<ThemeProps & {initialRoute?: keyof RootNavigatorScreens}> & {
    onReady?: () => void;
};

// The root stack navigator
const Stack = createStackNavigator<RootNavigatorScreens>();

let consumedInitialRoute = false;
let previousRoute: NavigatorRoute | undefined = undefined;
let prePreviousRoute: NavigatorRoute | undefined = undefined;
let savedNavigationState: NavigationState | undefined = undefined;

// Handle route changes
function onStateChange(state: NavigationState | undefined) {
    if (state) savedNavigationState = state;
    const route = rootNavigationRef.current?.getCurrentRoute()?.name as NavigatorRoute | undefined;
    if (route) {
        // Handle redirecting when not authenticated
        if (!DEBUG_MODE) {
            if (!store.getState().auth.authenticated && AUTHENTICATED_ROUTES.includes(route)) unauthorizedRedirect();
        }

        handleRouteChangeForChat(route, previousRoute);

        prePreviousRoute = previousRoute;
        previousRoute = route;
    }
}

function Navigation({theme, initialRoute, onReady}: RootNavigationProps): JSX.Element {
    // Ensure we do not go back to the initial route when the navigation container updates (e.g. on theme change)
    let initialRouteName = consumedInitialRoute ? (previousRoute as keyof RootNavigatorScreens) : initialRoute;
    consumedInitialRoute = true;

    if (DEBUG_MODE && DEBUG_FORCE_INITIAL_ROUTE !== undefined)
        initialRouteName = DEBUG_FORCE_INITIAL_ROUTE as keyof RootNavigatorScreens;

    const reactNavigationTheme = {
        dark: theme.id === "dark",
        colors: {
            ...(theme.id === "dark" ? DarkTheme : DefaultTheme).colors,
            background: theme.background,
        },
    };

    return (
        <NavigationContainer
            ref={rootNavigationRef}
            initialState={savedNavigationState}
            linking={LinkingConfiguration}
            theme={reactNavigationTheme}
            onReady={() => {
                onStateChange(undefined);
                // Prevent going back to a screen where the user shouldn't go
                BackHandler.addEventListener("hardwareBackPress", () => {
                    if (prePreviousRoute) {
                        const toAuthRoute = AUTHENTICATED_ROUTES.indexOf(prePreviousRoute) !== -1;
                        const authenticated = store.getState().auth.authenticated;
                        if (toAuthRoute && !authenticated) return true;
                        if (!toAuthRoute && authenticated) return true;
                    }
                    return false;
                });
                if (onReady) onReady();
            }}
            onStateChange={onStateChange}
        >
            <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName={initialRouteName}>
                <Stack.Screen name="LoginRoot" component={LoginNavigator} />
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
                    name="MyProfileScreen"
                    component={MyProfileScreen}
                    options={{
                        headerShown: true,
                        title: screenTitle("MyProfileScreen"),
                        header: (props: StackHeaderProps) => (
                            <MainHeader
                                {...props}
                                backButton={true}
                                noAvatar={true}
                                noShadow={true}
                                buttonBackgroundColor={theme.accent}
                                wrapperStyle={{backgroundColor: theme.accent}}
                                color={themes.dark.text}
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
                        header: (props: StackHeaderProps) => (
                            <MainHeader
                                {...props}
                                backButton={true}
                                noShadow={true}
                                buttonBackgroundColor={theme.accent}
                                wrapperStyle={{backgroundColor: theme.accent}}
                                color={themes.dark.text}
                            />
                        ),
                    }}
                />
                <Stack.Screen
                    name="SettingsScreen"
                    component={SettingsScreen}
                    options={{
                        headerShown: true,
                        title: screenTitle("SettingsScreen"),
                        header: (props: StackHeaderProps) => (
                            <MainHeader {...props} backButton={true} noSettingsButton={true} />
                        ),
                    }}
                />
                <Stack.Screen
                    name="DeleteAccountScreen"
                    component={DeleteAccountScreen}
                    options={{
                        headerShown: true,
                        title: screenTitle("DeleteAccountScreen"),
                        header: (props: StackHeaderProps) => <MainHeader {...props} backButton={true} />,
                    }}
                />
                <Stack.Screen
                    name="DeleteAccountSuccessScreen"
                    component={DeleteAccountSuccessScreen}
                    options={{title: screenTitle("DeleteAccountSuccessScreen")}}
                />
                <Stack.Screen name="OnboardingScreen" component={OnboardingNavigator} />
                <Stack.Screen
                    name="OnboardingSuccessfulScreen"
                    component={OnboardingSuccessfulScreen}
                    options={{title: screenTitle("OnboardingSuccessfulScreen")}}
                />
                <Stack.Screen
                    name="BackendUnreachableScreen"
                    component={BackendUnreachableScreen}
                    options={{title: screenTitle("BackendUnreachableScreen")}}
                />
                <Stack.Screen
                    name="ResendVerifyEmailScreen"
                    component={ResendVerifyEmailScreen}
                    options={{title: screenTitle("ResendVerifyEmailScreen")}}
                />
                <Stack.Screen
                    name="NotFoundScreen"
                    component={NotFoundScreen}
                    options={{title: screenTitle("NotFoundScreen")}}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default withTheme(Navigation);
