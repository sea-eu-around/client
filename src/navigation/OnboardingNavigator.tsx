import * as React from "react";
import {OnboardingScreens} from "../navigation/types";
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import {ONBOARDING_ORDER, ONBOARDING_SCREENS} from "../screens/onboarding";
import {rootNavigate, screenTitle} from "./utils";

const OnboardingStack = createMaterialTopTabNavigator<OnboardingScreens>();

const screens = ONBOARDING_ORDER.map((name: keyof OnboardingScreens, i: number) => {
    const hasNext = i < ONBOARDING_ORDER.length - 1;
    const next = () => hasNext && rootNavigate(ONBOARDING_ORDER[i + 1]);
    const previous = () => i > 0 && rootNavigate(ONBOARDING_ORDER[i - 1]);

    const ComponentClass = ONBOARDING_SCREENS[name] as typeof React.Component;
    function Wrapper(): JSX.Element {
        return <ComponentClass next={next} previous={previous} index={i} hasNext={hasNext} />;
    }

    return <OnboardingStack.Screen key={i} name={name} component={Wrapper} options={{title: screenTitle(name)}} />;
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
