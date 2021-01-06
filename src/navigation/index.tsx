/* eslint-disable react/display-name */
import {NavigationContainer, DefaultTheme, DarkTheme, NavigationState} from "@react-navigation/native";
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
import MyProfileScreen from "../screens/MyProfileScreen";
import ProfileScreen from "../screens/ProfileScreen";
import {CHAT_CONNECTED_ROUTES} from "../constants/config";
import {MyThunkDispatch} from "../state/types";
import {connectToChat, disconnectFromChat} from "../state/messaging/actions";
import store from "../state/store";
import MainHeader from "../components/headers/MainHeader";
import SettingsScreen from "../screens/SettingsScreen";
import DeleteAccountSuccessScreen from "../screens/DeleteAccountSuccessScreen";
import DeleteAccountScreen from "../screens/DeleteAccountScreen";

type RootNavigationProps = React.PropsWithRef<ThemeProps & {initialRoute?: keyof RootNavigatorScreens}> & {
    onReady?: () => void;
};

// The root stack navigator
const Stack = createStackNavigator<RootNavigatorScreens>();

let consumedInitialRoute = false;
let previousRoute: string | undefined = undefined;
let savedNavigationState: NavigationState | undefined = undefined;

// Handle route changes
function onStateChange(state: NavigationState | undefined) {
    if (state) savedNavigationState = state;
    const route = rootNavigationRef.current?.getCurrentRoute();
    if (route) {
        // Handle connecting / disconnecting from the chat depending on the focused route
        const toChat = CHAT_CONNECTED_ROUTES.find((r) => r === route.name);
        const fromChat = previousRoute && CHAT_CONNECTED_ROUTES.find((r) => r === previousRoute);
        if (!fromChat && toChat) (store.dispatch as MyThunkDispatch)(connectToChat());
        if (fromChat && !toChat) (store.dispatch as MyThunkDispatch)(disconnectFromChat());

        previousRoute = route.name;
    }
}

function Navigation({theme, initialRoute, onReady}: RootNavigationProps): JSX.Element {
    // Ensure we do not go back to the initial route when the navigation container updates (e.g. on theme change)
    const initialRouteName = consumedInitialRoute ? (previousRoute as keyof RootNavigatorScreens) : initialRoute;
    consumedInitialRoute = true;

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
                        header: (props: StackHeaderProps) => (
                            <MainHeader
                                {...props}
                                backButton={true}
                                noShadow={true}
                                buttonBackgroundColor={theme.accent}
                                wrapperStyle={{backgroundColor: theme.accent}}
                                color={theme.textWhite}
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
