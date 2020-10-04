import {CardStyleInterpolators, createStackNavigator} from "@react-navigation/stack";
import * as React from "react";
import {
    OnboardingDiscoverScreen,
    OnboardingMeetScreen,
    OnboardingNameScreen,
    OnboardingPersonalInfoScreen,
    OnboardingRoleScreen,
    OnboardingTosScreen,
    ONBOARDING_SCREENS,
} from "../screens/onboarding/screens";
import {OnboardingScreens} from "../navigation/types";
import Animated, {Easing} from "react-native-reanimated";
import {SceneRendererProps} from "react-native-tab-view";
import {ScreenStackProps} from "react-native-screens";
import {TransitionSpecs} from "@react-navigation/stack";
import {
    StackCardInterpolatedStyle,
    StackCardInterpolationProps,
    StackNavigationOptions,
    TransitionPreset,
    TransitionSpec,
    StackCardStyleInterpolator,
} from "@react-navigation/stack/lib/typescript/src/types";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {createMaterialTopTabNavigator, MaterialTopTabBarOptions} from "@react-navigation/material-top-tabs";
import {ONBOARDING_ORDER} from "../screens/onboarding";

/*
const transitionConfig = () => {
    return {
        transitionSpec: {
            duration: 450,
            easing: Easing.out(Easing.poly(4)),
            timing: Animated.timing,
            useNativeDriver: true,
        },
        screenInterpolator: (sceneProps: any) => {
            const {layout, position, scene} = sceneProps;

            const thisSceneIndex = scene.index;
            const width = layout.initWidth;

            const translateX = position.interpolate({
                inputRange: [thisSceneIndex - 1, thisSceneIndex],
                outputRange: [-width, 0],
                extrapolate: "clamp",
            });

            return {
                transform: [{translateX}],
            };
        },
    };
};
*/

const transitionSpec: TransitionSpec = {
    animation: "spring",
    config: {
        stiffness: 500,
        damping: 2000,
        mass: 2,
        overshootClamping: true,
        restSpeedThreshold: 0.5,
    },
};

const transitionSpec2: TransitionSpec = {
    animation: "timing",
    config: {
        duration: 500,
    },
};

const transitionConfig2: Partial<TransitionPreset> = {
    transitionSpec: {
        open: transitionSpec,
        close: transitionSpec,
    },
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    /*(props: StackCardInterpolationProps): StackCardInterpolatedStyle => {
        const {
            current,
            next,
            layouts: {screen},
        } = props;

        return {
            cardStyle: {
                translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-screen.width, 0],
                }),
            },
            overlayStyle: {
                translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -screen.width],
                    extrapolate: "clamp",
                }),
            },
        };
    },*/
    gestureDirection: "horizontal",
};

const OnboardingStack = createMaterialTopTabNavigator<OnboardingScreens>();

export default function OnboardingNavigator(): JSX.Element {
    const screens = ONBOARDING_ORDER.map((name: keyof OnboardingScreens, i: number) => {
        return <OnboardingStack.Screen key={i} name={name} component={ONBOARDING_SCREENS[name]} />;
    });

    return (
        <OnboardingStack.Navigator
            //headerMode="none"
            //mode="modal"
            initialRouteName={ONBOARDING_ORDER[0]}
            tabBarOptions={{showLabel: false, showIcon: false}}
            springConfig={{
                stiffness: 500,
                damping: 2000,
                mass: 5,
            }}
            //screenOptions={{...transitionConfig2, ...{gestureEnabled: true}}}
        >
            {screens}
        </OnboardingStack.Navigator>
    );
}
