import {createStackNavigator} from "@react-navigation/stack";
import * as React from "react";
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import {LoginNavigatorTabs, LoginTabNavigatorScreens} from "../navigation/types";
import LoginTabBar from "../components/LoginTabBar";
import {SubTabLogin, SubTabForgotPassword} from "../screens/TabLoginScreen";
import TabSignupFormScreen from "../screens/TabSignupFormScreen";

const LoginTabStack = createStackNavigator<LoginTabNavigatorScreens>();
const SignupTabStack = createStackNavigator();
const Tab = createMaterialTopTabNavigator<LoginNavigatorTabs>();

function LoginTabNavigator(): JSX.Element {
    return (
        <LoginTabStack.Navigator initialRouteName="LoginForm">
            <LoginTabStack.Screen name="LoginForm" component={SubTabLogin} options={{headerShown: false}} />
            <LoginTabStack.Screen
                name="ForgotPassword"
                component={SubTabForgotPassword}
                options={{headerShown: false}}
            />
        </LoginTabStack.Navigator>
    );
}

function SignupTabNavigator(): JSX.Element {
    return (
        <SignupTabStack.Navigator>
            <SignupTabStack.Screen name="SignupForm" component={TabSignupFormScreen} options={{headerShown: false}} />
        </SignupTabStack.Navigator>
    );
}

export default function LoginNavigator(): JSX.Element {
    return (
        <Tab.Navigator initialRouteName="TabLogin" tabBar={(props) => <LoginTabBar {...props} />}>
            <Tab.Screen name="TabLogin" component={LoginTabNavigator} />
            <Tab.Screen name="TabSignup" component={SignupTabNavigator} />
        </Tab.Navigator>
    );
}
