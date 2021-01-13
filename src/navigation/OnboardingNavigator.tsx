import * as React from "react";
import {OnboardingScreens} from "../navigation/types";
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import {ONBOARDING_ORDER} from "../screens/onboarding";
import {screenTitle} from "./utils";
import OnboardingProgressBar from "../components/OnboardingProgressBar";
import {nextOnboardingSlide, previousOnboardingSlide} from "../state/auth/actions";
import store from "../state/store";
import {connect} from "react-redux";
import {AppState} from "../state/types";
import {ONBOARDING_SCREENS} from "../screens/onboarding/screens";

const OnboardingStack = createMaterialTopTabNavigator<OnboardingScreens>();

const screens = ONBOARDING_ORDER.map((name: keyof OnboardingScreens, i: number) => {
    const hasNext = i < ONBOARDING_ORDER.length - 1;
    const next = () => hasNext && store.dispatch(nextOnboardingSlide());
    const previous = () => i > 0 && store.dispatch(previousOnboardingSlide());

    const ComponentClass = ONBOARDING_SCREENS[name] as typeof React.Component;
    function Wrapper(): JSX.Element {
        return <ComponentClass next={next} previous={previous} index={i} hasNext={hasNext} />;
    }

    return <OnboardingStack.Screen key={i} name={name} component={Wrapper} options={{title: screenTitle(name)}} />;
});

const reduxConnector = connect((state: AppState) => ({
    onboardingIndex: state.auth.onboardingIndex,
}));

function OnboardingNavigator({onboardingIndex}: {onboardingIndex: number}): JSX.Element {
    return (
        <>
            <OnboardingStack.Navigator
                initialRouteName={ONBOARDING_ORDER[onboardingIndex]}
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
            <OnboardingProgressBar index={onboardingIndex} />
        </>
    );
}

export default reduxConnector(OnboardingNavigator);
