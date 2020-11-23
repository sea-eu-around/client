import {LinkingOptions} from "@react-navigation/native";
//import * as Linking from "expo-linking";

const config: LinkingOptions = {
    prefixes: [
        //Linking.makeUrl("/"),
        //"https://sea-eu-around.com",
        //"https://sea-eu-around.lad-dev.team/aas-app",
        //"https://ladislas14.github.io/",
        "sea-eu-around://",
    ],
    config: {
        screens: {
            LoginScreen: {
                screens: {
                    TabSignin: {
                        screens: {
                            LoginForm: "login",
                            ForgotPassword: "forgot-password",
                        },
                    },
                    TabSignup: "signup",
                },
            },
            ValidationEmailSentScreen: "validation-sent",
            MainScreen: {
                screens: {
                    TabHome: {
                        screens: {
                            TabHomeScreen: "home",
                        },
                    },
                    TabMatching: {
                        screens: {
                            TabMatchingScreen: "match",
                            MAtchFilteringScren: "match/filters",
                        },
                    },
                    TabMessaging: {
                        screens: {
                            ChatScreen: "messaging/talk",
                            MessagingScreen: "messaging",
                        },
                    },
                    TabProfile: {
                        screens: {
                            TabProfileScreen: "profile",
                        },
                    },
                    TabNotifications: {
                        screens: {
                            TabNotificationsScreen: "notifications",
                        },
                    },
                },
            },
            ValidateEmailSentScreen: "validate/success",
            ValidateEmailScreen: "validate",
            ChangePassword: "reset-password",
            OnboardingScreen: {
                screens: {
                    OnboardingNameScreen: "onboarding/name",
                    OnboardingPersonalInfoScreen: "onboarding/info",
                    OnboardingLanguageScreen: "onboarding/language",
                    OnboardingInterestsScreen: "onboarding/interests",
                    OnboardingRoleScreen: "onboarding/role/1",
                    OnboardingRoleSpecificScreen1: "onboarding/role/2",
                    OnboardingRoleSpecificScreen2: "onboarding/role/3",
                    OnboardingOffersScreen1: "onboarding/offers/1",
                    OnboardingOffersScreen2: "onboarding/offers/2",
                    OnboardingOffersScreen3: "onboarding/offers/3",
                    OnboardingTosScreen: "onboarding/tos",
                    OnboardingPrivacyScreen: "onboarding/privacy",
                },
            },
            OnboardingSuccessfulScreen: "onboarding/success",
            MatchSuccessScreen: "match/success",
            NotFoundScreen: "*",
        },
    },
};

export default config;
