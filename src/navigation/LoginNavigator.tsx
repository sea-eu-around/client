/* eslint-disable react/display-name */
import * as React from "react";
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import SignupScreen, {LoginScreen, ForgotPasswordScreen} from "../screens/TabLoginScreen";
import {TabLoginRoot, TabLoginSigninScreens} from "./types";
import {screenTitle} from "./utils";
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginHeader from "../components/headers/LoginHeader";
import DebugMenu from "../components/DebugMenu";
import {DEBUG_MODE} from "../constants/config";
import VersionInfo from "../components/VersionInfo";
import FloatingThemeToggle from "../components/FloatingThemeToggle";

const SigninRoot = createMaterialTopTabNavigator<TabLoginSigninScreens>();
const Tab = createMaterialTopTabNavigator<TabLoginRoot>();

const LoginNavigator = (): JSX.Element => (
    <Tab.Navigator swipeEnabled={false} tabBar={() => <></>}>
        <Tab.Screen name="WelcomeScreen" component={WelcomeScreen} options={{title: screenTitle("WelcomeScreen")}} />
        <Tab.Screen name="SigninScreen">
            {() => (
                <>
                    <LoginHeader />
                    <SigninRoot.Navigator tabBar={() => <></>} initialRouteName="LoginScreen" swipeEnabled={false}>
                        <SigninRoot.Screen
                            name="ForgotPasswordScreen"
                            component={ForgotPasswordScreen}
                            options={{
                                title: screenTitle("ForgotPasswordScreen"),
                            }}
                        />
                        <SigninRoot.Screen
                            name="LoginScreen"
                            component={LoginScreen}
                            options={{title: screenTitle("LoginScreen")}}
                        />
                        <SigninRoot.Screen
                            name="SignupScreen"
                            component={SignupScreen}
                            options={{title: screenTitle("SignupScreen")}}
                        />
                    </SigninRoot.Navigator>

                    <VersionInfo />
                    <FloatingThemeToggle />
                    {DEBUG_MODE && <DebugMenu />}
                </>
            )}
        </Tab.Screen>
    </Tab.Navigator>
);

export default LoginNavigator;
