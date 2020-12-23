import {LinkingOptions} from "@react-navigation/native";
import * as Linking from "expo-linking";
import {APP_SCHEME, CLIENT_URL} from "../constants/config";

const config: LinkingOptions = {
    prefixes: [Linking.makeUrl("/"), CLIENT_URL, `${APP_SCHEME}://`],
    config: {
        screens: {
            LoginScreen: {
                screens: {
                    WelcomeScreen: "welcome",
                    SigninScreen: {
                        screens: {
                            LoginScreen: "login",
                            ForgotPasswordScreen: "forgot-password",
                        },
                    },
                    SignupScreen: "signup",
                },
            },
            ForgotPasswordEmailSentScreen: "password-email-sent",
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
                            MessagingScreen: "messaging",
                            ChatScreen: "chat/:roomId",
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
            ValidateEmailScreen: "validate/:token",
            ResetPasswordScreen: "reset-password/:token",
            ResetPasswordSuccessScreen: "password-reset",
            MyProfileScreen: "profile",
            ProfileScreen: "profile/:id",
            SettingsScreen: "settings",
            DeleteAccountScreen: "delete-account",
            DeleteAccountSuccessScreen: "account-deleted",
            OnboardingScreen: {
                screens: {
                    OnboardingNameScreen: "onboarding/name",
                    OnboardingPersonalInfoScreen: "onboarding/info",
                    OnboardingLanguageScreen: "onboarding/language",
                    OnboardingInterestsScreen: "onboarding/interests",
                    OnboardingRoleScreen: "onboarding/role/1",
                    OnboardingRoleSpecificScreen: "onboarding/role/2",
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
