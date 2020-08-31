import {createStackNavigator} from "@react-navigation/stack";
import * as React from "react";
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import {LoginTabNavigatorScreens} from "../types";
import LoginTabBar from "../components/LoginTabBar";
import {SubTabLogin, SubTabForgotPassword} from "../screens/TabLoginScreen";
import TabSignupScreen from "../screens/TabSignupScreen";

type LoginTabs = {
    login: undefined;
    signup: undefined;
};

const LoginTabStack = createStackNavigator<LoginTabNavigatorScreens>();
const SignupTabStack = createStackNavigator();
const Tab = createMaterialTopTabNavigator<LoginTabs>();

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
            <SignupTabStack.Screen name="SignupForm" component={TabSignupScreen} options={{headerShown: false}} />
        </SignupTabStack.Navigator>
    );
}

export default function LoginNavigator(): JSX.Element {
    return (
        <Tab.Navigator initialRouteName="login" tabBar={(props) => <LoginTabBar {...props} />}>
            <Tab.Screen name="login" component={LoginTabNavigator} />
            <Tab.Screen name="signup" component={SignupTabNavigator} />
        </Tab.Navigator>
    );
}
