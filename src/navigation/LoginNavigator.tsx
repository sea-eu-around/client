/* eslint-disable react/display-name */
import {createStackNavigator} from "@react-navigation/stack";
import * as React from "react";
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import {LoginScreen, ForgotPasswordScreen} from "../screens/TabLoginScreen";
import TabSignupFormScreen from "../screens/TabSignupFormScreen";
import {TabLoginRoot, TabLoginSigninScreens} from "./types";
import {screenTitle} from "./utils";
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginHeader from "../components/headers/LoginHeader";

const SigninStack = createStackNavigator<TabLoginSigninScreens>();
const Tab = createMaterialTopTabNavigator<TabLoginRoot>();

const LoginNavigator = (): JSX.Element => (
    <Tab.Navigator swipeEnabled={false} tabBar={() => <></>} /*tabBar={(props) => <LoginTabBar {...props} />}*/>
        <Tab.Screen name="WelcomeScreen" component={WelcomeScreen} options={{title: screenTitle("WelcomeScreen")}} />
        <Tab.Screen name="SigninScreen">
            {() => (
                <SigninStack.Navigator headerMode="float">
                    <SigninStack.Screen
                        name="LoginScreen"
                        component={LoginScreen}
                        options={{header: () => <LoginHeader />, title: screenTitle("LoginScreen")}}
                    />
                    <SigninStack.Screen
                        name="ForgotPasswordScreen"
                        component={ForgotPasswordScreen}
                        options={{
                            header: () => <LoginHeader />,
                            title: screenTitle("ForgotPasswordScreen"),
                        }}
                    />
                </SigninStack.Navigator>
            )}
        </Tab.Screen>
        <Tab.Screen
            name="SignupScreen"
            component={TabSignupFormScreen}
            options={{title: screenTitle("SignupScreen")}}
        />
    </Tab.Navigator>
);

export default LoginNavigator;
