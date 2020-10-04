import {OnboardingScreens} from "../../navigation/types";

export const ONBOARDING_ORDER: (keyof OnboardingScreens)[] = [
    "OnboardingNameScreen",
    "OnboardingPersonalInfoScreen",
    "OnboardingRoleScreen",
    "OnboardingDiscoverScreen",
    "OnboardingMeetScreen",
    "OnboardingCollaborateScreen",
    "OnboardingTosScreen",
];
