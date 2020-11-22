import * as Linking from "expo-linking";

export default {
    prefixes: [Linking.makeUrl("/"), "https://sea-eu-around.com"],
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
                    TabSignup: {
                        screens: {
                            SignupForm: "signup",
                        },
                    },
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
