import {MaterialTopTabScreenProps} from "@react-navigation/material-top-tabs";
import {OnboardingScreens} from "../../navigation/types";

export type OnboardingProps = {
    index: number;
    previous: () => void;
    next: () => void;
} & MaterialTopTabScreenProps<OnboardingScreens>;

export const ONBOARDING_ORDER: (keyof OnboardingScreens)[] = [
    //"OnboardingNameScreen",
    //"OnboardingPersonalInfoScreen",
    "OnboardingLanguageScreen",
    "OnboardingRoleScreen",
    "OnboardingRoleSpecificScreen1",
    //"OnboardingRoleSpecificScreen2",
    "OnboardingCollaborateScreen",
    "OnboardingDiscoverScreen",
    "OnboardingMeetScreen",
    "OnboardingTosScreen",
];
