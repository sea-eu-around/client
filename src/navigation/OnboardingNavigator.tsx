import * as React from "react";
import {OnboardingScreens} from "../navigation/types";
import {createMaterialTopTabNavigator, MaterialTopTabScreenProps} from "@react-navigation/material-top-tabs";
import {ONBOARDING_ORDER, ONBOARDING_SCREENS} from "../screens/onboarding";

const OnboardingStack = createMaterialTopTabNavigator<OnboardingScreens>();

export default function OnboardingNavigator(): JSX.Element {
    const screens = ONBOARDING_ORDER.map((name: keyof OnboardingScreens, i: number) => {
        const ComponentClass = ONBOARDING_SCREENS[name];
        const Wrapper = (props: MaterialTopTabScreenProps<OnboardingScreens>): JSX.Element => (
            <ComponentClass
                next={() => {
                    if (i < ONBOARDING_ORDER.length - 1) props.navigation.navigate(ONBOARDING_ORDER[i + 1]);
                }}
                previous={() => {
                    if (i > 0) props.navigation.navigate(ONBOARDING_ORDER[i - 1]);
                }}
                index={i}
                hasNext={i < ONBOARDING_ORDER.length - 1}
                {...props}
            />
        );

        return <OnboardingStack.Screen key={i} name={name} component={Wrapper} />;
    });
    return (
        <OnboardingStack.Navigator
            initialRouteName={ONBOARDING_ORDER[0]}
            tabBarOptions={{showLabel: false, showIcon: false}}
            tabBar={() => <></>}
            springConfig={{
                stiffness: 500,
                damping: 2000,
                mass: 5,
            }}
            swipeEnabled={false}
        >
            {screens}
        </OnboardingStack.Navigator>
    );
}
