import * as React from "react";
import {Text, TouchableOpacity} from "react-native";
import {rootNavigate} from "../../navigation/utils";
import OnboardingScreen, {OnboardingScreenProps} from "./OnboardingScreen";

let i = 0;

export function OnboardingNameScreen(props: Partial<OnboardingScreenProps>): JSX.Element {
    return <OnboardingScreen title="name" index={i++} {...props}></OnboardingScreen>;
}

export function OnboardingPersonalInfoScreen(props: Partial<OnboardingScreenProps>): JSX.Element {
    return <OnboardingScreen title="personal info" index={i++} {...props}></OnboardingScreen>;
}

export function OnboardingRoleScreen(props: Partial<OnboardingScreenProps>): JSX.Element {
    return <OnboardingScreen title="role" index={i++} {...props}></OnboardingScreen>;
}

export function OnboardingDiscoverScreen(props: Partial<OnboardingScreenProps>): JSX.Element {
    return <OnboardingScreen title="discover" index={i++} {...props}></OnboardingScreen>;
}

export function OnboardingMeetScreen(props: Partial<OnboardingScreenProps>): JSX.Element {
    return <OnboardingScreen title="meet" index={i++} {...props}></OnboardingScreen>;
}

export function OnboardingCollaborateScreen(props: Partial<OnboardingScreenProps>): JSX.Element {
    return <OnboardingScreen title="collaborate" index={i++} {...props}></OnboardingScreen>;
}

export function OnboardingTosScreen(props: Partial<OnboardingScreenProps>): JSX.Element {
    return (
        <OnboardingScreen title="tos" index={i++} {...props}>
            <TouchableOpacity onPress={() => rootNavigate("MainScreen")}>
                <Text>Finish boarding</Text>
            </TouchableOpacity>
        </OnboardingScreen>
    );
}

export const ONBOARDING_SCREENS = {
    OnboardingNameScreen,
    OnboardingPersonalInfoScreen,
    OnboardingRoleScreen,
    OnboardingDiscoverScreen,
    OnboardingMeetScreen,
    OnboardingCollaborateScreen,
    OnboardingTosScreen,
};
