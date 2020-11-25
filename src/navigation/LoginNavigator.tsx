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

/*
function SigninTabNavigator(): JSX.Element {
    return (
        <SigninStack.Navigator initialRouteName="LoginForm">
            <SigninStack.Screen name="LoginForm" component={SubTabLogin} options={{headerShown: false}} />
            <SigninStack.Screen name="ForgotPassword" component={SubTabForgotPassword} options={{headerShown: false}} />
        </SigninStack.Navigator>
    );
}

function SignupTabNavigator(): JSX.Element {
    return (
        <SignupTabStack.Navigator>
            <SignupTabStack.Screen name="SignupForm" component={TabSignupFormScreen} options={{headerShown: false}} />
        </SignupTabStack.Navigator>
    );
}*/

const LoginNavigator = (): JSX.Element => (
    <Tab.Navigator initialRouteName="TabSignin" tabBar={(props) => <LoginTabBar {...props} />}>
        <Tab.Screen name="TabSignin">
            {() => (
                <SigninStack.Navigator initialRouteName="LoginForm">
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
