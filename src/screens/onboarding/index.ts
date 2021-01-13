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
import OnboardingLegalScreen1 from "./OnboardingLegalScreen1";
import OnboardingLegalScreen2 from "./OnboardingLegalScreen2";
import OnboardingLegalScreen3 from "./OnboardingLegalScreen3";

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
    OnboardingLegalScreen1,
    OnboardingLegalScreen2,
    OnboardingLegalScreen3,
};

export const ONBOARDING_ORDER: (keyof OnboardingScreens)[] = [
    "OnboardingLegalScreen1",
    "OnboardingLegalScreen2",
    "OnboardingLegalScreen3",
    "OnboardingNameScreen",
    "OnboardingPersonalInfoScreen",
    "OnboardingLanguageScreen",
    "OnboardingInterestsScreen",
    "OnboardingRoleScreen",
    "OnboardingRoleSpecificScreen",
    "OnboardingOffersScreen1",
    "OnboardingOffersScreen2",
    "OnboardingOffersScreen3",
];
