import * as React from "react";
import OnboardingSlide, {OnboardingSlideProps} from "./OnboardingSlide";
import OnboardingNameScreen from "./OnboardingNameScreen";
import OnboardingPersonalInfoScreen from "./OnboardingPersonalInfoScreen";
import OnboardingLanguageScreen from "./OnboardingLanguageScreen";
import OnboardingRoleScreen from "./OnboardingRoleScreen";
import OnboardingCollaborateScreen from "./OnboardingCollaborateScreen";
import OnboardingRoleSpecificScreen1 from "./OnboardingRoleSpecificScreen1";
import OnboardingRoleSpecificScreen2 from "./OnboardingRoleSpecificScreen2";
import OnboardingTosScreen1 from "./OnboardingTosScreen1";

export function OnboardingDiscoverScreen(props: Partial<OnboardingSlideProps>): JSX.Element {
    return <OnboardingSlide title="discover" subtitle="description" {...props}></OnboardingSlide>;
}

export function OnboardingMeetScreen(props: Partial<OnboardingSlideProps>): JSX.Element {
    return <OnboardingSlide title="meet" subtitle="description" {...props}></OnboardingSlide>;
}

export const ONBOARDING_SCREENS = {
    OnboardingNameScreen,
    OnboardingPersonalInfoScreen,
    OnboardingLanguageScreen,
    OnboardingRoleScreen,
    OnboardingRoleSpecificScreen1,
    OnboardingRoleSpecificScreen2,
    OnboardingCollaborateScreen,
    OnboardingDiscoverScreen,
    OnboardingMeetScreen,
    OnboardingTosScreen1,
};
