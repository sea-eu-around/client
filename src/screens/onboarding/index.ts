import {OnboardingScreens} from "../../navigation/types";
import OnboardingNameScreen from "./OnboardingNameScreen";
import OnboardingPersonalInfoScreen from "./OnboardingPersonalInfoScreen";
import OnboardingLanguageScreen from "./OnboardingLanguageScreen";
import OnboardingInterestsScreen from "./OnboardingInterestsScreen";
import OnboardingRoleScreen from "./OnboardingRoleScreen";
import OnboardingOffersScreen1 from "./OnboardingOffersScreen1";
import OnboardingOffersScreen2 from "./OnboardingOffersScreen2";
import OnboardingOffersScreen3 from "./OnboardingOffersScreen3";
import OnboardingRoleSpecificScreen1 from "./OnboardingRoleSpecificScreen1";
import OnboardingRoleSpecificScreen2 from "./OnboardingRoleSpecificScreen2";
import OnboardingTosScreen from "./OnboardingTosScreen";
import OnboardingPrivacyScreen from "./OnboardingPrivacyScreen";

export const ONBOARDING_SCREENS = {
    OnboardingNameScreen,
    OnboardingPersonalInfoScreen,
    OnboardingLanguageScreen,
    OnboardingInterestsScreen,
    OnboardingRoleScreen,
    OnboardingRoleSpecificScreen1,
    OnboardingRoleSpecificScreen2,
    OnboardingOffersScreen1,
    OnboardingOffersScreen2,
    OnboardingOffersScreen3,
    OnboardingTosScreen,
    OnboardingPrivacyScreen,
};

export const ONBOARDING_ORDER: (keyof OnboardingScreens)[] = [
    "OnboardingTosScreen",
    "OnboardingPrivacyScreen",
    "OnboardingNameScreen",
    "OnboardingPersonalInfoScreen",
    "OnboardingLanguageScreen",
    "OnboardingInterestsScreen",
    "OnboardingRoleScreen",
    "OnboardingRoleSpecificScreen1",
    //"OnboardingRoleSpecificScreen2",
    "OnboardingOffersScreen1",
    "OnboardingOffersScreen2",
    "OnboardingOffersScreen3",
];
