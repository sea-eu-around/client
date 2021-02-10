import {LinkingOptions} from "@react-navigation/native";
import * as Linking from "expo-linking";
import {APP_SCHEME, CLIENT_URL} from "../constants/config";

const config: LinkingOptions = {
    prefixes: [Linking.makeUrl("/"), CLIENT_URL, `${APP_SCHEME}://`],
    config: {
        screens: {
            LoginRoot: {
                screens: {
                    WelcomeScreen: "welcome",
                    LoginScreens: {
                        screens: {
                            SigninScreen: "login",
                            ForgotPasswordScreen: "forgot-password",
                            SignupScreen: "signup",
                        },
                    },
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
                            MatchFilteringScreen: "match/filters",
                            MatchHistoryScreen: "match/history",
                        },
                    },
                    TabMessaging: {
                        screens: {
                            ChatRoomsScreen: "messaging",
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
                    OnboardingProfileScreen1: "onboarding/profile/1",
                    OnboardingProfileScreen2: "onboarding/profile/2",
                    OnboardingRoleScreen: "onboarding/role/1",
                    OnboardingRoleSpecificScreen: "onboarding/role/2",
                    OnboardingOffersScreen1: "onboarding/offers/1",
                    OnboardingOffersScreen2: "onboarding/offers/2",
                    OnboardingOffersScreen3: "onboarding/offers/3",
                    OnboardingLegalScreen1: "onboarding/tos",
                    OnboardingLegalScreen2: "onboarding/data",
                    OnboardingLegalScreen3: "onboarding/cookies",
                },
            },
            OnboardingSuccessfulScreen: "onboarding/success",
            NotFoundScreen: "*",
        },
    },
};

export default config;
