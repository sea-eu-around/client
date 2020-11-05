import {MaterialTopTabScreenProps} from "@react-navigation/material-top-tabs";
import {OnboardingScreens} from "../../navigation/types";

export type OnboardingProps = {
    index: number;
    previous: () => void;
    next: () => void;
} & MaterialTopTabScreenProps<OnboardingScreens>;

export const ONBOARDING_ORDER: (keyof OnboardingScreens)[] = [
    "OnboardingLanguageScreen",
    "OnboardingTosScreen",
    "OnboardingPrivacyScreen",
    "OnboardingNameScreen",
    "OnboardingPersonalInfoScreen",
    //"OnboardingLanguageScreen",
    "OnboardingInterestsScreen",
    "OnboardingRoleScreen",
    "OnboardingRoleSpecificScreen1",
    //"OnboardingRoleSpecificScreen2",
    "OnboardingOffersScreen1",
    "OnboardingOffersScreen2",
    "OnboardingOffersScreen3",
];
