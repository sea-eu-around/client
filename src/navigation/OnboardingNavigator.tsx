import * as React from "react";
import {OnboardingScreens} from "../navigation/types";
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import {ONBOARDING_ORDER, ONBOARDING_SCREENS} from "../screens/onboarding";
import {rootNavigate} from "./utils";

const OnboardingStack = createMaterialTopTabNavigator<OnboardingScreens>();

const screens = ONBOARDING_ORDER.map((name: keyof OnboardingScreens, i: number) => {
    const ComponentClass = ONBOARDING_SCREENS[name];
    const hasNext = i < ONBOARDING_ORDER.length - 1;
    const next = () => {
        if (hasNext) rootNavigate(ONBOARDING_ORDER[i + 1]);
    };
    const previous = () => {
        if (i > 0) rootNavigate(ONBOARDING_ORDER[i - 1]);
    };

    class temp extends React.Component {
        render(): JSX.Element {
            return <ComponentClass next={next} previous={previous} index={i} hasNext={hasNext} />;
        }
    }

    return <OnboardingStack.Screen key={i} name={name} component={temp} />;
});

export default function OnboardingNavigator(): JSX.Element {
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
            lazy={true}
            lazyPreloadDistance={0}
        >
            {screens}
        </OnboardingStack.Navigator>
    );
}
