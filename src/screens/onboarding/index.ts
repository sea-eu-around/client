import {OnboardingScreens} from "../../navigation/types";
import OnboardingNameScreen from "./OnboardingNameScreen";
import OnboardingPersonalInfoScreen from "./OnboardingPersonalInfoScreen";
import OnboardingLanguageScreen from "./OnboardingLanguageScreen";
import OnboardingInterestsScreen from "./OnboardingInterestsScreen";
import OnboardingRoleScreen from "./OnboardingRoleScreen";
import OnboardingOffersScreen1 from "./OnboardingOffersScreen1";
import OnboardingOffersScreen2 from "./OnboardingOffersScreen2";
import OnboardingOffersScreen3 from "./OnboardingOffersScreen3";
import OnboardingRoleSpecificScreen from "./OnboardingRoleSpecificScreen";
import OnboardingTosScreen from "./OnboardingTosScreen";
import OnboardingPrivacyScreen from "./OnboardingPrivacyScreen";

export const ONBOARDING_SCREENS = {
    OnboardingNameScreen,
    OnboardingPersonalInfoScreen,
    OnboardingLanguageScreen,
    OnboardingInterestsScreen,
    OnboardingRoleScreen,
    OnboardingRoleSpecificScreen,
    OnboardingOffersScreen1,
    OnboardingOffersScreen2,
    OnboardingOffersScreen3,
    OnboardingTosScreen,
    OnboardingPrivacyScreen,
};

export const ONBOARDING_ORDER: (keyof OnboardingScreens)[] = [
    "OnboardingNameScreen",
    "OnboardingTosScreen",
    "OnboardingPrivacyScreen",
    "OnboardingPersonalInfoScreen",
    "OnboardingLanguageScreen",
    "OnboardingInterestsScreen",
    "OnboardingRoleScreen",
    "OnboardingRoleSpecificScreen",
    "OnboardingOffersScreen1",
    "OnboardingOffersScreen2",
    "OnboardingOffersScreen3",
];
