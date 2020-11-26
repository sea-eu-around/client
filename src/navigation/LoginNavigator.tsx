import {createStackNavigator} from "@react-navigation/stack";
import * as React from "react";
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import LoginTabBar from "../components/LoginTabBar";
import {SubTabLogin, SubTabForgotPassword} from "../screens/TabLoginScreen";
import TabSignupFormScreen from "../screens/TabSignupFormScreen";
import {TabLoginRoot, TabLoginSigninScreens} from "./types";
import {screenTitle} from "./utils";

const SigninStack = createStackNavigator<TabLoginSigninScreens>();
const Tab = createMaterialTopTabNavigator<TabLoginRoot>();

const LoginNavigator = (): JSX.Element => (
    <Tab.Navigator tabBar={(props) => <LoginTabBar {...props} />}>
        <Tab.Screen name="TabSignin">
            {() => (
                <SigninStack.Navigator>
                    <SigninStack.Screen
                        name="LoginForm"
                        component={SubTabLogin}
                        options={{headerShown: false, title: screenTitle("LoginForm")}}
                    />
                    <SigninStack.Screen
                        name="ForgotPassword"
                        component={SubTabForgotPassword}
                        options={{headerShown: false, title: screenTitle("ForgotPassword")}}
                    />
                </SigninStack.Navigator>
            )}
        </Tab.Screen>
        <Tab.Screen name="TabSignup" component={TabSignupFormScreen} options={{title: screenTitle("TabSignup")}} />
    </Tab.Navigator>
);

export default LoginNavigator;
