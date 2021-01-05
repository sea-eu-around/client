/* eslint-disable react/display-name */
import * as React from "react";
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import {SigninScreen, SignupScreen, ForgotPasswordScreen} from "../screens/TabLoginScreen";
import {LoginRoot, LoginScreens} from "./types";
import {screenTitle} from "./utils";
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginHeader from "../components/headers/LoginHeader";
import DebugMenu from "../components/DebugMenu";
import {DEBUG_MODE} from "../constants/config";
import VersionInfo from "../components/VersionInfo";
import FloatingThemeToggle from "../components/FloatingThemeToggle";

const SigninRoot = createMaterialTopTabNavigator<LoginScreens>();
const Tab = createMaterialTopTabNavigator<LoginRoot>();

const LoginNavigator = (): JSX.Element => (
    <Tab.Navigator swipeEnabled={false} tabBar={() => <></>}>
        <Tab.Screen name="WelcomeScreen" component={WelcomeScreen} options={{title: screenTitle("WelcomeScreen")}} />
        <Tab.Screen name="LoginScreens">
            {() => (
                <>
                    <LoginHeader />
                    <SigninRoot.Navigator tabBar={() => <></>} initialRouteName="SigninScreen" swipeEnabled={false}>
                        <SigninRoot.Screen
                            name="ForgotPasswordScreen"
                            component={ForgotPasswordScreen}
                            options={{
                                title: screenTitle("ForgotPasswordScreen"),
                            }}
                        />
                        <SigninRoot.Screen
                            name="SigninScreen"
                            component={SigninScreen}
                            options={{title: screenTitle("SigninScreen")}}
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
